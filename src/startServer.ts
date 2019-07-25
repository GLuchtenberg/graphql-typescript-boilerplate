import "reflect-metadata";
import "dotenv/config";
import { GraphQLServer } from "graphql-yoga";
import * as session from "express-session";
import * as connectRedis from "connect-redis";
import { redis } from "./redis";
import { createOrmConnection } from "./utils/orm-utils";
import { confirmEmail } from "./routes/confirm-email";
import { generateSchema } from "./utils/generate-schema";
import { NODE_ENV, FRONTEND_HOST, SESSION_SECRET } from "./process-variables";

const RedisStore = connectRedis(session);

export const startServer = async () => {
  const server = new GraphQLServer({
    schema: generateSchema(),
    context: ({ request }) => ({
      redis,
      url: `${request.protocol}://${request.get("host")}`,
      session: request.session
    })
  });
  server.express.use(
    session({
      name: "qid",
      secret: SESSION_SECRET || "asdasd",
      resave: false,
      saveUninitialized: false,
      store: new RedisStore({
        client: redis as any
      }),
      cookie: {
        httpOnly: NODE_ENV === "production",
        secure: NODE_ENV === "production",
        maxAge: 1000 * 60 * 60 * 24 * 7 // 7 days
      }
    })
  );

  const cors = {
    credentials: true,
    origin: NODE_ENV === "test" ? "*" : FRONTEND_HOST
  };

  server.express.get("/confirm/:id", confirmEmail);

  const connection = await createOrmConnection();
  const app = await server.start({
    cors,
    port: process.env.NODE_ENV === "test" ? 0 : 4000
  });
  console.log("Server is running on localhost:4000");

  return { app, connection };
};
