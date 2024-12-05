import { model, Schema } from 'mongoose';

const { ObjectId } = Schema.Types;

const required = true;

const userSchema = new Schema({
  name: {
    type: String,
    required,
  },
  email: {
    type: String,
    required,
  },
  cart: [
    {
      itemId: { type: ObjectId, ref: 'Item', required },
      quantity: {
        type: Number,
        min: 1,
        required,
      },
    },
  ],
});

export default model('User', userSchema);
