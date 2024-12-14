import { MongoServerError } from 'mongodb';

const translateError = (err:  MongoServerError) => {
  const errors: Record<string, string> = {};

  for (const key in err.errors) {
    // errors.name/email/password.kind = 'required'. Output: 'name required'
    errors[key] = err.errors[key].kind;
  }

  if (err.keyValue) {
    const entry = Object.keys(err.keyValue)[0]; // gets duplicate field name
    errors[entry] = 'exists'; // '[field name]: exists'
  }

  return errors;
};

export default translateError;
