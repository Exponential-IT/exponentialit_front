import http from "@/lib/axios-client"
import { Button } from "@/components/ui/button"
import { Unplug } from "lucide-react"

import { useUserStore } from "@/stores/auth/auth-store"

export function LogoutButton() {
	const resetUser = useUserStore((s) => s.resetUser)
	const doLogout = async () => {
		try {
			await http.post("/logout")
		} catch {
			// noop
		}
		resetUser()
		window.location.assign("/login")
	}
	return (
		<Button
			variant="destructive"
			size="icon"
			onClick={() => {
				void doLogout()
			}}
			className="cursor-pointer hover:scale-105 active:scale-95 transition-transform duration-300 "
		>
			<Unplug />
			<span className="sr-only">Cerrar sesión</span>
		</Button>
	)
}
