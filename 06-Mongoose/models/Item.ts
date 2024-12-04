import { ObjectId } from "mongodb";
import { model, Schema } from "mongoose";

const required = true;

const itemSchema = new Schema({
  name: {
    type: String,
    required
  },
  desc: {
    type: String,
    required
  },
  imgURL: {
    type: String,
    required
  },
  price: {
    type: Number,
    required
  },
  userId: {
    type: ObjectId,
    required
  },
})

export default model('Item', itemSchema);
