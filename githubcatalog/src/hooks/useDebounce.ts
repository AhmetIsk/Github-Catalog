import { useCallback, useRef } from "react";

/**
 * A hook that debounces a callback function.
 * @param callback - The function to debounce.
 * @param delay - The delay in milliseconds.
 * @returns The debounced callback function.
 */
const useDebounce = (callback: Function, delay: number) => {
  const timer = useRef<NodeJS.Timeout | null>(null);

  const debouncedCallback = useCallback((...args: any[]) => {
    if (timer.current) {
      clearTimeout(timer.current);
    }
    timer.current = setTimeout(() => {
      callback(...args);
    }, delay);
  }, [callback, delay]);

  return debouncedCallback;
};

export default useDebounce;