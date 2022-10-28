// src/server/trpc/router/_app.ts
import { router } from "../trpc";
import { exampleRouter } from "./example";
import { authRouter } from "./auth";
import { fileRouter } from "./file";

export const appRouter = router({
  example: exampleRouter,
  auth: authRouter,
  file: fileRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
