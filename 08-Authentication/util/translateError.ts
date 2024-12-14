import { MongoServerError } from 'mongodb';

const translateError = (err:  MongoServerError) => {
  const errors: Record<string, string> = {};

  for (const key in err.errors) {
    // errors.name/email/password.kind = 'required' | 'Number'.
    const { kind }  = err.errors[key]; // 'name required' (etc) | 'price must be numberic'
    errors[key] = kind === 'Number' ? 'must be numeric' : kind;
  }

  if (err.kind === 'Number') {
    errors.price = 'must be numeric';
  }

  if (err.keyValue) {
    const entry = Object.keys(err.keyValue)[0]; // gets duplicate field name
    errors[entry] = 'exists'; // '[field name]: exists'
  }

  return errors;
};

export default translateError;
