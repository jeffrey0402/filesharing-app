// src/server/router/index.ts
import { t } from "../trpc";

import { fileUploadRouter } from "./fileUpload";

export const appRouter = t.router({
  upload: fileUploadRouter
});

// export type definition of API
export type AppRouter = typeof appRouter;
