import { useState } from "react"
import { useDebounce } from "ahooks"

export default function useDebounceCallback(defaultValue: any, debounceTime = 500) {
  const [state, setState] = useState(defaultValue)
  const debouncedState = useDebounce(state, { wait: debounceTime })

  return [state, debouncedState, setState]
}
