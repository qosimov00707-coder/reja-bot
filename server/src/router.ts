import { router } from './trpc.js';
import { authRouter } from './routers/auth.js';
import { tasksRouter } from './routers/tasks.js';
import { scheduleRouter } from './routers/schedule.js';
import { prayerTimesRouter } from './routers/prayerTimes.js';
import { mosquesRouter } from './routers/mosques.js';
import { settingsRouter } from './routers/settings.js';

export const appRouter = router({
  auth: authRouter,
  tasks: tasksRouter,
  schedule: scheduleRouter,
  prayerTimes: prayerTimesRouter,
  mosques: mosquesRouter,
  settings: settingsRouter,
});

export type AppRouter = typeof appRouter;
