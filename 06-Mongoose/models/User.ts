import { Model, model, Types, Schema } from 'mongoose';

const required = true;

interface IUser {
   name: string;
  email: string;
   cart: { itemId: Types.ObjectId | string; quantity: number }[];
}

interface IUserMethods {
  updateCart: (_id: string, quantity: 1 | -1) => void;
}

type UserModel = Model<IUser, {}, IUserMethods>;

const userSchema = new Schema<IUser, UserModel, IUserMethods>({
  name: {
    type: String,
    required,
  },
  email: {
    type: String,
    unique: true,
    required,
  },
  cart: [
    {
      itemId: { type: Schema.Types.ObjectId, ref: 'Item', required },
      quantity: {
        type: Number,
        min: 1,
        required,
      },
    },
  ],
});

userSchema.methods.updateCart = async function(_id, quantity) {
  const index = this.cart.findIndex(({ itemId }) => itemId.toString() === _id);

  if (index !== -1) {
    this.cart[index].quantity += quantity;

    if (this.cart[index].quantity <= 0) {
      this.cart.splice(index, 1);
    }
  } else if (quantity === 1) {
    // mongoose will convert to ObjectId
    this.cart = [{ itemId: _id, quantity: 1 }, ...this.cart];
  }

  try {
    await this.save(); // mongoose function
  } catch (error) {
    console.log('User updateCart Error', error);
  }
};

export default model<IUser, UserModel>('User', userSchema);
