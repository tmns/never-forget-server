import { Mongoose } from "mongoose";

const cardSchema = new Mongoose.Schema(
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
    deck: {
      type: Mongoose.SchemaTypes.ObjectId,
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

export const Card = mongoose.model('card', cardSchema)
