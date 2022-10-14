import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import fs from "fs";

const prisma = new PrismaClient();

const upload = async (req: NextApiRequest, res: NextApiResponse) => {
    const { url, password } = req.query;
    
};