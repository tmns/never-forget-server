"use strict";

import { AuthenticationError } from "apollo-server-core";

import { isAuthenticated } from "../../utils/auth";
import { Deck } from "./deck.model";

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
      args.input.name.trim(),
      args.input.description.trim(),
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
      args.input.name.trim(),
      args.input.description.trim(),
      ctx.session.user._id
    );
  } catch (err) {
    throw err;
  }
}

async function removeDeck(_, args, ctx) {
  if (!isAuthenticated(ctx.session)) {
    throw new AuthenticationError("You must be logged in to do that!");
  }

  try {
    return await Deck.findAndDeleteDeck(
      args.id,
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
    updateDeck,
    removeDeck
  }
};
