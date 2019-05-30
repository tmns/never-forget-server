import mongoose from 'mongoose';
import { UserInputError } from 'apollo-server-core';

const deckSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 24
    },
    description: {
      type: String,
      required: true,
      trim: true,
      maxlength: 40
    },
    createdBy: {
      type: mongoose.SchemaTypes.ObjectId,
      required: true,
      ref: 'user'
    }
  },
  { timestamps: true }
)

// static functions

deckSchema.statics.findDeck = async function(_id, createdBy) {
  var deck = await this.findOne({ _id, createdBy });
  if (!deck) {
    throw new UserInputError("A deck with this id doesn't exist");
  }
  return deck;
}

deckSchema.statics.findDecks = async function(createdBy) {
  var decks = await this.find({ createdBy });
  if (decks.length == 0) {
    throw new UserInputError("You don't have any decks!");
  }
  return decks;
}

deckSchema.statics.createDeck = async function(name, description, createdBy) {
  var foundDeck = await this.findOne({name, createdBy});
  if (foundDeck) {
    throw new UserInputError('A deck with this name already exists.');
  }

  return await this.create({ name, description, createdBy });
}

export const Deck = mongoose.model("deck", deckSchema);