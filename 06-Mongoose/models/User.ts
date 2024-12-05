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
    unique: true,
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

userSchema.methods.updateCart = function(_id: string, quantity: 1 | -1) {
  const index = this.cart.findIndex(
    ({ itemId }: { itemId: typeof ObjectId }) => itemId.toString() === _id
  );

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
    this.save(); // mongoose function
  } catch (error) {
    console.log('User updateCart Error', error);
  }
}

export default model('User', userSchema);
