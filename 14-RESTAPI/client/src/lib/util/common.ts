export const getEntry = (data: FormData, name: string) => data.get(name)?.toString().trim();

export const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))
