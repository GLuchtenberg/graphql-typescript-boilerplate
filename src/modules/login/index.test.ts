import { Connection } from "typeorm";

import { createOrmConnection } from "../../utils/orm-utils";
import { testRequest } from "../../test-utils/graphql-request";
import { TEST_HOST } from "../../process-variables";
import { invalidLogin, accountNotConfirmed } from "./error-messages";
import { User } from "../../entity/User";

let connection: Connection;

beforeAll(async () => {
  connection = await createOrmConnection();
});

afterAll(async () => {
  await connection.close();
});

describe("login", () => {
  const mutation = (email: string, password: string) => `
    mutation {
      login(email: "${email}", password: "${password}"){
        path
        message
      }
    }
  `;
  it("Should return error when the user doesnt exist", async () => {
    const email = "gabriel@a.com";
    const password = "1234";
    const response = await testRequest(TEST_HOST, mutation(email, password));
    const expectedError = [
      {
        path: "email",
        message: invalidLogin
      }
    ];
    expect(response.login).toMatchObject(expectedError);
  });
  it("Should return error when the user password doesnt match", async () => {
    const user = await User.create({
      email: "asdlogin@bob.com",
      password: "jlkajoioiqwe"
    }).save();
    const response = await testRequest(TEST_HOST, mutation(user.email, "2131"));
    const expectedError = [
      {
        path: "email",
        message: invalidLogin
      }
    ];
    expect(response.login).toMatchObject(expectedError);
  });
  it("Should return error when the user is not confirmed", async () => {
    const password = "jlkajoioiqwe";
    const user = await User.create({
      email: "loginconfirm@bob.com",
      confirmed: false,
      password
    }).save();
    const response = await testRequest(
      TEST_HOST,
      mutation(user.email, password)
    );
    const expectedError = [
      {
        path: "email",
        message: accountNotConfirmed
      }
    ];
    expect(response.login).toMatchObject(expectedError);
  });
  it("Should login", async () => {
    const password = "jlkajoioiqwe";
    const user = await User.create({
      email: "loginconfirmed@bob.com",
      confirmed: true,
      password
    });
    await user.save();
    const response = await testRequest(
      TEST_HOST,
      mutation(user.email, password)
    );

    expect(response.login).toBeNull();
  });
});
