import type { NextApiRequest } from "next";
import mime from "mime";
import { join } from "path";
import * as dateFn from "date-fns";
import formidable from "formidable";
import { mkdir, stat } from "fs/promises";
import crypto from "crypto";

// export const FormidableError = formidable.errors.FormidableError;

export const parseForm = async (
  req: NextApiRequest
): Promise<{ fields: formidable.Fields; files: formidable.Files }> => {
  return await new Promise(async (resolve, reject) => {
    // create random slug for the form
    const randomSlug = crypto.randomBytes(16).toString("hex");
    const uploadDir = join(
      process.env.ROOT_DIR || process.cwd(),
      `/public/uploads/${randomSlug}`
    );

    try {
      await stat(uploadDir);
    } catch (e: any) {
      if (e.code === "ENOENT") {
        await mkdir(uploadDir, { recursive: true });
      } else {
        console.error(e);
        reject(e);
        return;
      }
    }

    let filename = ""; //  To avoid duplicate upload
    const form = formidable({
      uploadDir,
      multiples: false,
      keepExtensions: true,
      // filter: (part) => {
      //   return (
      //     part.name === "media" && (part.mimetype?.includes("image") || false)
      //   );
      // },
    });

    form.parse(req, function (err, fields, files) {
      if (err) reject(err);
      else resolve({ fields, files });
    });
  });
};
