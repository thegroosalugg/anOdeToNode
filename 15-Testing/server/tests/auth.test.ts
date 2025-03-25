import { authJWT } from '../middleware/auth.JWT';
import { Request, Response } from 'express';
import { expectAppErr } from '../util/expectAppErr';

describe('authJWT Middleware', () => {
  it('should call next(AppError) if no token is provided', async () => {
    const  req = { get: () => undefined } as Partial<Request> as Request;
    const  res = {} as Response;
    const next = jest.fn();

    await authJWT(req, res, next);
    expectAppErr(next, 401, 'You are not logged in');
  });
});
