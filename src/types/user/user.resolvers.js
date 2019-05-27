"use strict";

import { utils } from "./utils";

function me(_, args, ctx) {
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
  if (args.input.username == '') {
    throw new Error("Username must be provided");
  }

  if (!utils.isAuthenticated(ctx)) {
    throw new Error("User not authenticated.");
  }

  if (!(await utils.isAuthorized(ctx.session.user._id, args.input.password))) {
    throw new Error("Password not valid. User not authorized.");
  }

  return await utils.findAndUpdateUsername(ctx.session, args.input.username);
}

async function updatePassword(_, args, ctx) {
  if (args.input.newPassword == "") {
    throw new Error("New password not provided.");
  }

  if (!utils.isAuthenticated(ctx)) {
    throw new Error("User not authenticated.");
  }

  if (!(await utils.isAuthorized(ctx.session.user._id, args.input.password))) {
    throw new Error("Password not valid. User not authorized.");
  }

  if (args.input.newPassword !== args.input.confirmPassword) {
    throw new Error("Passwords do not match");
  }

  return await utils.findAndUpdatePassword(ctx.session, args.input.newPassword);
}

async function signup(_, args) {
  if (args.input.username == '' || args.input.password == '') {
    throw new Error('Username or password not valid');
  }

  if (args.input.password != args.input.confirmPassword) {
    throw new Error("Passwords do not match.");
  }

  return await utils.createUser(args.input.username, args.input.password);
}

async function login(_, args, ctx) {
  if (args.input.username == '' || args.input.password == '') {
    throw new Error('Username or password not valid');
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
    throw new Error('User not authenticated.');
  }

  if (!(await utils.isAuthorized(ctx.session.user._id, args.input.password))) {
    throw new Error("Password not valid. User not authorized.");
  }

  return await utils.removeUser(ctx.session);
}

export default {
  Query: {
    me,
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
