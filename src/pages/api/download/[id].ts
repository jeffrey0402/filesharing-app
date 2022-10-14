import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import fs from "fs";
import stream from 'stream';
import { promisify } from 'util';

const prisma = new PrismaClient();
const pipeline = promisify(stream.pipeline);

const upload = async (req: NextApiRequest, res: NextApiResponse) => {
    const { id, password } = req.query;
    if (Array.isArray(id) || Array.isArray(password)) {
        return res.status(400).json({ error: "Invalid query params" });
    }
    // check if url is custom url
    const fileDb = await prisma.file.findFirst({
        where: {
            OR: [
                {
                    slug: id,
                },
                {
                    id: id,
                    password: password,
                },
            ]
        },
    });
    if (!fileDb) {
        return res.status(400).json({
            message: "File not found",
        });
    }
    try {
        const file = fs.createReadStream(`./uploads/${fileDb.id}/${fileDb.filename}`);
        res.setHeader('Content-Type', "application/octet-stream");
        res.setHeader('Content-Disposition', `attachment; filename=${fileDb.filename}`);
        await pipeline(file, res);
    } catch(e) {
        return res.status(400).json({
            message: "File not found",
        });
    }
    
};

export default upload;