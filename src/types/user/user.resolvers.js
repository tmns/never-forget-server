"use strict";

import { utils } from "./utils";

function whoami(_, args, ctx) {
  if (!utils.isAuthenticated(ctx)) {
    throw new Error("User not authenticated.");
  }
  return ctx.session.user;
}

function isLogin(_, args, ctx) {
  if (!utils.isAuthenticated(ctx)) {
    return false;
  }
  return true;
}

async function updateUsername(_, args, ctx) {
  if (!utils.isAuthenticated(ctx)) {
    throw new Error("User not authenticated.");
  }

  if (!(await utils.isAuthorized(ctx.session.user._id, args.input.password))) {
    throw new Error("Invalid password.");
  }

  return await utils.findAndUpdateUsername(ctx.session, args.input.username);
}

async function updatePassword(_, args, ctx) {
  if (!utils.isAuthenticated(ctx)) {
    throw new Error("User not authenticated.");
  }

  if (!(await utils.isAuthorized(ctx.session.user._id, args.input.password))) {
    throw new Error("Invalid password.");
  }

  if (args.input.password == args.input.newPassword) {
    throw new Error('New password must be different than current password.');
  }

  if (args.input.newPassword != args.input.confirmPassword) {
    throw new Error("Passwords do not match");
  }

  return await utils.findAndUpdatePassword(ctx.session, args.input.newPassword);
}

async function signup(_, args, ctx) {
  if (utils.isAuthenticated(ctx)) {
    throw new Error("You are already registered and logged in.");
  }

  if (args.input.password != args.input.confirmPassword) {
    throw new Error("Passwords do not match.");
  }

  return await utils.createUser(args.input.username, args.input.password);
}

async function login(_, args, ctx) {
  if (args.input.username == "" || args.input.password == "") {
    throw new Error("Username or password not valid");
  }

  return await utils.loginUser(
    args.input.username,
    args.input.password,
    ctx.session
  );
}

async function logout(_, args, ctx) {
  if (!utils.isAuthenticated(ctx)) {
    throw new Error("User not authenticated.");
  }
  return await utils.logoutUser(ctx.session);
}

async function deleteAccount(_, args, ctx) {
  if (!utils.isAuthenticated(ctx)) {
    throw new Error("User not authenticated.");
  }

  if (!(await utils.isAuthorized(ctx.session.user._id, args.input.password))) {
    throw new Error("Invalid password.");
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
