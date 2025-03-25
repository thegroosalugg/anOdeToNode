import { authJWT } from '../middleware/auth.JWT';
import { Request, Response } from 'express';
import AppError from '../models/Error';

describe('authJWT Middleware', () => {
  it('should call next(AppError) if no token is provided', async () => {
    const  req = { get: () => undefined } as Partial<Request> as Request;
    const  res = {} as Response;
    const next = jest.fn();

    await authJWT(req, res, next);

    // One approach is to check the return value is an object with these key/values
    // expect(next).toHaveBeenCalledWith(
    //   expect.objectContaining({
    //     status: 401,
    //     client: expect.objectContaining({ message: 'You are not logged in' }),
    //   })
    // );

    expect(next).toHaveBeenCalledWith(expect.any(AppError)); // Checks instance
    const error = next.mock.calls[0][0]; // Extract the first argument passed to `next`
    expect(error.status).toBe(401);
    expect(error.client.message).toBe('You are not logged in');
  });
});
