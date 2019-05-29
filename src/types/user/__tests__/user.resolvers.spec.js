import resolvers from "../user.resolvers";
import bcrypt from "bcrypt";
import {
  AuthenticationError,
  ForbiddenError,
  UserInputError
} from "apollo-server-core";
import { User } from "../user.model.js";

describe("User Resolvers", () => {
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

    var updatedUser = await User.findById(result._id);
    expect(updatedUser.username).toBe(args.input.username);
  });

  test("updateUsername throws AuthenticationError if user object not attached to session", async () => {
    var args = {
      input: {
        username: "updated-name",
        password: "test1234"
      }
    };
    var ctx = {
      session: {}
    };

    await expect(
      resolvers.Mutation.updateUsername(null, args, ctx)
    ).rejects.toThrow(AuthenticationError);
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
          username: user.username
        }
      }
    };

    await expect(
      resolvers.Mutation.updateUsername(null, args, ctx)
    ).rejects.toThrow(ForbiddenError);
  });

  test("updateUsername throws ForbiddenError if supplied password is empty string", async () => {
    var user = await User.create({ username: "name", password: "test1234" });
    var args = {
      input: {
        username: "updated-name",
        password: ""
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

    await expect(
      resolvers.Mutation.updateUsername(null, args, ctx)
    ).rejects.toThrow(ForbiddenError);
  });

  test("updateUsername throws UserInputError if new username is same as current username", async () => {
    var user = await User.create({
      username: "same-name",
      password: "test1234"
    });
    var args = {
      input: {
        username: "same-name",
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

    await expect(
      resolvers.Mutation.updateUsername(null, args, ctx)
    ).rejects.toThrow(UserInputError);
  });

  test("updateUsername throws UserInputError if new username is not valid (ie not between 2 and 16 chars)", async () => {
    var user = await User.create({ username: "name", password: "test1234" });
    var args = {
      input: {
        username: "a",
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

    await expect(
      resolvers.Mutation.updateUsername(null, args, ctx)
    ).rejects.toThrow(UserInputError);
  });

  test("updatePassword updates password of authNd and authZd user when given valid inputs", async () => {
    expect.assertions(2);
    var user = await User.create({ username: "name", password: "password" });
    var args = {
      input: {
        password: "password",
        newPassword: "updated-password",
        confirmPassword: "updated-password"
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

    var result = await resolvers.Mutation.updatePassword(null, args, ctx);
    expect(`${result._id}`).toBe(`${user._id}`);

    var updatedUser = await User.findById(result._id);
    var same = await bcrypt.compare(
      args.input.newPassword,
      updatedUser.password
    );
    expect(same).toBe(true);
  });

  test("updatePassword throws AuthenticationΕrror if user object not attached to session", async () => {
    var args = {
      input: {
        password: "password",
        newPassword: "updated-password",
        confirmPassword: "updated-password"
      }
    };
    var ctx = {
      session: {}
    };

    await expect(
      resolvers.Mutation.updatePassword(null, args, ctx)
    ).rejects.toThrow(AuthenticationError);
  });

  test("updatePassword throws ForbiddenError if supplied password is incorrect", async () => {
    var user = await User.create({ username: "name", password: "test1234" });
    var args = {
      input: {
        password: "incorrect-password",
        newPassword: "new-password",
        confirmPassword: "new-password"
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

    await expect(
      resolvers.Mutation.updatePassword(null, args, ctx)
    ).rejects.toThrow(ForbiddenError);
  });

  test("updatPassword throws ForbiddenError if supplied password is empty string", async () => {
    var user = await User.create({ username: "name", password: "test1234" });
    var args = {
      input: {
        password: "",
        newPassword: "new-password",
        confirmPassword: "new-password"
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

    await expect(
      resolvers.Mutation.updatePassword(null, args, ctx)
    ).rejects.toThrow(ForbiddenError);
  });

  test("updatePassword throws UserInputError if new password is same as current password", async () => {
    var user = await User.create({
      username: "name",
      password: "same-password"
    });
    var args = {
      input: {
        password: "same-password",
        newPassword: "same-password",
        confirmPassword: "same-password"
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

    await expect(
      resolvers.Mutation.updatePassword(null, args, ctx)
    ).rejects.toThrow(UserInputError);
  });

  test("updatePassword throws UserInputError if new password and confirmation of new password values are not the same", async () => {
    var user = await User.create({ username: "name", password: "test1234" });
    var args = {
      input: {
        password: "test1234",
        newPassword: "new-password",
        confirmPassword: "not-the-same"
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

    await expect(
      resolvers.Mutation.updatePassword(null, args, ctx)
    ).rejects.toThrow(UserInputError);
  });

  test("updatePassword throws UserInputError if new password is not valid (ie not between 8 and 64 chars)", async () => {
    var user = await User.create({ username: "name", password: "test1234" });
    var args = {
      input: {
        password: "test1234",
        newPassword: "abc",
        confirmPassword: "abc"
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

    await expect(
      resolvers.Mutation.updatePassword(null, args, ctx)
    ).rejects.toThrow(UserInputError);
  });

  test("signup registers a user when given valid inputs", async () => {
    var args = {
      input: {
        username: "new-user",
        password: "password",
        confirmPassword: "password"
      }
    };
    var ctx = {
      session: {}
    };
    var newUser = await resolvers.Mutation.signup(null, args, ctx);
    await expect(User.findById(newUser._id)).toBeTruthy();
  });

  test('signup throws ForbiddenError when user trys to signup while already authenticated', async () => {
    var args = {
      input: {
        username: "new-user",
        password: "password",
        confirmPassword: "password"
      }
    };
    var ctx = {
      session: {
        user: {
          username: 'username',
          _id: '123456'
        }
      }
    };

    await expect(
      resolvers.Mutation.signup(null, args, ctx)
    ).rejects.toThrow(ForbiddenError);
  })

  test('signup throws UserInputError when password and confirm password do not match', async () => {
    var args = {
      input: {
        username: "new-user",
        password: "new-password",
        confirmPassword: "not-the-same"
      }
    };
    var ctx = {
      session: {}
    };

    await expect(
      resolvers.Mutation.signup(null, args, ctx)
    ).rejects.toThrow(UserInputError);
  })

  test('signup throws UserInputError if given username is not valid (ie not between 2 and 16 chars)', async () => {
    var args = {
      input: {
        username: "a",
        password: "test1234"
      }
    };
    var ctx = {
      session: {}
    };

    await expect(
      resolvers.Mutation.signup(null, args, ctx)
    ).rejects.toThrow(UserInputError);
  })

  test('signup throws UserInputError if given password is not valid (ie not between 8 and 64 chars)', async () => {
    var args = {
      input: {
        username: "new-user",
        password: "1234567"
      }
    };
    var ctx = {
      session: {}
    };

    await expect(
      resolvers.Mutation.signup(null, args, ctx)
    ).rejects.toThrow(UserInputError);
  })

  test('signup throws UserInputError if given username already exists in database', async () => {
    await User.create({ username: "same-name", password: "password"})
    var args = {
      input: {
        username: "same-name",
        password: "12345678"
      }
    };
    var ctx = {
      session: {}
    };

    await expect(
      resolvers.Mutation.signup(null, args, ctx)
    ).rejects.toThrow(UserInputError);
  })

  test('login authenticates a user when given a valid username and password combination', async () => {
    var user = await User.create({ username: "name", password: "password" });
    var args = {
      input: {
        username: "name",
        password: "password"
      }
    }
    var ctx = {
      session: {}
    }
    await resolvers.Mutation.login(null, args, ctx);
    expect(`${ctx.session.user._id}`).toBe(`${user._id}`);
  })

  
});
