"use strict";

import { Deck } from "./deck.model";

import {
  AuthenticationError,
  ForbiddenError,
  UserInputError
} from "apollo-server-core";

import { isAuthenticated } from "../../utils/auth";

async function deck(_, args, ctx) {
  if (!isAuthenticated(ctx.session)) {
    throw new AuthenticationError("You must be logged in to do that!");
  }

  try {
    return await Deck.findDeck(args.id, ctx.session.user._id);
  } catch (err) {
    throw err;
  }
}

async function decks(_, args, ctx) {
  if (!isAuthenticated(ctx.session)) {
    throw new AuthenticationError("You must be logged in to do that!");
  }

  try {
    return await Deck.findDecks(ctx.session.user._id);
  } catch (err) {
    throw err;
  }
}

async function newDeck(_, args, ctx) {
  if (!isAuthenticated(ctx.session)) {
    throw new AuthenticationError("You must be logged in to do that!");
  }

  try {
    return await Deck.createDeck(
      args.input.name,
      args.input.description,
      ctx.session.user._id
    );
  } catch (err) {
    throw err;
  }
}

async function updateDeck(_, args, ctx) {
  if (!isAuthenticated(ctx.session)) {
    throw new AuthenticationError("You must be logged in to do that!");
  }

  try {
    return await Deck.findAndUpdateDeck(
      args.id,
      args.input.name,
      args.input.description,
      ctx.session.user._id
    );
  } catch (err) {
    throw err;
  }
}

export default {
  Query: {
    deck,
    decks
  },
  Mutation: {
    newDeck,
    updateDeck
  }
};
