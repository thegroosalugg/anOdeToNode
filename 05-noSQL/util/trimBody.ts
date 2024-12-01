const trimBody = (body: Object) =>
  Object.fromEntries(
    Object.entries(body).map(( [key, value] ) => [
      key,
      (value as string).replace(/\s+/g, ' ').trim(),
    ])
  );

export default trimBody;
