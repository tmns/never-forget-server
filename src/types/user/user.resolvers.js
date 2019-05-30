"use strict";

import { User } from './user.model';

import { 
  AuthenticationError, 
  ForbiddenError, 
  UserInputError 
} from "apollo-server-core";

import { 
  isAuthenticated, 
  isAuthorized, 
  loginUser, 
  logoutUser 
} from '../../utils/auth';


function isLogin(_, args, ctx) {
  return isAuthenticated(ctx.session);
}

function whoami(_, args, ctx) {
  if (!isAuthenticated(ctx.session)) {
    throw new AuthenticationError('You must be logged in to do that!');
  }
  return ctx.session.user;
}

async function updateUsername(_, args, ctx) {
  if (!isAuthenticated(ctx.session)) {
    throw new AuthenticationError('You must be logged in to do that!');
  }

  if (!(await isAuthorized(ctx.session.user._id, args.input.password))) {
    throw new ForbiddenError("Invalid password.");
  }

  try {
    return await User.findAndUpdateUsername(ctx.session, args.input.username);
  } catch(err) {
    throw err;
  }
}

async function updatePassword(_, args, ctx) {
  if (!isAuthenticated(ctx.session)) {
    throw new AuthenticationError('You must be logged in to do that!');
  }

  if (!(await isAuthorized(ctx.session.user._id, args.input.password))) {
    throw new ForbiddenError("Invalid password.");
  }

  if (args.input.password == args.input.newPassword) {
    throw new UserInputError('New password must be different than current password.');
  }

  if (args.input.newPassword != args.input.confirmPassword) {
    throw new UserInputError("Passwords do not match");
  }

  try {
    return await User.findAndUpdatePassword(ctx.session, args.input.newPassword);
  } catch(err) {
    throw err;
  }
}

async function signup(_, args, ctx) {
  if (isAuthenticated(ctx.session)) {
    throw new ForbiddenError("You are already registered and logged in.");
  }

  if (args.input.password != args.input.confirmPassword) {
    throw new UserInputError("Passwords do not match.");
  }

  try {
    return await User.createUser(args.input.username, args.input.password);
  } catch(err) {
    throw err;
  }
}

async function login(_, args, ctx) {
  if (isAuthenticated(ctx.session)) {
    throw new ForbiddenError("You are already logged in.");
  }
  try {
    return await loginUser(
      args.input.username,
      args.input.password,
      ctx.session
    );
  } catch (err) {
    throw err;
  }
}

async function logout(_, args, ctx) {
  if (!isAuthenticated(ctx.session)) {
    throw new AuthenticationError('You must be logged in to do that!');
  }
  return await logoutUser(ctx.session);
}

async function deleteAccount(_, args, ctx) {
  if (!isAuthenticated(ctx.session)) {
    throw new AuthenticationError('You must be logged in to do that!');
  }

  if (!(await isAuthorized(ctx.session.user._id, args.input.password))) {
    throw new ForbiddenError("Invalid password.");
  }

  return await User.removeUser(ctx.session);
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
