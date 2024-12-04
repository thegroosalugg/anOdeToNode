// import { ObjectId } from 'mongodb';
import { model, Schema } from "mongoose";

const required = true;

const userSchema = new Schema({
  name: {
    type: String,
    required
  },
  email: {
    type: String,
    required
  },
})

export default model('User', userSchema);
