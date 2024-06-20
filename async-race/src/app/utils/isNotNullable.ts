export default function isNotNullable<T>(value: T): value is NonNullable<T> {
  if (value === undefined || value === null) console.log(`${value} is not defined`); // Message for developer, not user
  return value !== null;
}
