export default function compareArrays<T extends { _id: string }>(
  oldData: T[],
  newData: T[]
): T[] {
  const oldIds = new Set(oldData.map((obj) => obj._id));
  return newData.filter((obj) => !oldIds.has(obj._id));
}
