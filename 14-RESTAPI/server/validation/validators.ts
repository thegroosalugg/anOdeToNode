import { body, check, FieldValidationError, validationResult } from 'express-validator';
import { Request } from 'express';
import User from '../models/User';

// when calling .body() without argument err.path will be empty "":
// therefore fallback || 'message' will be set as the name of the err key
export const getErrors = (req: Request) =>
  validationResult(req)
    .array() // exp-val 7 no longer has union type errors. Must type guard for FieldErrors
    .filter((err): err is FieldValidationError => err.type === 'field')
    .map((err) => ({ [err.path || 'message']: err.msg })) // remove unwanted props
    .reduce((acc, curr) => ({ ...acc, ...curr }), {}); // flatten to a single object

export const hasErrors = (obj: Object) => Object.keys(obj).length > 0;

export const validateField = (field: string, [min, max]: [number, number]) =>
  body(field) // pass a string to find a key inside req.body
    .trim()
    .customSanitizer(
      (value) =>
        value
          .replace(/<|>/g, '') // escapes only dangerous values
          .replace(/\s+/g, ' ') // collapse multiple whitespaces
    )
    .isLength({ min })
    .withMessage(`${field} requires at least ${min} character${min > 1 ? 's' : ''}`)
    .isLength({ max })
    .withMessage(`${field} should not exceed ${max} characters`);

export const validateEmail = check('email')
  .isEmail()
  .withMessage('Email is invalid')
  .toLowerCase()
  .custom(async (email, { req }) => {
    const duplicate = await User.findOne({ email });
    if (duplicate) {
      throw new Error('Email already registered');
    }
    return true;
  });

export const validatePassword = body('password')
  .matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d\S]+$/)
  .withMessage('Password must contain 1 letter, 1 number')
  .isLength({ min: 6 })
  .withMessage('Password requires at least 6 characters')
  .custom((password, { req }) => {
    if (password !== req.body.confirm_password) {
      throw new Error("Passwords do not match");
    }
    return true;
  });

export const validateSignUp = [
  validateField('name',    [2, 15]),
  validateField('surname', [2, 15]),
  validateEmail,
  validatePassword,
];

export const validatePost = [
  validateField('title',   [ 5,   50]),
  validateField('content', [20, 1000])
];

export const validateUserInfo = [
  validateField('home',  [0,  50]),
  validateField('work',  [0,  50]),
  validateField('study', [0,  50]),
  validateField('bio',   [0, 100])
];
