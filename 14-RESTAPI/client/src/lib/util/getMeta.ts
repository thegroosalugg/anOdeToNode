export const getMeta = <T>(
  isLoading: boolean,
       data: T | null | undefined,
  getValues: (data: T) => { title: string; description: string },
  label: string
) => {
  if (isLoading) return { title: "loading...", description: "loading" };
  if   (data)    return getValues(data);
  return { title: `${label} not found`, description: "Not found" };
};
