import {
  AuthenticationError,
  UserInputError
} from "apollo-server-core";

import mongoose from "mongoose";

import resolvers from "../card.resolvers";
import { Card } from "../card.model";



function createCardObject(prompt, deckId, userId) {
  return {
    prompt: prompt ? prompt : 'prompt',
    target: 'target',
    promptExample: 'prompt-ex',
    targetExample: 'target-ex',
    timeAdded: 1231,
    nextReview: 1234,
    intervalProgress: 3,
    deckId: deckId ? deckId : mongoose.Types.ObjectId(),
    createdBy: userId ? userId : mongoose.Types.ObjectId() 
  }
}

describe('Card Resolvers', () => {
  test('card returns card associated with given id when user object attached to session', async () => {
    expect.assertions(2);
    var card = await Card.create(createCardObject());
    var args = {
      id: card._id
    }
    var ctx = {
      session: {
        user: {
          _id: card.createdBy
        }
      }
    }
    
    var foundCard = await resolvers.Query.card(null, args, ctx);
    expect(`${foundCard._id}`).toBe(`${card._id}`);
    expect(`${foundCard.createdBy}`).toBe(`${card.createdBy}`)
  })

  test("card throws AuthenticationError if user object not attached to session", async () => {
    var card = Card.create(createCardObject());
    var args = {
      id: card._id
    };
    var ctx = {
      session: {}
    };

    await expect(resolvers.Query.card(null, args, ctx)).rejects.toThrow(
      AuthenticationError
    );
  });

  test("card throws UserInputError if the given card id doesn't match a card id associated with the user's id", async () => {
    var usersCard = await Card.create(createCardObject());

    // we will create a card by another user, which will be the id this user attempts to request - in this way, we also test authZ
    var otherUsersCard = await Card.create(createCardObject());

    var args = {
      id: otherUsersCard._id
    };
    var ctx = {
      session: {
        user: {
          _id: usersCard.createdBy
        }
      }
    };

    await expect(resolvers.Query.card(null, args, ctx)).rejects.toThrow(
      UserInputError
    );
  });

})