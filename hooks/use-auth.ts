"use client"
import { useRouter, useSearchParams } from "next/navigation"
import { useState, useCallback } from "react"
import { loginRequest, fetchMe, logoutRequest } from "@/lib/services/auth"
import { useUserStore } from "@/stores/auth/auth-store"

export function useAuth() {
	const router = useRouter()
	const search = useSearchParams()

	const setUserData = useUserStore((s) => s.setUserData)
	const resetUser = useUserStore((s) => s.resetUser)

	const [loading, setLoading] = useState(false)
	const [error, setError] = useState<string | null>(null)

	const login = useCallback(
		async (email: string, password: string) => {
			setLoading(true)
			setError(null)
			try {
				const res = await loginRequest({ email, password })
				if (res.status < 200 || res.status >= 300) {
					setError("Credenciales inválidas")
					return false
				}
				const me = await fetchMe()
				if (me?.user_id == null) {
					setError("No se pudo obtener la sesión")
					return false
				}
				setUserData(
					me.user,
					me.user_id,
					me.user_email,
					me.maximum_invoices,
					me.total_invoices_user,
					me.accounts ?? []
				)
				const redirectTo = search.get("redirect") || "/"
				router.replace(redirectTo)
				return true
			} catch {
				setError("Error al iniciar sesión")
				return false
			} finally {
				setLoading(false)
			}
		},
		[router, search, setUserData]
	)

	const logout = useCallback(async () => {
		try {
			await logoutRequest()
		} catch {}
		resetUser()
		router.replace("/login")
	}, [resetUser, router])

	return { login, logout, loading, error, setError }
}
