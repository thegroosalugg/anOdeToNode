function formatDate(ISOstring: string, withYear?: boolean, withTime: boolean = false): string {
  const date = new Date(ISOstring);

  const options: Intl.DateTimeFormatOptions = {
        day: 'numeric',
      month: 'short',
    weekday: 'short',
  };

  if (withYear) {
    options.year = 'numeric';
  }

  let formattedDate = date.toLocaleDateString('en-GB', options);

  if (withTime) {
    const time = date.toLocaleTimeString('en-GB', {
        hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
    formattedDate = `${time}, ${formattedDate}`;
  }

  return formattedDate;
}

function timeAgo(ISOstring: string): string {
  const date = new Date(ISOstring);
  const  now = Date.now();
  const diffInSeconds = Math.floor((now - date.getTime()) / 1000);

  const intervals = [
    { label: 'second', value: 60 },
    { label: 'minute', value: 60 },
    { label: 'hour',   value: 24 },
    { label: 'day',    value: 30 },
    { label: 'month',  value: 12 },
    { label: 'year',   value: Infinity },
  ];

  let interval = diffInSeconds;
  let i = 0;
  while (interval >= intervals[i].value && i < intervals.length - 1) {
    interval /= intervals[i].value;
    i++;
  }

  const rounded = Math.floor(interval);
  const suffix  = rounded > 1 ? `${intervals[i].label}s` : intervals[i].label;

  return `${rounded} ${suffix} ago`;
}

export { formatDate, timeAgo};
