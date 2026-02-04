import { body, check, FieldValidationError, validationResult } from 'express-validator';
import { Request } from 'express';
import User from '../models/User';

const msg = (length: number) => `requires a minimum of ${length} characters.`;

export const getErrors = (req: Request) =>
  validationResult(req)
    .array() // exp-val 7 no longer has union type errors. Must type guard for FieldErrors
    .filter((err): err is FieldValidationError => err.type === 'field')
    .map((err) => ({ [err.path]: err.msg })) // remove unwanted props
    .reduce((acc, curr) => ({ ...acc, ...curr }), {}); // flatten to a single object

export const hasErrors = (obj: Object) => Object.keys(obj).length > 0;

export const validateName = body('name')
  .trim()
  .isLength({ min: 3 })
  .withMessage(msg(3))
  .customSanitizer((value) => value.replace(/<|>/g, '')); // escapes only dangerous values

export const validateEmail = check('email')
  .isEmail()
  .withMessage('is invalid')
  .toLowerCase()
  .custom(async (email, { req }) => {
    const duplicate = await User.findOne({ email });
    if (duplicate) {
      throw new Error('already registered');
    }
    return true;
  });

export const validatePassword = body('password')
  .isLength({ min: 6 })
  .withMessage(msg(6))
  .custom((value, { req }) => {
    if (value !== req.body.confirm_password) {
      throw new Error("doesn't match");
    }
    return true;
  });

export const validateDesc = body('desc')
  .trim()
  .isLength({ min: 10 })
  .withMessage(msg(10))
  .customSanitizer((value) => value.replace(/<|>/g, ''));

export const validatePrice = body('price')
  .isFloat({ min: 0 })
  .withMessage('must be a number.');

export const validateSignUp = [validateName, validateEmail, validatePassword];
export const   validateItem = [validateName, validateDesc,  validatePrice   ];
