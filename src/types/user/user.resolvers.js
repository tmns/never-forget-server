'use strict';

import { User } from './user.model';
import bcrypt from 'bcrypt';

function me(_, args, { req }) {
  if (!req.sessionID) {
    throw new Error('User not authenticated.');
  }
  return ctx.user;
}

function isLogin(_, args, { req }) {
  return typeof req.sessionID != 'undefined';
}

async function updateMe(_, args, { req }) {
  if (!req.sessionID) {
    throw new Error('User not authenticated.');
  }

  return await User.findByIdAndUpdate(ctx.user._id, args.input, { new: true })
    .select('-password')
    .lean()
    .exec();
}

async function signup(_, args) {
  var users = await User.find({});
  var userNames = users.map(userObject => userObject.username);
  
  if (userNames.includes(args.input.username)) {
    throw new Error('Another user with this username already exists.')
  }
  return await User.create({ ...args.input })
}

async function login(_, args, { req }) {
  var user = await User.findOne({username: args.input.username});
  if (user != null) {
    if (await bcrypt.compare(args.input.password, user.password)) {
      console.log(user)
      req.session.user = {
        _id: user._id,
        username: user.username
      };
      return req.session.user;
    }
    throw new Error('Incorrect password.');
  }
  throw new Error('No such user exists.');
}

export default {
  Query: {
    me,
    isLogin
  },
  Mutation: {
    updateMe,
    signup,
    login
  }
}