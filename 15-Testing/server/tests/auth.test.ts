// import jwt from 'jsonwebtoken';
import { authJWT } from '../middleware/auth.JWT';
import { expectAppErr, mockReq } from '../util/testHelpers';
import User from '../models/User';

jest.mock('../models/User');
jest.mock('jsonwebtoken', () => ({
  ...jest.requireActual('jsonwebtoken'), // import and retain the original functionalities
  verify: jest.fn().mockReturnValue({ userId: 'user123' }), // overwrite verify globally
}));

// overwrites single instance of verify instead of globally
// (jwt.verify as jest.Mock).mockReturnValue({ userId: 'user123' });

const mongoQuery = (value: any) =>
  (User.findById as jest.Mock).mockReturnValue({ // Returns a "query" object
    select: jest.fn().mockResolvedValue(value), // with mocked .select method
  });                                          // that resolves to selected value

describe('authJWT Middleware', () => {
  it('should call next(AppError) if no token is provided', async () => {
    const { req, res, next } = mockReq({ get: () => undefined });
    await authJWT(req, res, next);
    expectAppErr(next, 401, 'You are not logged in');
  });

  it('should call next(AppError) if no user is found', async () => {
    const { req, res, next } = mockReq({ get: () => 'Bearer validToken' });
    // overwrites single instance of verify instead of globally
    // (jwt.verify as jest.Mock).mockReturnValue({ userId: 'user123' });
    mongoQuery(null);
    await authJWT(req, res, next);
    expectAppErr(next, 404, 'User not found');
  });

  it('should return req.user when valid', async () => {
    const { req, res, next } = mockReq({ get: () => 'Bearer validToken' });
    const user = new User({ name: 'a', surname: 'b', email: 'c', password: 'd' });
    mongoQuery(user);
    await authJWT(req, res, next);
    expect(req.user).toEqual(user);
    expect(next).toHaveBeenCalled();
  });
});
