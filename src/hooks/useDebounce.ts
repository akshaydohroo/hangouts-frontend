import { useEffect, useState } from 'react'

// Debounce Hook
export function useDebounce(value: string | number, delay: number) {
  const [debouncedValue, setDebouncedValue] = useState(value)

  useEffect(() => {
    if (debouncedValue === value) {
      return
    }
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(handler)
    }
  }, [value, delay, debouncedValue])

  return debouncedValue
}
