import { body, check } from 'express-validator';

export const validateSignUp = [
  body('name')
  .not().isEmpty()
  .trim()
  .isLength({ min: 3 }).withMessage('needs 3+ chars')
  .escape(),

  check('email').isEmail().withMessage('is invalid').normalizeEmail(),

  body('password')
    .isLength({ min: 6 })
    .withMessage('needs 6+ chars')
    .custom((value, { req }) => {
      if (value !== req.body.confirm_password) {
        throw new Error("doesn't match");
      }
      return true;
    }),
];
