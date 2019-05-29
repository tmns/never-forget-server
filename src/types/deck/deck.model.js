import mongoose from 'mongoose';

const deckSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
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

export const Deck = mongoose.model("deck", deckSchema);