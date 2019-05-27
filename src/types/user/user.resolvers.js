"use strict";

import { User } from "./user.model";
import bcrypt from "bcrypt";

function me(_, args, ctx) {
  if (!ctx.session.user || !ctx.sessionID) {
    throw new Error("User not authenticated.");
  }
  return ctx.session.user;
}

function isLogin(_, args, ctx) {
  if (!ctx.session.user || !ctx.sessionID) {
    return false;
  }
  return true;
}

async function updateUsername(_, args, ctx) {
  if (!ctx.session.user || !ctx.sessionID) {
    throw new Error("User not authenticated.");
  }

  if (args.input.password == "") {
    throw new Error("Password not provided. User not authorized.");
  }

  var isAuthz = await checkPassword(ctx.session.user._id, args.input.password);

  if (!isAuthz) {
    throw new Error("Password not valid. User not authorized.");
  }

  var user = await User.findByIdAndUpdate(
    ctx.session.user._id,
    { username: args.input.username },
    {
      useFindAndModify: false,
      new: true
    }
  )
    .lean()
    .exec();

  ctx.session.user.username = user.username;

  return { _id: user._id, username: user.username };
}

async function updatePassword(_, args, ctx) {
  if (!ctx.session.user || !ctx.sessionID) {
    throw new Error("User not authenticated.");
  }

  if (args.input.password == "") {
    throw new Error("Password not provided. User not authorized.");
  }

  if (args.input.newPassword == "") {
    throw new Error("New password not provided.");
  }

  var isAuthz = await checkPassword(ctx.session.user._id, args.input.password);
  console.log(isAuthz);
  if (!isAuthz) {
    throw new Error("Password not valid. User not authorized.");
  }

  if (args.input.newPassword !== args.input.confirmPassword) {
    throw new Error("Passwords do not match");
  }

  var passwordHash = await bcrypt.hash(args.input.newPassword, 12);

  var user = await User.findByIdAndUpdate(
    ctx.session.user._id,
    { password: passwordHash },
    {
      useFindAndModify: false,
      new: true
    }
  )
    .lean()
    .exec();

  return { _id: user._id, username: user.username };
}

async function signup(_, args) {
  if (args.input.password != args.input.confirmPassword) {
    throw new Error("Passwords do not match.");
  }

  var users = await User.find({});
  var userNames = users.map(userObject => userObject.username);

  if (userNames.includes(args.input.username)) {
    throw new Error("Another user with this username already exists.");
  }

  var passwordHash = bcrypt.hash(args.input.password, 12);

  return await User.create({
    username: args.input.username,
    password: passwordHash
  });
}

async function login(_, args, { req }) {
  var user = await User.findOne({ username: args.input.username });
  if (user != null) {
    if (await bcrypt.compare(args.input.password, user.password)) {
      req.session.user = {
        _id: user._id,
        username: user.username
      };
      return req.session.user;
    }
    throw new Error("Incorrect password.");
  }
  throw new Error("No such user exists.");
}

// *********** general helper functions ***********

async function checkPassword(userId, password) {
  var user = await User.findById(userId);
  console.log(user);
  var passwordHash = user.password;
  var result = await bcrypt.compare(password, passwordHash);
  return result;
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
    login
  }
};
