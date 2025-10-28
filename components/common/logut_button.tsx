import http from "@/lib/axios-client"
import { Button } from "@/components/ui/button"
import { Unplug, Loader2 } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"
import { useUserStore } from "@/stores/auth/auth-store"
import { cn } from "@/lib/utils"

type Props = {
	className?: string
}

export function LogoutButton({ className, ...props }: Props) {
	const [loading, setLoading] = useState(false)
	const resetUser = useUserStore((s) => s.resetUser)

	const handleLogoutClick = () => {
		toast("¿Cerrar sesión?", {
			position: "top-center",
			description: "Tu sesión se cerrará y serás redirigido al login.",
			classNames: {
				description: "!text-foreground",
				title: "!text-destructive",
				toast: "!flex !flex-col !items-start shadow-2xl",
				actionButton: "!mt-3 !ml-0 !bg-destructive",
			},
			action: {
				label: "Confirmar",
				onClick: doLogout,
			},
			cancel: "Cancelar",
		})
	}

	const doLogout = async () => {
		setLoading(true)
		try {
			await http.post("/logout")
		} catch {
			// noop
		} finally {
			resetUser()
			window.location.assign("/login")
		}
	}

	return (
		<Button
			variant="destructive"
			size="sm"
			onClick={handleLogoutClick}
			disabled={loading}
			className={cn("", className)}
			{...props}
		>
			{loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Unplug className="h-4 w-4" />}
			<span>Salir</span>
		</Button>
	)
}
