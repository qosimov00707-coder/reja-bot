import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import session from 'express-session';
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { createExpressMiddleware } from '@trpc/server/adapters/express';
import { appRouter } from './router.js';
import { db } from './db/index.js';
import { users, userSettings } from './db/schema.js';
import { eq } from 'drizzle-orm';
import type { User } from './db/schema.js';

const app = express();
const PORT = process.env.PORT || 3001;
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173';

// CORS
app.use(cors({
  origin: CLIENT_URL,
  credentials: true,
}));

app.use(express.json());

// Session
app.use(session({
  secret: process.env.SESSION_SECRET || 'dev-secret-change-in-prod',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
  },
}));

// Passport
app.use(passport.initialize());
app.use(passport.session());

// Serialize/deserialize
passport.serializeUser((user: any, done) => done(null, user.id));
passport.deserializeUser(async (id: number, done) => {
  try {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    done(null, user || null);
  } catch (err) {
    done(err, null);
  }
});

// Google Strategy
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID!,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
  callbackURL: `${process.env.SERVER_URL || 'http://localhost:' + PORT}/auth/google/callback`,
}, async (accessToken, refreshToken, profile, done) => {
  try {
    const googleId = profile.id;
    const email = profile.emails?.[0]?.value || '';
    const name = profile.displayName;
    const avatar = profile.photos?.[0]?.value;

    let [user] = await db.select().from(users).where(eq(users.googleId, googleId));

    if (!user) {
      [user] = await db.insert(users).values({ googleId, email, name, avatar }).returning();
      // Create default settings
      await db.insert(userSettings).values({ userId: user.id });
    } else {
      await db.update(users).set({ lastSignedIn: new Date(), avatar, name }).where(eq(users.id, user.id));
    }

    return done(null, user);
  } catch (err) {
    return done(err as Error, undefined);
  }
}));

// Auth routes
app.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

app.get('/auth/google/callback',
  passport.authenticate('google', { failureRedirect: `${CLIENT_URL}/login?error=auth_failed` }),
  (req, res) => {
    res.redirect(`${CLIENT_URL}/`);
  }
);

app.get('/auth/logout', (req, res) => {
  req.logout(() => {
    req.session.destroy(() => {
      res.redirect(`${CLIENT_URL}/login`);
    });
  });
});

// tRPC
app.use('/api/trpc', createExpressMiddleware({
  router: appRouter,
  createContext: ({ req, res }) => ({
    req,
    res,
    user: req.user as User | null,
  }),
}));

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
