export const getEntry = (data: FormData, name: string) => data.get(name)?.toString().trim();
