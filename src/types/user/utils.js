"use strict";

import { User } from "./user.model";
import bcrypt from "bcrypt";

async function createUser(username, password) {
  if (!isValidUsername(username) || !isValidPassword(password)) {
    throw new Error('Invalid username or password');
  }

  var users = await User.find({});
  var userNames = users.map(userObject => userObject.username);
  
  if (userNames.includes(username)) {
    throw new Error("Another user with this username already exists.");
  }
    
  return await User.create({
    username,
    password
  });
}

async function loginUser(username, password, session) {
  var user = await User.findOne({ username });
  if (user != null) {
    if (await user.checkPassword(password)) {
      session.user = {
        _id: user._id,
        username: user.username
      };
      return session.user;
    }
    throw new Error("Incorrect password.");
  }
  throw new Error("No such user exists.");
}

async function logoutUser(session) {
  var loggedOutUser = session.user;
  await session.destroy();
  return loggedOutUser;
}

async function findAndUpdatePassword(session, password) {
  if (!isValidPassword(password)) {
    throw new Error('Invalid password. Must be between eight and thirty two characters.');
  }

  var passwordHash = await bcrypt.hash(password, 12);

  var user = await User.findByIdAndUpdate(
    session.user._id,
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

async function findAndUpdateUsername(session, username) {
  if (!isValidUsername(username)) {
    throw new Error('Invalid username. Must be between two and sixteen characters.');
  }
  var user = await User.findByIdAndUpdate(
    session.user._id,
    { username },
    {
      useFindAndModify: false,
      new: true
    }
  )
    .lean()
    .exec();

  session.user.username = username;

  return { _id: user._id, username: user.username };
}

async function removeUser(session) {
  var removedUser = session.user;
  await session.destroy();
  await User.findByIdAndDelete(
    session.user._id
  )
  return removedUser;
}

function isAuthenticated(ctx) {
  return ctx.session.user && ctx.sessionID;
}

async function isAuthorized(userId, password) {
  if (password == '') {
    return false;
  }

  var user = await User.findById(userId);
  return await user.checkPassword(password);
}

function isValidPassword(password) {
  var length = password.length;
  return length >= 8 && length <= 64;
}

function isValidUsername(username) {
  var length = username.length;
  return length >= 2 && length <= 16;
}

export const utils = {
  createUser,
  findAndUpdateUsername,
  findAndUpdatePassword,
  isAuthenticated,
  isAuthorized,
  loginUser,
  logoutUser,
  removeUser
}