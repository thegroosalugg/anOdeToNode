import { model, Schema } from 'mongoose';

const { ObjectId } = Schema.Types;

const required = true;

const itemSchema = new Schema({
  name: {
    type: String,
    required,
  },
  desc: {
    type: String,
    required,
  },
  imgURL: {
    type: String,
    required,
  },
  price: {
    type: Number,
    required,
  },
  userId: {
    type: ObjectId,
    ref: 'User',
    required,
  },
});

export default model('Item', itemSchema);
