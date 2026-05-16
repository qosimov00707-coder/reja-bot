import { router, protectedProcedure } from '../trpc.js';
import { db } from '../db/index.js';
import { userSettings } from '../db/schema.js';
import { eq } from 'drizzle-orm';
import { getPrayerTimes } from '../lib/prayerTimes.js';

export const prayerTimesRouter = router({
  getToday: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.user.id;
    const [settings] = await db.select().from(userSettings).where(eq(userSettings.userId, userId));
    const city = settings?.city || 'Tashkent';
    const method = settings?.prayerMethod || 2;
    return getPrayerTimes(city, method);
  }),
});
