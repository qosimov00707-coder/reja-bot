import { router, publicProcedure, protectedProcedure } from '../trpc.js';
import { TRPCError } from '@trpc/server';

export const authRouter = router({
  me: protectedProcedure.query(async ({ ctx }) => {
    return ctx.user;
  }),

  logout: protectedProcedure.mutation(async ({ ctx }) => {
    return new Promise((resolve) => {
      ctx.req.session.destroy(() => {
        resolve({ success: true });
      });
    });
  }),
});
