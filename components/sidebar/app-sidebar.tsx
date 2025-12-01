import React from "react"

import { NavUser } from "./nav-user"
import { NavMain } from "./nav-main"

import { Sidebar, SidebarRail, SidebarHeader, SidebarContent } from "@/components/ui/sidebar"

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
	return (
		<Sidebar {...props}>
			<SidebarHeader className="border-sidebar-border h-16 border-b">
				<NavUser />
			</SidebarHeader>
			<SidebarContent>
				<NavMain />
			</SidebarContent>
			<SidebarRail />
		</Sidebar>
	)
}
