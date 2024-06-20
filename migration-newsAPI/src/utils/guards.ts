export function isNonNullable<T>(value: unknown): asserts value is NonNullable<T> {
    if (value === undefined || value === null) throw new Error(`${value} is not defined`);
}

// Вместо querySelector

// type ConstructorOf<T> = {
//   new (type: unknown): T;
// }

// export function assertIsNonNullable<T>(value: unknown): asserts value is NonNullable<T> {
//   if (value === undefined || value === null) throw new Error();
// }

// export function assertIsElement<T>(value: unknown, elemType: ConstructorOf<T>): asserts value is T {
//   assertIsNonNullable(value);
//   if (!(value instanceof elemType)) throw new Error();
// }

// export const queryElement = <ElementType extends Node>(
//   elemType: ConstructorOf<ElementType>,
//   parentNode: Element,
//   selector: string
// ): ElementType => {
//   const result = parentNode.querySelector(selector);
//   assertIsElement(result, elemType);
//   return result;
// }
