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
    .withMessage(`requires at least ${min} character${min > 1 ? 's' : ''}`)
    .isLength({ max })
    .withMessage(`should not exceed ${max} characters`);

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
  .matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d\S]+$/)
  .withMessage('must contain 1 letter, 1 number & no invalid chars')
  .isLength({ min: 6 })
  .withMessage('requires at least 6 characters')
  .custom((password, { req }) => {
    if (password !== req.body.confirm_password) {
      throw new Error("doesn't match");
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
  validateField('content', [30, 1000])
];

// .body with no arg gets the entire req.body object
export const validateUserInfo = body().custom((body, { req }) => {
  const fields = ['home', 'work', 'study', 'bio'];
  const  [key] = Object.keys(body);

  if (!fields.includes(key)) throw new Error('Invalid profile field');

  // due to 0 arg .body(), chaining methods doesn't work & logic is handled inside custom
  const     value = body[key];
  const sanitized = value.trim().replace(/\s+/g, ' ').replace(/<|>/g, '');
  const     isBio = key === 'bio';

  if ((!isBio && sanitized.length > 50) || (isBio && sanitized.length > 100)) {
    throw new Error(`should not exceed ${isBio ? 100 : 50} characters`);
  }

  req.body[key] = sanitized || ''; // Converts whitespace-only to empty string

  return true;
});
