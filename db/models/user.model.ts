import { Document, model, Schema } from "mongoose";

export interface IUser extends Document {
  email: string;
  password: string;
  token: string;
}

const UserSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    token: { type: String },
  },
  {
    timestamps: true,
  }
);

export default model<IUser>("user", UserSchema);
