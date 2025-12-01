"use client"

import { ApiErrorByRequestId } from "@/lib/api"
import type { RequestErrorsResponse, ApiError } from "@/types/error"
import { useEffect, useRef, useState } from "react"

export function useRequestErrors(request_id: string | null, enable: boolean) {
	const [data, setData] = useState<RequestErrorsResponse | null>(null)
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState<string | null>(null)
	const inflight = useRef<AbortController | null>(null)

	useEffect(() => {
		if (!enable || !request_id) return

		if (inflight.current) {
			try {
				inflight.current.abort()
			} catch {}
		}

		const ac = new AbortController()
		inflight.current = ac
		;(async () => {
			try {
				setLoading(true)
				setError(null)
				const res = await ApiErrorByRequestId(request_id, { signal: ac.signal })
				setData(res)
			} catch (err: unknown) {
				if (!ac.signal.aborted) {
					const apiErr = err as Partial<ApiError> | undefined
					const msg = String(apiErr?.detail ?? "Error cargando errores")
					setError(msg)
				}
			} finally {
				if (!ac.signal.aborted) {
					setLoading(false)
					inflight.current = null
				}
			}
		})()

		return () => {
			try {
				inflight.current?.abort()
			} catch {}
			inflight.current = null
		}
	}, [request_id, enable])

	return { data, loading, error }
}
