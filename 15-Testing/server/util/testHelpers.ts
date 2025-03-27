import AppError from '../models/Error';
import { Request, Response } from 'express';

// One approach is to check the return value is an object with these key/values
// expect(next).toHaveBeenCalledWith(
//   expect.objectContaining({
//     status: 401,
//     client: expect.objectContaining({ message: 'You are not logged in' }),
//   })
// );

export const expectAppErr = (next: jest.Mock, code: number, message: string) => {
  expect(next).toHaveBeenCalledWith(expect.any(AppError)); // Checks instance
  const error = next.mock.calls[0][0]; // Extract the first argument passed to `next`
  expect(error.client.message).toBe(message); // check first as more unique
  expect(error.status).toBe(code);
};

export const mockReq = (obj: Record<string, any>) => {
  const resMock = jest.fn().mockReturnThis();

  const  req = {              ...obj            } as Partial<Request>  as Request;
  const  res = { status: resMock, json: resMock } as Partial<Response> as Response;
  const next = jest.fn();

  return { req, res, next };
};
