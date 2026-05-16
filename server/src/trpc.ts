import { initTRPC, TRPCError } from '@trpc/server';
import type { Request, Response } from 'express';
import type { User } from './db/schema.js';
import superjson from 'superjson';

export interface Context {
  req: Request;
  res: Response;
  user: User | null;
}

const t = initTRPC.context<Context>().create({ transformer: superjson });

export const router = t.router;
export const publicProcedure = t.procedure;

export const protectedProcedure = t.procedure.use(({ ctx, next }) => {
  if (!ctx.user) {
    throw new TRPCError({ code: 'UNAUTHORIZED', message: 'Please login (10001)' });
  }
  return next({ ctx: { ...ctx, user: ctx.user } });
});
