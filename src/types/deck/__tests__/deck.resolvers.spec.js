import {
  AuthenticationError,
  ForbiddenError,
  UserInputError
} from "apollo-server-core";

import mongoose from "mongoose";

import resolvers from "../deck.resolvers";
import { Deck } from "../deck.model";

describe("Deck Resolvers", () => {
  test("deck returns deck associated with given id when user object attached to session", async () => {
    expect.assertions(2);
    var userId = mongoose.Types.ObjectId();
    var deck = await Deck.create({
      name: "name",
      description: "description",
      createdBy: userId
    });
    var args = {
      id: deck._id
    };
    var ctx = {
      session: {
        user: {
          _id: userId
        }
      }
    };

    var foundDeck = await resolvers.Query.deck(null, args, ctx);
    expect(`${foundDeck._id}`).toBe(`${deck._id}`);
    expect(`${foundDeck.createdBy}`).toBe(`${deck.createdBy}`);
  });

  test("deck throws AuthenticationError if user object not attached to session", async () => {
    var userId = mongoose.Types.ObjectId();
    var deck = await Deck.create({
      name: "name",
      description: "description",
      createdBy: userId
    });
    var args = {
      id: deck._id
    };
    var ctx = {
      session: {}
    };

    await expect(resolvers.Query.deck(null, args, ctx)).rejects.toThrow(
      AuthenticationError
    );
  });

  test("deck throws UserInputError if the given deck id doesn't match a deck id associated with the user's id", async () => {
    var userId = mongoose.Types.ObjectId();
    await Deck.create({
      name: "name",
      description: "description",
      createdBy: userId
    });

    // we will create a deck by another user, which will be the id this user attempts to request - in this way, we also test authZ at the same time
    var otherUserId = mongoose.Types.ObjectId();
    var otherUsersDeck = await Deck.create({
      name: "name",
      description: "description",
      createdBy: otherUserId
    });

    var args = {
      id: otherUsersDeck._id
    };
    var ctx = {
      session: {
        user: {
          _id: userId
        }
      }
    };

    await expect(resolvers.Query.deck(null, args, ctx)).rejects.toThrow(
      UserInputError
    );
  });

  test("decks returns all decks associated with user id if user object attached to session", async () => {
    expect.assertions(5);
    var userId = mongoose.Types.ObjectId();
    await Deck.create({
      name: "name1",
      description: "description",
      createdBy: userId
    });
    await Deck.create({
      name: "name2",
      description: "description",
      createdBy: userId
    });
    await Deck.create({
      name: "name3",
      description: "description",
      createdBy: userId
    });
    await Deck.create({
      name: "name4",
      description: "description",
      createdBy: userId
    });

    var ctx = {
      session: {
        user: {
          _id: userId
        }
      }
    };

    var decks = await resolvers.Query.decks(null, null, ctx);
    expect(decks).toHaveLength(4);
    decks.forEach(deck => expect(`${deck.createdBy}`).toBe(`${userId}`));
  });

  test("decks throws AuthenticationError when user object not attached to session", async () => {
    var userId = mongoose.Types.ObjectId();
    await Deck.create({
      name: "name1",
      description: "description",
      createdBy: userId
    });
    await Deck.create({
      name: "name2",
      description: "description",
      createdBy: userId
    });

    var ctx = {
      session: {}
    };

    await expect(resolvers.Query.decks(null, null, ctx)).rejects.toThrow(
      AuthenticationError
    );
  });

  test("decks throw UserInputError when no decks associated with user id exists", async () => {
    var userId = mongoose.Types.ObjectId();

    // create other user and associate decks with their id to also test authZ
    var otherUserId = mongoose.Types.ObjectId();
    await Deck.create({
      name: "name1",
      description: "description",
      createdBy: otherUserId
    });
    await Deck.create({
      name: "name2",
      description: "description",
      createdBy: otherUserId
    });

    var ctx = {
      session: {
        user: {
          _id: userId
        }
      }
    };

    await expect(resolvers.Query.decks(null, null, ctx)).rejects.toThrow(
      UserInputError
    );
  });

  test("newDeck returns new deck object if user object attached to session and valid name and description given", async () => {
    expect.assertions(3);
    var args = {
      input: {
        name: "new-deck",
        description: "description"
      }
    };
    var ctx = {
      session: {
        user: {
          _id: mongoose.Types.ObjectId()
        }
      }
    };

    var newDeck = await resolvers.Mutation.newDeck(null, args, ctx);
    expect(newDeck.name).toBe(args.input.name);
    expect(newDeck.description).toBe(args.input.description);
    expect(newDeck.createdBy).toBe(ctx.session.user._id);
  });

  test("newDeck throws AuthenticationError if user object not attached to session", async () => {
    var args = {
      input: {
        name: "new-deck",
        description: "description"
      }
    };
    var ctx = {
      session: {}
    };

    await expect(resolvers.Mutation.newDeck(null, args, ctx)).rejects.toThrow(
      AuthenticationError
    );
  });

  test("newDeck throws UserInputError if given deck name already exists and is associated with user's id", async () => {
    var userId = mongoose.Types.ObjectId();
    await Deck.create({
      name: "name",
      description: "description",
      createdBy: userId
    });
    var args = {
      input: {
        name: "name",
        description: "description"
      }
    };
    var ctx = {
      session: {
        user: {
          _id: userId
        }
      }
    };

    await expect(resolvers.Mutation.newDeck(null, args, ctx)).rejects.toThrow(
      UserInputError
    );
  });
});
