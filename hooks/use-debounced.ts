import { useCallback, useEffect, useRef } from "react"

export function useDebouncedCallback<Args extends unknown[]>(
	cb: (...args: Args) => void,
	delay = 500
): (...args: Args) => void {
	const timeoutRef = useRef<number | null>(null)
	const saved = useRef(cb)

	useEffect(() => {
		saved.current = cb
	}, [cb])

	return useCallback(
		(...args: Args) => {
			if (timeoutRef.current) window.clearTimeout(timeoutRef.current)
			timeoutRef.current = window.setTimeout(() => saved.current(...args), delay)
		},
		[delay]
	)
}
