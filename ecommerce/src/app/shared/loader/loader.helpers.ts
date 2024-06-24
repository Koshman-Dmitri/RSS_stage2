export function onErrorEventHandler(event: KeyboardEvent): void {
  if (event.key === 'Tab') event.preventDefault();
}
