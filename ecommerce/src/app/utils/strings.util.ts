export function capitalizeFirstLetter(text: string): string {
  return text[0].toUpperCase() + text.slice(1);
}

export function getQueryFilterString(strings: string[]): string {
  return strings.map((string) => `"${string}"`).join(', ');
}
