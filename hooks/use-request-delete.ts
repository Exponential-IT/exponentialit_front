"use client"

import { ApiDeleteByRequestId } from "@/lib/api"
import { useEffect, useRef, useState } from "react"
import type { ApiError } from "@/types/error"
import { useEventStore } from "@/stores/events/event-store"

export function useRequestDelete(request_id: string | null) {
	const [data, setData] = useState<unknown | null>(null)
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState<string | null>(null)
	const inflight = useRef<AbortController | null>(null)

	const removeEventByRequestId = useEventStore((s) => s.removeEventByRequestId)

	useEffect(() => {
		if (!request_id) return
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
				setData(null)

				const res = await ApiDeleteByRequestId(request_id, { signal: ac.signal })
				if (ac.signal.aborted) return

				removeEventByRequestId(request_id)

				setData(res)
			} catch (err) {
				if (ac.signal.aborted) return
				const apiErr = err as Partial<ApiError> | undefined
				const msg = String(apiErr?.detail ?? "Error al eliminar evento")
				setError(msg)
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
	}, [request_id, removeEventByRequestId])

	return { delete_data: data, delete_loading: loading, delete_error: error }
}
