import { body, check, FieldValidationError, validationResult } from 'express-validator';
import { Request } from 'express';

export const getErrors = (req: Request) =>
  validationResult(req)
    .array() // exp-val 7 no longer has union type errors. Must type guard for FieldErrors
    .filter((err): err is FieldValidationError => err.type === 'field')
    .map((err) => ({ [err.path]: err.msg })) // remove unwanted props
    .reduce((acc, curr) => ({ ...acc, ...curr }), {}); // flatten to a signel object

export const hasErrors = (obj: Object) => Object.keys(obj).length > 0;

export const validateName = body('name')
  .not()
  .isEmpty()
  .trim()
  .isLength({ min: 3 })
  .withMessage('needs 3+ chars')
  .escape();

export const validateEmail = check('email').isEmail().withMessage('is invalid').normalizeEmail();

export const validatePassword = body('password')
  .isLength({ min: 6 })
  .withMessage('needs 6+ chars')
  .custom((value, { req }) => {
    if (value !== req.body.confirm_password) {
      throw new Error("doesn't match");
    }
    return true;
  });

export const validateSignUp = [validateName, validateEmail, validatePassword];
