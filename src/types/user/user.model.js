import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      minlength: 2,
      maxlength: 16
    },
    password: {
      type: String,
      required: true,
      trim: true,
      minlength: 8,
      maxlength: 64
    }
  },
  { timestamps: true }
);

userSchema.pre("save", async function(next) {
  if (!this.isModified("password")) {
    return next();
  }

  try {
    var hash = await bcrypt.hash(this.password, 12);
    this.password = hash;
    next();
  } catch (err) {
    return next(err);
  }
});

userSchema.methods.checkPassword = async function(password) {
  var passwordHash = this.password;
  return await bcrypt.compare(password, passwordHash);
};

export const User = mongoose.model("user", userSchema);
