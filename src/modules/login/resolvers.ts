import * as bcrypt from "bcryptjs";
import { User } from "../../entity/User";
import { ResolverMap } from "../../types/graphql-utils";
import { invalidLogin, accountNotConfirmed } from "./error-messages";

const errorResponse = [
  {
    path: "email",
    message: invalidLogin
  }
];

const resolvers: ResolverMap = {
  Query: {
    bye2: () => "bye"
  },
  Mutation: {
    login: async (
      _,
      { email, password }: GQL.ILoginOnMutationArguments,
      { session }
    ) => {
      const user = await User.findOne({ where: { email } });
      if (!user) {
        return errorResponse;
      }
      const validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword) {
        return errorResponse;
      }
      if (!user.confirmed) {
        return [
          {
            path: "email",
            message: accountNotConfirmed
          }
        ];
      }

      session.userId = user.id;
      return null;
    }
  }
};

export { resolvers };
