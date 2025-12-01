// hooks/use-change-password.ts
"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { ApiResetPassword } from "@/lib/api"
import type { ApiError } from "@/types/error"

export type ChangePasswordPayload = {
	email: string
	old_password: string
	new_password: string
}

export type ChangePasswordResponse = {
	detail: string
}

export function useChangePassword() {
	const [data, setData] = useState<ChangePasswordResponse | null>(null)
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState<string | null>(null)

	const inflight = useRef<AbortController | null>(null)

	useEffect(() => {
		return () => {
			if (inflight.current) {
				try {
					inflight.current.abort()
				} catch {
					/* noop */
				}
				inflight.current = null
			}
		}
	}, [])

	const changePassword = useCallback(
		async (payload: ChangePasswordPayload): Promise<ChangePasswordResponse | null> => {
			if (inflight.current) {
				try {
					inflight.current.abort()
				} catch {
					/* noop */
				}
			}

			const ac = new AbortController()
			inflight.current = ac

			try {
				setLoading(true)
				setError(null)
				setData(null)

				const res = (await ApiResetPassword(payload, {
					signal: ac.signal,
				})) as ChangePasswordResponse

				if (ac.signal.aborted) return null

				setData(res)
				return res
			} catch (err: unknown) {
				if (!ac.signal.aborted) {
					const apiErr = err as Partial<ApiError> | undefined
					const msg = String(apiErr?.detail ?? "Error al cambiar la contraseña")
					setError(msg)
				}
				return null
			} finally {
				if (!ac.signal.aborted) {
					setLoading(false)
					inflight.current = null
				}
			}
		},
		[]
	)

	return { changePassword, data, loading, error }
}
