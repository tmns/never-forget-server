import mongoose from "mongoose";
import { UserInputError } from "apollo-server-core";

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
      ref: "user"
    }
  },
  { timestamps: true }
);

// static functions

deckSchema.statics.findDeck = async function(_id, createdBy) {
  var deck = await this.findOne({ _id, createdBy }).lean();
  if (!deck) {
    throw new UserInputError("A deck with this id doesn't exist");
  }
  return deck;
};

deckSchema.statics.findDecks = async function(createdBy) {
  var decks = await this.find({ createdBy }).lean();
  if (decks.length == 0) {
    throw new UserInputError("You don't have any decks!");
  }
  return decks;
};

deckSchema.statics.createDeck = async function(name, description, createdBy) {
  var foundDeck = await this.findOne({ name, createdBy }).lean();
  if (foundDeck) {
    throw new UserInputError("A deck with this name already exists.");
  }

  var deck = await this.create({ name, description, createdBy });
  return deck;
};

deckSchema.statics.findAndUpdateDeck = async function(
  _id,
  name,
  description,
  createdBy
) {
  var foundDeck = await this.findOne({ _id, createdBy });
  if (!foundDeck) {
    throw new UserInputError("A deck with this id doesn't exist");
  }
  return await this.findByIdAndUpdate(
    _id,
    { name, description },
    { new: true }
  ).lean();
};

deckSchema.statics.findAndDeleteDeck = async function(_id, createdBy) {
  var foundDeck = await this.findOne({ _id, createdBy });
  if (!foundDeck) {
    throw new UserInputError("A deck with this id doesn't exist");
  }
  return await this.findByIdAndDelete(_id).lean();
};

export const Deck = mongoose.model("deck", deckSchema);
