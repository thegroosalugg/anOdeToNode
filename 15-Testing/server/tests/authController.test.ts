import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import AppError from '../models/Error';
import { postSignup } from '../controllers/authController';
import { mockReq } from '../util/testHelpers';

jest.mock('../models/User');
jest.mock('socket.io');

jest.mock('bcryptjs', () => ({
  ...jest.requireActual('bcryptjs'),
  hash: jest.fn().mockResolvedValue('hashed'),
}));

jest.mock('jsonwebtoken', () => ({
  ...jest.requireActual('jsonwebtoken'),
  sign: jest.fn().mockReturnValue(() => JWTaccess), // accesses const at runtime
}));

const JWTaccess = 'token', JWTrefresh = JWTaccess;

const signUpTest =
  'should hash password, save user, sign 2 tokens, return 201, return JSON with 5 props';

describe('Auth Controllers', () => {
  it(signUpTest, async () => {
    const      name = 'John';
    const   surname = 'Pliskin';
    const     email = 'a@b.com';
    const  password = '123qwe';
    const defineReq = { body: { name, surname, email, password } };
    const { req, res, next } = mockReq(defineReq);

    // (bcrypt.hash as jest.Mock).mockResolvedValue('hashedPassword');

    const user = new User({ name, surname, email, password });
    User.prototype.save = user.save;

    // (jwt.sign as jest.Mock).mockReturnValue('jwtToken');

    await postSignup(req, res, next);

    expect(bcrypt.hash).toHaveBeenCalledWith(password, 12);
    expect(User.prototype.save).toHaveBeenCalled();
    expect(jwt.sign).toHaveBeenCalledTimes(2); // 1 access, 1 refresh token
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ JWTaccess, JWTrefresh, name, surname, email })
    );
  });

  // it('', () => {});
});
