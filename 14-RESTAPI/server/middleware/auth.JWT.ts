import { RequestHandler } from "express";
import jwt from "jsonwebtoken";


export const authJWT: RequestHandler = (req, res, next) => {
  const token = req.get('authorization')?.split(' ')[1]; // split string @ 'Bearer ' whitespace
  
  console.log('TOKEN', token);
}
