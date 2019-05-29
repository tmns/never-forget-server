"use strict";

import { utils } from "./utils";
import { AuthenticationError, ForbiddenError, UserInputError } from "apollo-server-core";

function isLogin(_, args, ctx) {
  return utils.isAuthenticated(ctx.session);
}

function whoami(_, args, ctx) {
  if (!utils.isAuthenticated(ctx.session)) {
    throw new AuthenticationError('You must be logged in to do that!');
  }
  return ctx.session.user;
}

async function updateUsername(_, args, ctx) {
  if (!utils.isAuthenticated(ctx.session)) {
    throw new AuthenticationError('You must be logged in to do that!');
  }

  if (!(await utils.isAuthorized(ctx.session.user._id, args.input.password))) {
    throw new ForbiddenError("Invalid password.");
  }

  try {
    return await utils.findAndUpdateUsername(ctx.session, args.input.username);
  } catch(err) {
    throw err;
  }
}

async function updatePassword(_, args, ctx) {
  if (!utils.isAuthenticated(ctx.session)) {
    throw new AuthenticationError('You must be logged in to do that!');
  }

  if (!(await utils.isAuthorized(ctx.session.user._id, args.input.password))) {
    throw new ForbiddenError("Invalid password.");
  }

  if (args.input.password == args.input.newPassword) {
    throw new UserInputError('New password must be different than current password.');
  }

  if (args.input.newPassword != args.input.confirmPassword) {
    throw new UserInputError("Passwords do not match");
  }

  try {
    return await utils.findAndUpdatePassword(ctx.session, args.input.newPassword);
  } catch(err) {
    throw err;
  }
}

async function signup(_, args, ctx) {
  if (utils.isAuthenticated(ctx.session)) {
    throw new ForbiddenError("You are already registered and logged in.");
  }

  if (args.input.password != args.input.confirmPassword) {
    throw new UserInputError("Passwords do not match.");
  }

  try {
    return await utils.createUser(args.input.username, args.input.password);
  } catch(err) {
    throw err;
  }
}

async function login(_, args, ctx) {
  if (utils.isAuthenticated(ctx.session)) {
    throw new ForbiddenError("You are already logged in.");
  }
  try {
    return await utils.loginUser(
      args.input.username,
      args.input.password,
      ctx.session
    );
  } catch (err) {
    throw err;
  }
}

async function logout(_, args, ctx) {
  if (!utils.isAuthenticated(ctx.session)) {
    throw new AuthenticationError('You must be logged in to do that!');
  }
  return await utils.logoutUser(ctx.session);
}

async function deleteAccount(_, args, ctx) {
  if (!utils.isAuthenticated(ctx.session)) {
    throw new AuthenticationError('You must be logged in to do that!');
  }

  if (!(await utils.isAuthorized(ctx.session.user._id, args.input.password))) {
    throw new ForbiddenError("Invalid password.");
  }

  return await utils.removeUser(ctx.session);
}

export default {
  Query: {
    whoami,
    isLogin
  },
  Mutation: {
    updateUsername,
    updatePassword,
    signup,
    login,
    logout,
    deleteAccount
  }
};
