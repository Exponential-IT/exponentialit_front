// app/(protected)/page.tsx
"use client"

import { useUserStore } from "@/stores/auth/auth-store"
import { useSession } from "@/hooks/use-session"
import http from "@/lib/axios-client"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"

export default function Home() {
	// ✅ lee campos por separado (evita objeto nuevo por render)
	const user = useUserStore((s) => s.user)
	const total_invoices_user = useUserStore((s) => s.total_invoices_user)

	const accounts = useUserStore((s) => s.accounts)
	const resetUser = useUserStore((s) => s.resetUser)

	const { loading, error, refresh } = useSession({ intervalMs: 60_000 })

	const doLogout = async () => {
		try {
			await http.post("/logout")
		} catch {
			// noop
		}
		resetUser()
		window.location.assign("/login")
	}

	if (loading) return <div className="p-6">Cargando sesión...</div>
	if (error) return <div className="p-6">No autorizado {error}</div>

	return (
		<div className="p-6 space-y-4">
			<h1 className="text-xl font-semibold">{user}</h1>
			<Separator className="my-4" />
			<p>
				<b>Total de facturas escaneadas: </b> {total_invoices_user}
			</p>
			<p>
				<b>accounts:</b> {accounts.length}
			</p>

			<pre className="text-xs bg-gray-50 p-3 rounded border overflow-auto">
				{JSON.stringify(accounts, null, 2)}
			</pre>

			<div className="flex gap-3">
				<Button
					variant="ghost"
					onClick={refresh}
					className="cursor-pointer"
				>
					Refrescar datos
				</Button>

				<Button
					onClick={doLogout}
					className="cursor-pointer"
				>
					Logout
				</Button>
			</div>
		</div>
	)
}
