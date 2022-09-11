import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema(
  {
    from: {
      type: String,
      required: true,
    },
    room: {
      type: String,
      required: true,
    },
    text: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model('message', messageSchema);
