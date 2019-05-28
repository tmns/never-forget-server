import resolvers from "../user.resolvers";
import mongoose from "mongoose";
import { AuthenticationError, ForbiddenError } from "apollo-server-core";
import { User } from "../user.model.js";

describe("Resolvers", () => {
  test("isLogin returns true if user object acttached to session", () => {
    var result = resolvers.Query.isLogin(null, null, {
      session: {
        user: {}
      }
    });
    expect(result).toBe(true);
  });

  test("isLogin returns false if user object not attached to session", () => {
    var result = resolvers.Query.isLogin(null, null, {
      session: {}
    });
    expect(result).toBe(false);
  });

  test("whoami returns username and userid if user object attached to session", () => {
    var ctx = {
      session: {
        user: {
          _id: 123212,
          username: "test-user"
        }
      }
    };

    var result = resolvers.Query.whoami(null, null, ctx);
    expect(result._id).toBe(ctx.session.user._id);
    expect(result.username).toBe(ctx.session.user.username);
  });

  test("whoami throws AuthenticationError if user object not attached to session", () => {
    var ctx = {
      session: {}
    };

    expect(() => resolvers.Query.whoami(null, null, ctx)).toThrow(
      AuthenticationError
    );
  });

  test("updateUsername updates username if user is authNd and authZd and valid username was given", async () => {
    expect.assertions(2);
    var user = await User.create({ username: "name", password: "test1234" });
    var args = {
      input: {
        username: "updated-name",
        password: "test1234"
      }
    };
    var ctx = {
      session: {
        user: {
          _id: user._id,
          username: user.username
        }
      }
    };

    var result = await resolvers.Mutation.updateUsername(null, args, ctx);
    expect(`${result._id}`).toBe(`${user._id}`);
    expect(result.username).toBe(args.input.username);
  });


  test("updateUsername throws AuthenticationError if user object not attached to session", () => {
    var args = {
      input: {
        username: "updated-name",
        password: "test1234"
      }
    };
    var ctx = {
      session: {}
    };

    expect(() => resolvers.Mutation.updateUsername(null, args, ctx)).toThrow(
      AuthenticationError
    );
  });


  test("updateUsername throws ForbiddenError if supplied password is incorrect", async () => {
    var user = await User.create({ username: "name", password: "test1234" });
    var args = {
      input: {
        username: "updated-name",
        password: "incorrect-password"
      }
    };
    var ctx = {
      session: {
        user: {
          _id: user._id,
          usernmae: user.username
        }
      }
    };

    expect(async () => await resolvers.Mutation.updateUsername(null, args, ctx)).toThrow(
      ForbiddenError
    );
  });
});
