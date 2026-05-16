import { router, protectedProcedure } from '../trpc.js';
import { z } from 'zod';
import { db } from '../db/index.js';
import { userSettings } from '../db/schema.js';
import { eq } from 'drizzle-orm';

export const settingsRouter = router({
  get: protectedProcedure.query(async ({ ctx }) => {
    const [settings] = await db.select().from(userSettings).where(eq(userSettings.userId, ctx.user.id));
    if (!settings) {
      const [created] = await db.insert(userSettings).values({ userId: ctx.user.id }).returning();
      return created;
    }
    return settings;
  }),

  update: protectedProcedure
    .input(z.object({ city: z.string().optional(), timezone: z.string().optional(), prayerMethod: z.number().optional() }))
    .mutation(async ({ ctx, input }) => {
      const [updated] = await db.update(userSettings)
        .set({ ...input, updatedAt: new Date() })
        .where(eq(userSettings.userId, ctx.user.id))
        .returning();
      return updated;
    }),
});
