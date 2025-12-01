"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { apiMe } from "@/lib/api"
import { useUserStore } from "@/stores/auth/auth-store"
import type { ApiError } from "@/types/error"

type UseSessionOptions = { intervalMs?: number; resetOnError?: boolean }

export function useSession({ intervalMs = 60_000, resetOnError = true }: UseSessionOptions = {}) {
	const setUserData = useUserStore((s) => s.setUserData)
	const resetUser = useUserStore((s) => s.resetUser)
	const alreadyHydrated = useUserStore((s) => s.user_id !== null)

	const [loading, setLoading] = useState(!alreadyHydrated)
	const [error, setError] = useState<string | null>(null)

	const inflight = useRef<AbortController | null>(null)
	const timer = useRef<ReturnType<typeof setInterval> | null>(null)
	const mountedRef = useRef(true)
	const lastRunRef = useRef(0)

	const resetUserRef = useRef(resetUser)
	const setUserDataRef = useRef(setUserData)

	useEffect(() => {
		resetUserRef.current = resetUser
	}, [resetUser])

	useEffect(() => {
		setUserDataRef.current = setUserData
	}, [setUserData])

	const read = useCallback(async () => {
		const now = Date.now()
		if (now - lastRunRef.current < 500) return
		if (inflight.current) return

		lastRunRef.current = now

		const ac = new AbortController()
		inflight.current = ac
		try {
			setError(null)
			const me = await apiMe({ signal: ac.signal })
			if (!mountedRef.current) return

			setUserDataRef.current(
				me.user,
				me.user_id,
				me.user_email,
				me.maximum_invoices,
				me.total_invoices_user,
				me.total_invoices_month,
				me.total_invoices_success_month,
				me.total_invoices_failed_month,
				me.total_invoices,
				me.total_invoices_success,
				me.total_invoices_failed,
				me.accounts ?? []
			)
		} catch (err: unknown) {
			if (!ac.signal.aborted && mountedRef.current) {
				const apiErr = err as Partial<ApiError> | undefined
				const msg = String(apiErr?.detail ?? "No autorizado")
				setError(msg)
				if (resetOnError) resetUserRef.current()
			}
		} finally {
			if (mountedRef.current && !ac.signal.aborted) setLoading(false)
			inflight.current = null
		}
	}, [resetOnError])

	useEffect(() => {
		mountedRef.current = true

		const boot = async () => {
			if (!alreadyHydrated) {
				await read()
			} else {
				setLoading(false)
			}

			if (intervalMs > 0 && !timer.current) {
				timer.current = setInterval(() => {
					read()
				}, intervalMs)
			}
		}

		boot()

		const onFocus = () => read()
		const onVisibility = () => {
			if (document.visibilityState === "visible") read()
		}
		window.addEventListener("focus", onFocus)
		document.addEventListener("visibilitychange", onVisibility)

		return () => {
			mountedRef.current = false
			window.removeEventListener("focus", onFocus)
			document.removeEventListener("visibilitychange", onVisibility)
			if (timer.current) {
				clearInterval(timer.current)
				timer.current = null
			}
			if (inflight.current) {
				try {
					inflight.current.abort()
				} catch {}
				inflight.current = null
			}
		}
	}, [alreadyHydrated, intervalMs, read])

	return { loading, error, refresh: read }
}
