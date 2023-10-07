import { TRPCError, initTRPC } from "@trpc/server";

const t = initTRPC.create();
const middelware = t.middleware;
// const isAuth = middelware(async (opts) => {
//   const { getUser } = getKindeServerSession();
//   const user = getUser();

//   if (!user || !user.id) {
//     throw new TRPCError({ code: "UNAUTHORIZED" });
//   }

//   return opts.next({
//     ctx: {
//       userId: user.id,
//       user,
//     },
//   });
// });

export const router = t.router;
export const publicProcedure = t.procedure;
// export const privateProcedure = t.procedure.use(isAuth);