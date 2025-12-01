// app/(protected)/layout.tsx (RSC)
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import SeedUser from "./seed-user"
import type { MeResponse } from "@/types/auth"
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/sidebar/app-sidebar"
import { Separator } from "@radix-ui/react-separator"
import Logotipo from "@/components/common/logotipo"
import Footer from "@/components/layout/footer"
import Link from "next/link"

async function getMeServer(): Promise<MeResponse> {
	const cookieName = process.env.AUTH_COOKIE_NAME ?? "refresh_token"
	const ck = (await cookies()).get(cookieName)?.value
	if (!ck) redirect("/login")

	const BASE = process.env.AUTH_ME_URL ?? `${process.env.AUTH_SERVER_URL}/auth/me/`
	const res = await fetch(BASE, {
		method: "GET",
		headers: { cookie: `${cookieName}=${ck}` },
		cache: "no-store",
		credentials: "include",
	})
	if (!res.ok) redirect("/login")
	return res.json()
}

export default async function ProtectedLayout({ children }: { children: React.ReactNode }) {
	const me = await getMeServer()

	return (
		<SidebarProvider>
			<AppSidebar />
			<SeedUser me={me} />
			<SidebarInset>
				<header className="bg-background sticky top-0 flex h-16 shrink-0 items-center gap-2 border-b px-4 z-10">
					<SidebarTrigger className="-ml-1" />
					<Separator
						orientation="vertical"
						className="mr-2 data-[orientation=vertical]:h-4"
					/>
					<Link href="/">
						<Logotipo className="h-14 w-auto" />
					</Link>
				</header>
				{children}
				<Footer />
			</SidebarInset>
		</SidebarProvider>
	)
}
