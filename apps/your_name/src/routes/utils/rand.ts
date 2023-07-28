export function choose<T>(arr: T[]): T {
  const index = between(0, arr.length);
  return arr[index];
}

export const between = (min: number, max: number) =>
  // max is not included
  min + Math.floor(Math.random() * (max - min));
