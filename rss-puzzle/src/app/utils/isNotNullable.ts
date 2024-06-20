export default function isNotNullable<T>(value: T): value is NonNullable<T> {
  if (value === undefined || value === null)
    throw new Error(`${value} is not defined`);

  return value !== null;
}
