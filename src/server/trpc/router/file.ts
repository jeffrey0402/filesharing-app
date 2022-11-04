import { router, publicProcedure, protectedProcedure } from "../trpc";
import { z } from "zod";
import fs from "fs";

export const fileRouter = router({
  filesFromUser: protectedProcedure
    .input(z.string())
    .query(({ ctx, input }) => {
      return ctx.prisma.file.findMany({
        where: {
          userId: input,
        },
      });
    }),
  delete: protectedProcedure.input(z.string()).mutation(async ({ ctx, input }) => {
    const file = await ctx.prisma.file.findUnique({
      where: {
        id: input,
      },
    });
    if (file == null) {
      return false;
    }
    if (file.userId !== ctx.session.user?.id) {
      return false;
    }
    // try to delete the file first
    try {
      fs.rmdirSync(`./uploads/${file.id}`, { recursive: true });
    } catch (e) {
      if (fs.existsSync(`./uploads/${file.id}`))
        return false;
    }


    await ctx.prisma.file.delete({
      where: {
        id: input,
      },
    });
    return true;
  }),
});
