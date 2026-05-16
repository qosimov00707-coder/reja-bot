import { router, protectedProcedure } from '../trpc.js';
import { z } from 'zod';
import { db } from '../db/index.js';
import { mosques } from '../db/schema.js';
import { eq, and } from 'drizzle-orm';

export const mosquesRouter = router({
  list: protectedProcedure.query(async ({ ctx }) => {
    return db.select().from(mosques).where(eq(mosques.userId, ctx.user.id));
  }),

  create: protectedProcedure
    .input(z.object({ name: z.string(), address: z.string().optional(), city: z.string().default('Tashkent'), notes: z.string().optional() }))
    .mutation(async ({ ctx, input }) => {
      const [created] = await db.insert(mosques).values({ ...input, userId: ctx.user.id }).returning();
      return created;
    }),

  update: protectedProcedure
    .input(z.object({ id: z.number(), name: z.string().optional(), address: z.string().optional(), notes: z.string().optional() }))
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input;
      const [updated] = await db.update(mosques)
        .set({ ...data, updatedAt: new Date() })
        .where(and(eq(mosques.id, id), eq(mosques.userId, ctx.user.id)))
        .returning();
      return updated;
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      await db.delete(mosques).where(and(eq(mosques.id, input.id), eq(mosques.userId, ctx.user.id)));
      return { success: true };
    }),
});
