import { Error } from 'mongoose';

type MongooseErrors =
  | Error.ValidationError
  | Error.CastError
  | { keyValue: { [key: string]: string } };

const mongooseErrors = (err: MongooseErrors) => {
  const errors: Record<string, string> = {};

  if ('errors' in err) {
    for (const key in err.errors) {
    // errors.name/email/password.kind = 'required' | 'Number'.
      const { kind } = err.errors[key]; // 'name required' (etc) | 'price must be numberic'
      errors[key] = kind === 'Number' ? 'must be numeric' : kind;
    }
  }

  if ('kind' in err && err.kind === 'Number') {
    errors.price = 'must be numeric';
  }

  if ('keyValue' in err) {
    const entry = Object.keys(err.keyValue)[0]; // gets duplicate field name
    errors[entry] = 'exists'; // '[field name]: exists'
  }

  return errors;
};

export { MongooseErrors, mongooseErrors };
