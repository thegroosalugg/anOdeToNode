import { authJWT } from '../middleware/auth.JWT';
import { expectAppErr, mockReq } from '../util/testHelpers';

describe('authJWT Middleware', () => {
  it('should call next(AppError) if no token is provided', async () => {
    const { req, res, next } = mockReq({ get: () => undefined });
    await authJWT(req, res, next);
    expectAppErr(next, 401, 'You are not logged in');
  });
});
