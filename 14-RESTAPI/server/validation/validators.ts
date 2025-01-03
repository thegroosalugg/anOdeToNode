import { body, check, FieldValidationError, validationResult } from 'express-validator';
import { Request } from 'express';

export const getErrors = (req: Request) =>
  validationResult(req)
    .array() // exp-val 7 no longer has union type errors. Must type guard for FieldErrors
    .filter((err): err is FieldValidationError => err.type === 'field')
    .map((err) => ({ [err.path]: err.msg })) // remove unwanted props
    .reduce((acc, curr) => ({ ...acc, ...curr }), {}); // flatten to a single object

export const hasErrors = (obj: Object) => Object.keys(obj).length > 0;

export const validateField = (field: string, min: number) =>
  body(field)
    .trim()
    .isLength({ min })
    .withMessage(`requires at least ${min} characters`)
    .customSanitizer((value) => value.replace(/<|>/g, '')); // escapes only dangerous values

export const validateEmail = check('email')
  .isEmail()
  .withMessage('is invalid')
  .toLowerCase();

export const validatePassword = body('password')
  .isLength({ min: 6 })
  .withMessage('requires 6+ chars')
  .custom((value, { req }) => {
    if (value !== req.body.confirm_password) {
      throw new Error("doesn't match");
    }
    return true;
  });

  export const validateSignUp = [
    validateField('name', 3),
    validateField('surname', 3),
    validateEmail,
    validatePassword,
  ];

  export const validatePost = [validateField('title', 5), validateField('content', 30)];
