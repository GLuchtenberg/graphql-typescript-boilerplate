import * as bcrypt from "bcryptjs";
import * as yup from "yup";
import { User } from "../../entity/User";
import { ResolverMap } from "../../types/graphql-utils";
import { formatYupError } from "../../utils/format-errors";
import {
  emailDuplicated,
  emailNotLongEnough,
  passwordNotLongEnough,
  emailNotValid
} from "./error-messages";

const schema = yup.object().shape({
  email: yup
    .string()
    .min(8, emailNotLongEnough)
    .max(255)
    .email(emailNotValid),
  password: yup
    .string()
    .min(3, passwordNotLongEnough)
    .max(255)
});

const resolvers: ResolverMap = {
  Query: {
    bye: () => "bye"
  },
  Mutation: {
    register: async (_, args: GQL.IRegisterOnMutationArguments) => {
      try {
        await schema.validate(args, { abortEarly: false });
      } catch (e) {
        return formatYupError(e);
      }
      const { email, password } = args;
      const userAlreadyExists = await User.findOne({
        where: { email },
        select: ["id"]
      });
      if (userAlreadyExists) {
        return [
          {
            path: "email",
            message: emailDuplicated
          }
        ];
      }
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = User.create({
        email,
        password: hashedPassword
      });
      await user.save();
      return null;
    }
  }
};

export { resolvers };
