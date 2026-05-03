export function useCounter() {
  let count = 0;
  const increment = () => {
    count++;
  };
  return { count, increment };
}
