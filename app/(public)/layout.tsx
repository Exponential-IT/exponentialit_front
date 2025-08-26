// app/(public)/layout.tsx
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import type { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies"

export default async function PublicLayout({ children }: { children: React.ReactNode }) {
	// En algunos setups cookies() se tipa como Promise; este cast evita el warning de TS.
	const cookieStore = (await cookies()) as unknown as ReadonlyRequestCookies
	const cookieName = process.env.AUTH_COOKIE_NAME ?? "refresh_token"

	// Si hay sesión (cookie presente) → no permitas /login: ve al dashboard
	const token = cookieStore.get(cookieName)?.value
	if (token) {
		redirect("/")
	}

	return <>{children}</>
}
