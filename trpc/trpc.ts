import { TRPCError, initTRPC } from "@trpc/server";
import { getServerSession } from "next-auth";

const t = initTRPC.create();
const middelware = t.middleware;
const isAuth = middelware(async (opts) => {
  const sessoion = await getServerSession();

  if (!sessoion) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }

  return opts.next({
    ctx: {
      expires: sessoion.expires,
    },
  });
});

export const router = t.router;
export const publicProcedure = t.procedure;
export const privateProcedure = t.procedure.use(isAuth);
