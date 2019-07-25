const SESSION_SECRET = process.env.SESSION_SECRET as string;
const TEST_HOST = process.env.TEST_HOST as string; // added on setup.ts
const SPARKPOST_API_KEY = process.env.SPARKPOST_API_KEY as string;
const NODE_ENV = process.env.NODE_ENV as string;
const FRONTEND_HOST = process.env.FRONTEND_HOS as string;

export {
  TEST_HOST,
  SPARKPOST_API_KEY,
  NODE_ENV,
  FRONTEND_HOST,
  SESSION_SECRET
};
