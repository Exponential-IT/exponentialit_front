// app/(protected)/layout.tsx (RSC)
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import SeedUser from "./seed-user"
import type { MeResponse } from "@/types/auth"

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
		<>
			<SeedUser me={me} />
			{children}
		</>
	)
}
