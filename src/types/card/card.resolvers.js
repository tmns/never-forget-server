'use strict';

import { AuthenticationError } from 'apollo-server-core';

import { isAuthenticated } from '../../utils/auth';
import { Deck } from '../deck/deck.model';
import { Card } from './card.model';

async function card(_, args, ctx) {
  if (!isAuthenticated(ctx.session)) {
    throw new AuthenticationError('You must be logged in to do that!');
  }

  try {
    return await Card.findCard(args.id, ctx.session.user._id);
  } catch (err) {
    throw err;
  }
}

async function cards(_, args, ctx) {
  if (!isAuthenticated(ctx.session)) {
    throw new AuthenticationError('You must be logged in to do that!');
  }

  try {
    return await Card.findCards(args.deckId, ctx.session.user._id);
  } catch (err) {
    throw err;
  }
}

export default {
  Query: {
    card,
    cards
  },
  Mutation: {

  }
}