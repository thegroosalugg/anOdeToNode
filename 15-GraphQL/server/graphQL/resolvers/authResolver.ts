import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../../models/User';

const mins = '15m';
const days = '7d';

const signUp = async (parent, args, context) => {
  try {
    const { userInput } = args;
    const { name, email, password } = userInput;

    // validation

    const hashed = await bcrypt.hash(password, 12);
    const user = new User({ name, email, password: hashed });
    await user.save();

    const userId = user._id;

    const JWTaccess = jwt.sign({ userId }, process.env.JWT_SECRET!, {
      expiresIn: mins,
    });

    const JWTrefresh = jwt.sign({ userId }, process.env.JWT_REFRESH!, {
      expiresIn: days,
    });

    const { password: _, ...userDets } = user.toObject(); // send non sensitive data
    return { JWTaccess, JWTrefresh, ...userDets };
  } catch (error) {
    throw error;
  }
};

const login = async () => {};

export const authResolver = {
     Query: { login },
  Mutation: { signUp }
};
