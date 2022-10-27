import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import formidable from "formidable";
import fs from "fs";

const prisma = new PrismaClient();

const upload = async (req: NextApiRequest, res: NextApiResponse) => {
  // handle query params
  const { url, password } = req.query;
  if (Array.isArray(url) || Array.isArray(password)) {
    return res.status(400).json({ error: "Invalid query params" });
  }

  
  // check if custom url exists
  if (url) {
    const bannedUrls = ["admin", "login", "register", "upload", "api", "index", "files", "file"];
    if (bannedUrls.includes(url)) {
      return res.status(400).json({ error: "Invalid url" });
    }
    
    const searchFile = await prisma.file.findFirst({
      where: {
        OR: [
          {
            id: url,
          },
          {
            slug: url,
          },
        ],
      },
    });
    if (searchFile) {
      return res.status(400).json({
        message: "Custom url already exists",
      });
    }
  }

  // parse form
  const form = formidable({
    multiples: true,
    keepExtensions: true,
    uploadDir: "./temp",
  });

  form.parse(req, async (err, fields, files) => {
    if (err) {
      return res.status(400).json({
        status: "fail",
        message: "Error while parsing the files",
        error: err,
      });
    }

    if (!files.file) {
      return res.status(400).json({
        status: "fail",
        message: "No file found",
      });
    }
    if (Array.isArray(files.file)) {
      // handle multiple files
    } else {
      // handle single file
      const file = files.file;

      // create file in db
      const newFile = await prisma.file.create({
        data: {
          slug: url != null ? (url as string) : null,
          filename: file.originalFilename != null ? file.originalFilename : "",
          password: password != null ? (password as string) : null,
        },
      });

      // move file to proper directory
      try {
        fs.mkdirSync(`./uploads/${newFile.id}`, { recursive: true });
        fs.renameSync(
          file.filepath,
          `./uploads/${newFile.id}/${file.originalFilename}`
        );
      } catch (e) {
        // failed to move file, delete from DB.
        console.log("deleting " + newFile.id);
        prisma.file.delete({
          where: {
            id: newFile.id,
          },
        });
        fs.rmdirSync(`./uploads/${newFile.id}`, { recursive: true });

        return res.status(400).json({
          status: "fail",
          message: "Error while moving the file",
          error: e,
        });
      }
      return res.status(200).json({
        status: "success",
        message: "File uploaded successfully",
        file: newFile,
        url: `${process.env.NEXT_PUBLIC_BASE_URL}/api/download/${
          url != null ? (url as string) : newFile.id
        }`,
      });
    }
  });
};

// disable default nextjs behavior
export const config = {
  api: {
    bodyParser: false,
  },
};

export default upload;
