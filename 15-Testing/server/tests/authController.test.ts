import { Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import { postLogin, postSignup } from '../controllers/authController';
import { getBack, mockReq, settle } from '../util/testHelpers';

jest.mock('../models/User');

jest.mock('../socket', () => ({
  getIO: jest.fn(() => ({
    emit: jest.fn(),
  })),
}));

jest.mock('bcryptjs', () => {
  const { settle } = jest.requireActual('../util/testHelpers');
  return {
       hash: settle('hashed'),
    compare: settle(true),
  };
});

jest.mock('jsonwebtoken', () => ({
  sign: jest.fn().mockReturnValue('token'),
}));

const JWTaccess = 'token', JWTrefresh = JWTaccess;

const signUpTest =
  'should hash password, save user, sign 2 tokens, status(201), return JSON user';

const loginTest =
  'should compare password, sign 2 tokens, status(200), return JSON user';

describe('Auth Controllers', () => {
  beforeEach(() => jest.clearAllMocks()); // resets all mocks & instances before each test

  const       name = 'John';
  const    surname = 'Pliskin';
  const      email = 'hudson@river.com';
  const   password = '2yearsAgo';
  const       user = new User({ name, surname, email });
  const clientData = getBack(user);

  const expectAuth = (res: Response, code: number) => {
    expect(jwt.sign).toHaveBeenCalledTimes(2); // 1 access, 1 refresh
    expect(res.status).toHaveBeenCalledWith(code);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ JWTaccess, JWTrefresh, ...user })
    );
  };

  it(signUpTest, async () => {
    const defineReq = { body: { name, surname, email, password } };
    const { req, res, next } = mockReq(defineReq);

    User.prototype.save     = settle(user); // settle/getBack reduce long jest boilerplate
    User.prototype.toObject = clientData;
    await postSignup(req, res, next);

    expect(bcrypt.hash).toHaveBeenCalledWith(password, 12);
    expect(User.prototype.save).toHaveBeenCalled();
    expectAuth(res, 201);
  });

  it(loginTest, async () => {
    const defineReq = { body: { email, password } };
    const { req, res, next } = mockReq(defineReq);
    const hashed = 'hashed';

    (User.findOne as jest.Mock).mockResolvedValue({
       ...user,
      password: hashed,
      populate: clientData,
      toObject: clientData,
    });

    await postLogin(req, res, next);

    expect(bcrypt.compare).toHaveBeenCalledWith(password, hashed);
    expectAuth(res, 200);
  });
});
