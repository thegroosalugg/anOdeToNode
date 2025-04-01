import { Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import { postLogin, postSignup, refreshToken } from '../controllers/authController';
import { expectAppErr, getBack, mockReq, settle } from '../util/testHelpers';

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

jest.mock('jsonwebtoken', () => {
  const { getBack } = jest.requireActual('../util/testHelpers');
  return {
      sign: getBack('token'),
    verify: getBack({ userId: 'user123' }),
  };
});

const JWTaccess = 'token', JWTrefresh = JWTaccess;

const signUpTest =
  'should hash password, save user, sign 2 tokens, status(201), return JSON user & 2 tokens';

const loginTest =
  'should compare password, sign 2 tokens, status(200), return JSON user & 2 tokens';

const refreshNoToken = 'should call next(AppError) if no token is provided';
const  refreshNoUser = 'should call next(AppError) if no user found';
const refreshSuccess = 'should sign 2 tokens, status(200), return 2 tokens';
// 2/3 tests want valid token, final test calls [undefined]
const   refreshReq = (value: [any] = ['Bearer validToken']) => ({ get: () => value[0] });
// findById resolves a Mongoose doc alone, or it returns a Query Obj when chained
const mockFindById = (value: any) => (User.findById as jest.Mock).mockResolvedValue(value);

describe('Auth Controllers', () => {
  beforeEach(() => jest.clearAllMocks()); // resets all mocks & instances before each test

  const       name = 'John';
  const    surname = 'Pliskin';
  const      email = 'hudson@river.com';
  const   password = '2yearsAgo';
  const       user = new User({ name, surname, email });
  const clientData = getBack(user);

  const expectAuth = (res: Response, code: number, hasUser = true) => {
    expect(jwt.sign).toHaveBeenCalledTimes(2); // 1 access, 1 refresh
    expect(res.status).toHaveBeenCalledWith(code);
    const resData = hasUser ? { ...user } : {}; // 2/3 tests want this data, final test doesn't
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ JWTaccess, JWTrefresh, ...resData })
    );
  };

  it(signUpTest, async () => {
    const defineReq = { body: { name, surname, email, password } };
    const { req, res, next } = mockReq(defineReq);

    // class instance methods can be mocked directly, as new User instance was created
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

    // findOne resolves a Query Object
    // When findOne resolves, give me this object with these instance methods
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

  it(refreshNoToken, async () => {
    const { req, res, next } = mockReq(refreshReq([undefined]));
    await refreshToken(req, res, next);
    expectAppErr(next, 401, 'No refresh token provided');
  });

  it(refreshNoUser, async () => {
    const { req, res, next } = mockReq(refreshReq());
    mockFindById(null);
    await refreshToken(req, res, next);
    expectAppErr(next, 404, 'User not found');
  });

  it(refreshSuccess, async () => {
    const { req, res, next } = mockReq(refreshReq());
    mockFindById(user);
    await refreshToken(req, res, next);
    expectAuth(res, 200, false); // exclude res user data
  });
});
