import mongoose from "mongoose";
import { UserInputError } from "apollo-server-core";

const cardSchema = new mongoose.Schema(
  {
    prompt: {
      type: String,
      required: true,
      trim: true,
      maxlength: 300
    },
    target: {
      type: String,
      required: true,
      trim: true,
      maxlength: 300
    },
    promptExample: {
      type: String,
      trim: true,
      maxlength: 300
    },
    targetExample: {
      type: String,
      trim: true,
      maxlength: 300,
    },
    timeAdded: {
      type: Number,
      required: true
    },
    nextReview: {
      type: Number,
      required: true
    },
    intervalProgress: {
      type: Number,
      required: true
    },
    deckId: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'deck',
      required: true
    },
    createdBy: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'user',
      required: true
    }
  }
)

// static functions

cardSchema.statics.findCard = async function(_id, createdBy) {
  var card = await this.findOne({ _id, createdBy }).lean();
  if (!card) {
    throw new UserInputError("A card with this id doesn't exist");
  }
  return card;
}

cardSchema.statics.findCards = async function(deckId, createdBy) {
  var cards = await this.find({ deckId, createdBy });
  if (cards.length == 0) {
    throw new UserInputError("No cards associated with this deck!");
  }
  return cards;
}

export const Card = mongoose.model('card', cardSchema)
