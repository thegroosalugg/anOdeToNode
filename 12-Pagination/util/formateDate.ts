function formatDate(ISOstring: string, withYear?: boolean): string {
  const date = new Date(ISOstring)
  const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'short' };

  if (withYear) {
    options.year = 'numeric';
  }

  return date.toLocaleDateString('en-GB', options);
}

export default formatDate;
