import { router, protectedProcedure } from '../trpc.js';
import { z } from 'zod';
import { db } from '../db/index.js';
import { schedule } from '../db/schema.js';
import { eq, and } from 'drizzle-orm';
import { DEFAULT_SCHEDULE } from '../lib/defaultVazifalar.js';

export const scheduleRouter = router({
  get: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.user.id;
    let items = await db.select().from(schedule)
      .where(eq(schedule.userId, userId))
      .orderBy(schedule.orderIndex);

    if (items.length === 0) {
      await db.insert(schedule).values(DEFAULT_SCHEDULE.map(s => ({ ...s, userId })));
      items = await db.select().from(schedule)
        .where(eq(schedule.userId, userId))
        .orderBy(schedule.orderIndex);
    }

    return {
      schedule: items.map(s => ({
        id: s.id,
        vaqt: s.vaqt,
        endVaqt: s.endVaqt,
        ish: s.ish,
        time: s.vaqt,
        activity: s.ish,
      })),
    };
  }),

  create: protectedProcedure
    .input(z.object({ vaqt: z.string(), endVaqt: z.string().optional(), ish: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.user.id;
      const existing = await db.select().from(schedule).where(eq(schedule.userId, userId));
      const maxOrder = existing.reduce((max, s) => Math.max(max, s.orderIndex), -1);
      const [created] = await db.insert(schedule).values({
        userId, vaqt: input.vaqt, endVaqt: input.endVaqt, ish: input.ish, orderIndex: maxOrder + 1,
      }).returning();
      return created;
    }),

  update: protectedProcedure
    .input(z.object({ id: z.number(), vaqt: z.string().optional(), endVaqt: z.string().optional(), ish: z.string().optional() }))
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.user.id;
      const { id, ...data } = input;
      const [updated] = await db.update(schedule)
        .set({ ...data, updatedAt: new Date() })
        .where(and(eq(schedule.id, id), eq(schedule.userId, userId)))
        .returning();
      return updated;
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.user.id;
      await db.delete(schedule)
        .where(and(eq(schedule.id, input.id), eq(schedule.userId, userId)));
      return { success: true };
    }),
});
