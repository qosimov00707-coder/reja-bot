import { router, protectedProcedure } from '../trpc.js';
import { z } from 'zod';
import { db } from '../db/index.js';
import { taskCompletions, vazifalar } from '../db/schema.js';
import { and, eq, gte, lte, between } from 'drizzle-orm';
import { DEFAULT_VAZIFALAR } from '../lib/defaultVazifalar.js';

export const tasksRouter = router({
  getByDate: protectedProcedure
    .input(z.object({ date: z.string() }))
    .query(async ({ ctx, input }) => {
      const userId = ctx.user.id;
      
      // Get user's vazifalar
      let userVazifalar = await db.select().from(vazifalar)
        .where(and(eq(vazifalar.userId, userId), eq(vazifalar.isActive, true)))
        .orderBy(vazifalar.orderIndex);

      // If no vazifalar, seed defaults
      if (userVazifalar.length === 0) {
        await db.insert(vazifalar).values(
          DEFAULT_VAZIFALAR.map(v => ({ ...v, userId }))
        );
        userVazifalar = await db.select().from(vazifalar)
          .where(and(eq(vazifalar.userId, userId), eq(vazifalar.isActive, true)))
          .orderBy(vazifalar.orderIndex);
      }

      // Get completions for this date
      const completions = await db.select().from(taskCompletions)
        .where(and(eq(taskCompletions.userId, userId), eq(taskCompletions.date, input.date)));

      return {
        tasks: completions,
        vazifalar: userVazifalar,
      };
    }),

  getByRange: protectedProcedure
    .input(z.object({ startDate: z.string(), endDate: z.string() }))
    .query(async ({ ctx, input }) => {
      const userId = ctx.user.id;
      const tasks = await db.select().from(taskCompletions)
        .where(and(
          eq(taskCompletions.userId, userId),
          gte(taskCompletions.date, input.startDate),
          lte(taskCompletions.date, input.endDate)
        ));
      return { tasks };
    }),

  getStreak: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.user.id;
    const today = new Date();
    let streak = 0;
    
    for (let i = 0; i < 365; i++) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      
      const dayTasks = await db.select().from(taskCompletions)
        .where(and(eq(taskCompletions.userId, userId), eq(taskCompletions.date, dateStr)));
      
      const completedCount = dayTasks.filter(t => t.completed).length;
      const totalVazifalar = await db.select().from(vazifalar)
        .where(and(eq(vazifalar.userId, userId), eq(vazifalar.isActive, true)));
      
      if (totalVazifalar.length > 0 && completedCount >= Math.ceil(totalVazifalar.length * 0.5)) {
        streak++;
      } else if (i > 0) {
        break;
      }
    }
    
    return { streak };
  }),

  toggle: protectedProcedure
    .input(z.object({
      date: z.string(),
      taskId: z.string(),
      completed: z.boolean(),
    }))
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.user.id;
      const { date, taskId, completed } = input;

      const existing = await db.select().from(taskCompletions)
        .where(and(
          eq(taskCompletions.userId, userId),
          eq(taskCompletions.taskId, taskId),
          eq(taskCompletions.date, date)
        ));

      if (existing.length > 0) {
        await db.update(taskCompletions)
          .set({ completed, completedAt: completed ? new Date() : null })
          .where(and(
            eq(taskCompletions.userId, userId),
            eq(taskCompletions.taskId, taskId),
            eq(taskCompletions.date, date)
          ));
      } else {
        await db.insert(taskCompletions).values({
          userId,
          taskId,
          date,
          completed,
          completedAt: completed ? new Date() : null,
        });
      }

      return { date, taskId, completed };
    }),
});
