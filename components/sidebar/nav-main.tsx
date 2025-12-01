import React from "react"
import {
	SidebarGroup,
	SidebarGroupContent,
	SidebarGroupLabel,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
} from "@/components/ui/sidebar"
import Link from "next/link"

export function NavMain() {
	return (
		<SidebarGroup>
			<SidebarGroupLabel>Configuración</SidebarGroupLabel>
			<SidebarGroupContent className="flex flex-col gap-2">
				<SidebarMenu>
					<SidebarMenuItem className="flex items-center gap-2"></SidebarMenuItem>
					<SidebarMenu>
						<SidebarMenuItem className="flex items-center gap-2">
							<SidebarMenuButton
								asChild
								isActive={false}
							>
								<Link href={"/reset-password"}>restablecer tu contraseña</Link>
							</SidebarMenuButton>
						</SidebarMenuItem>
					</SidebarMenu>
				</SidebarMenu>
			</SidebarGroupContent>
		</SidebarGroup>
	)
}
