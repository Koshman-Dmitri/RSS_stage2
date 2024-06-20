export const shuffleWords = (array: HTMLElement[]): HTMLElement[] => {
  const resArr = array.slice();
  for (let i = resArr.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [resArr[i], resArr[j]] = [resArr[j], resArr[i]];
  }
  return resArr;
};
