import { User } from "../../entity/User";
import { ResolverMap } from "../../types/graphql-utils";
import { createMiddleware } from "../../utils/create-middleware";
import middleware from "./middleware";

const resolvers: ResolverMap = {
  Query: {
    me: createMiddleware(middleware, (_, __, { session }) =>
      User.findOne({ where: { id: session.userId } })
    )
  }
};

export { resolvers };
