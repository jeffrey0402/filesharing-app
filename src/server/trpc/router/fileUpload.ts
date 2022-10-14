import { t } from "../trpc";
import { z } from "zod";

export const fileUploadRouter = t.router({
  upload: t.procedure
    .input(
      z.object({
        url: z.string().url().nullish(),
        name: z.string(),
        password: z.string().nullish(),
      })
    )
    .query(({ input }) => {
      return {
        message: `File uploaded successfully`,
      };
    }),
});