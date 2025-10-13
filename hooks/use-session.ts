// hooks/use-session.ts
"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { apiMe } from "@/lib/api"
import { useUserStore } from "@/stores/auth/auth-store"

type UseSessionOptions = {
	/** Revalidación periódica (ms). 0 = sin polling. Default: 60s */
	intervalMs?: number
	/** Si true, limpia Zustand al fallar /me. Default: true */
	resetOnError?: boolean
}

export function useSession({ intervalMs = 60_000, resetOnError = true }: UseSessionOptions = {}) {
	const setUserData = useUserStore((s) => s.setUserData)
	const resetUser = useUserStore((s) => s.resetUser)

	const [loading, setLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)

	// Referencias para cancelar peticiones y limpiar timers
	const inflight = useRef<AbortController | null>(null)
	const timer = useRef<ReturnType<typeof setInterval> | null>(null)

	const read = useCallback(async () => {
		// Cancela petición anterior si existe
		if (inflight.current) {
			try {
				inflight.current.abort()
			} catch {}
		}

		const ac = new AbortController()
		inflight.current = ac

		try {
			setError(null)
			// ⬇️ pasa el AbortSignal a apiMe
			const me = await apiMe({ signal: ac.signal })
			setUserData(
				me.user,
				me.user_id,
				me.user_email,
				me.maximum_invoices,
				me.total_invoices_user,
				me.accounts ?? []
			)
		} catch {
			// Ignorar si fue cancelada
			if (!ac.signal.aborted) {
				setError("No autorizado")
				if (resetOnError) resetUser()
			}
		} finally {
			if (!ac.signal.aborted) {
				setLoading(false)
				inflight.current = null
			}
		}
	}, [resetOnError, resetUser, setUserData])

	useEffect(() => {
		// 1) primera carga
		read()

		// 2) revalidación al volver a enfocar la pestaña
		const onFocus = () => read()

		window.addEventListener("focus", onFocus)

		// 3) polling opcional
		if (intervalMs > 0) {
			timer.current = setInterval(read, intervalMs)
		}

		return () => {
			window.removeEventListener("focus", onFocus)
			if (timer.current) clearInterval(timer.current)
			if (inflight.current) {
				try {
					inflight.current.abort()
				} catch {}
				inflight.current = null
			}
		}
	}, [intervalMs, read])

	return {
		loading,
		error,
		refresh: read,
	}
}
