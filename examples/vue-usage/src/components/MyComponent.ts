import { useCounter } from '../composables/useCounter';

export function setupComponent() {
  const { count, increment } = useCounter();
  return { count, increment };
}
