"use client"
import { useRouter, useSearchParams } from "next/navigation"
import { useState, useCallback } from "react"
import { apiLogin, apiMe, apiLogout } from "@/lib/api"
import { useUserStore } from "@/stores/auth/auth-store"

export function useAuth() {
	const router = useRouter()
	const search = useSearchParams()
	const resetUser = useUserStore((s) => s.resetUser)

	const [loading, setLoading] = useState(false)
	const [error, setError] = useState<string | null>(null)

	const login = useCallback(
		async (email: string, password: string) => {
			setLoading(true)
			setError(null)
			try {
				const res = await apiLogin({ email, password })
				if (res.status < 200 || res.status >= 300) {
					setError("Credenciales inválidas")
					return false
				}
				const me = await apiMe()
				if (me?.user_id == null) {
					setError("No se pudo obtener la sesión")
					return false
				}

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
		[router, search]
	)

	const logout = useCallback(async () => {
		try {
			await apiLogout()
		} catch {}
		resetUser()
		router.replace("/login")
	}, [resetUser, router])

	return { login, logout, loading, error, setError }
}
