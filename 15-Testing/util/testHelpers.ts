import AppError from '../models/Error';
import { Request, Response } from 'express';

export const  settle = (value: any) => jest.fn().mockResolvedValue(value);
export const getBack = (value: any) => jest.fn().mockReturnValue(value);

export const expectAppErr = (next: jest.Mock, code: number, message: string) => {
  expect(next).toHaveBeenCalledWith(expect.any(AppError)); // Checks instance
  const error = next.mock.calls[0][0]; // Extract the first argument passed to `next`
  expect(error.client.message).toBe(message); // check first as more unique
  expect(error.status).toBe(code);
};

export const mockReq = (obj: Record<string, any>) => {
  const status = jest.fn().mockReturnThis();

  const  req = {       ...obj         } as Partial<Request>  as Request;
  const  res = { status, json: status } as Partial<Response> as Response;
  const next = jest.fn();

  return { req, res, next };
};
