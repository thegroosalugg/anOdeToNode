import jwt from 'jsonwebtoken';
import { authJWT } from '../middleware/auth.JWT';
import { expectAppErr, mockReq, settle } from '../util/testHelpers';
import User from '../models/User';

jest.mock('../models/User');
jest.mock('jsonwebtoken', () => ({
  // ...jest.requireActual('jsonwebtoken'), // is useless! Lib Fns must always be mocked!
  verify: jest.fn().mockReturnValue({ userId: 'user123' }), // overwrite verify globally
}));

// overwrites single instance of verify instead of globally
// (jwt.verify as jest.Mock).mockReturnValue({ userId: 'user123' });

// findById resolves a Mongoose doc alone, or it returns a Query Obj when chained
const mockFindById = (value: any) =>
  (User.findById as jest.Mock).mockReturnValue({ // Returns a "query" object
    select: settle(value),                      // with mocked .select method
  });                                          // that resolves to selected value

const defineReq = (value: [any] = ['Bearer validToken']) => ({ get: () => value[0] });

describe('authJWT Middleware', () => {
  it('should call next(AppError) if no token is provided', async () => {
    const { req, res, next } = mockReq(defineReq([undefined]));
    await authJWT(req, res, next);
    expectAppErr(next, 401, 'You are not logged in');
  });

  it('should call next(AppError) if no user is found', async () => {
    const { req, res, next } = mockReq(defineReq());
    mockFindById(null);
    await authJWT(req, res, next);
    expectAppErr(next, 404, 'User not found');
  });

  it('should return req.user when valid', async () => {
    const { req, res, next } = mockReq(defineReq());
    const user = new User({ name: 'a', surname: 'b', email: 'c', password: 'd' });
    mockFindById(user);
    await authJWT(req, res, next);
    expect(jwt.verify).toHaveBeenCalledWith('validToken', process.env.JWT_SECRET);
    expect(req.user).toEqual(user);
    expect(next).toHaveBeenCalled();
  });
});
