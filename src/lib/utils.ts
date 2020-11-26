export function timeSync<T>(cb: () => T): [number, T] {
  const before = Date.now();
  const res = cb();
  return [Date.now() - before, res];
}

export async function time<T>(cb: () => Promise<T>): Promise<[number, T]> {
  const before = Date.now();
  const res = await cb();
  return [Date.now() - before, res];
}

export function randomChoice<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}
