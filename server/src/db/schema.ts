import { pgTable, bigserial, text, boolean, timestamp, bigint, integer, date, unique } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: bigserial('id', { mode: 'number' }).primaryKey(),
  googleId: text('google_id').unique().notNull(),
  name: text('name').notNull(),
  email: text('email').unique().notNull(),
  avatar: text('avatar'),
  role: text('role').notNull().default('user'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
  lastSignedIn: timestamp('last_signed_in', { withTimezone: true }).defaultNow(),
});

export const userSettings = pgTable('user_settings', {
  id: bigserial('id', { mode: 'number' }).primaryKey(),
  userId: bigint('user_id', { mode: 'number' }).references(() => users.id, { onDelete: 'cascade' }).unique().notNull(),
  city: text('city').notNull().default('Tashkent'),
  timezone: text('timezone').notNull().default('Asia/Tashkent'),
  prayerMethod: integer('prayer_method').notNull().default(2),
  telegramChatId: bigint('telegram_chat_id', { mode: 'number' }),
  telegramActive: boolean('telegram_active').default(false),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
});

export const vazifalar = pgTable('vazifalar', {
  id: bigserial('id', { mode: 'number' }).primaryKey(),
  userId: bigint('user_id', { mode: 'number' }).references(() => users.id, { onDelete: 'cascade' }).notNull(),
  taskId: text('task_id').notNull(),
  nomi: text('nomi').notNull(),
  emoji: text('emoji').notNull().default('✅'),
  orderIndex: integer('order_index').notNull().default(0),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
}, (t) => ({
  uniqueUserTask: unique().on(t.userId, t.taskId),
}));

export const taskCompletions = pgTable('task_completions', {
  id: bigserial('id', { mode: 'number' }).primaryKey(),
  userId: bigint('user_id', { mode: 'number' }).references(() => users.id, { onDelete: 'cascade' }).notNull(),
  taskId: text('task_id').notNull(),
  date: date('date').notNull(),
  completed: boolean('completed').default(false),
  completedAt: timestamp('completed_at', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
}, (t) => ({
  uniqueUserTaskDate: unique().on(t.userId, t.taskId, t.date),
}));

export const schedule = pgTable('schedule', {
  id: bigserial('id', { mode: 'number' }).primaryKey(),
  userId: bigint('user_id', { mode: 'number' }).references(() => users.id, { onDelete: 'cascade' }).notNull(),
  vaqt: text('vaqt').notNull(),
  endVaqt: text('end_vaqt'),
  ish: text('ish').notNull(),
  orderIndex: integer('order_index').notNull().default(0),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
});

export const mosques = pgTable('mosques', {
  id: bigserial('id', { mode: 'number' }).primaryKey(),
  userId: bigint('user_id', { mode: 'number' }).references(() => users.id, { onDelete: 'cascade' }).notNull(),
  name: text('name').notNull(),
  address: text('address'),
  city: text('city').notNull().default('Tashkent'),
  prayerMethod: integer('prayer_method').default(2),
  notes: text('notes'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
});

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type UserSettings = typeof userSettings.$inferSelect;
export type Vazifa = typeof vazifalar.$inferSelect;
export type TaskCompletion = typeof taskCompletions.$inferSelect;
export type Schedule = typeof schedule.$inferSelect;
export type Mosque = typeof mosques.$inferSelect;
