"use client"
import http from "@/lib/axios-client"
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from "@/components/ui/sidebar"
import { useUserStore } from "@/stores/auth/auth-store"
import { ChevronsUpDown, LogOut } from "lucide-react"

import {
	DropdownMenu,
	DropdownMenuTrigger,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuGroup,
} from "@/components/ui/dropdown-menu"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import isotipo from "@/public/isotipo.svg"
import { useState } from "react"
import { toast } from "sonner"

export function NavUser() {
	const user = useUserStore((s) => s.user)
	const user_email = useUserStore((s) => s.user_email)

	const icon = typeof user === "string" && user.length >= 2 ? user.slice(0, 2).toUpperCase() : "US"
	const { isMobile } = useSidebar()
	const resetUser = useUserStore((s) => s.resetUser)
	// Logout

	const [loading, setLoading] = useState(false)

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
		<SidebarMenu>
			<SidebarMenuItem>
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<SidebarMenuButton
							size="lg"
							className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
						>
							<Avatar className="cursor-pointer">
								<AvatarImage
									src={isotipo.src}
									alt="isotipo Exponential it"
								/>
								<AvatarFallback>{icon}</AvatarFallback>
							</Avatar>
							<div className="grid flex-1 text-left text-sm leading-tight">
								<span className="truncate font-medium">{user}</span>
								<span className="truncate text-xs">{user_email}</span>
							</div>
							<ChevronsUpDown className="ml-auto size-4" />
						</SidebarMenuButton>
					</DropdownMenuTrigger>
					<DropdownMenuContent
						className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
						side={isMobile ? "bottom" : "right"}
						align="start"
						sideOffset={4}
					>
						<DropdownMenuGroup>
							<DropdownMenuItem
								onClick={handleLogoutClick}
								disabled={loading}
							>
								<LogOut />
								Salir
							</DropdownMenuItem>
						</DropdownMenuGroup>
					</DropdownMenuContent>
				</DropdownMenu>
			</SidebarMenuItem>
		</SidebarMenu>
	)
}
