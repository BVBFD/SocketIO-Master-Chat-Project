import mongoose from 'mongoose';

interface DocumentResult<T> extends Document {
  _doc: T;
}

interface UserImpl extends DocumentResult<UserImpl> {
  email: string;
  password: string;
}

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model<UserImpl>('user', userSchema);
