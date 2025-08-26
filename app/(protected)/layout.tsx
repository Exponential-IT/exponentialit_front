// app/(protected)/layout.tsx
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import type { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies"

export default async function ProtectedLayout({ children }: { children: React.ReactNode }) {
	const cookieStore = (await cookies()) as unknown as ReadonlyRequestCookies
	const cookieName = process.env.AUTH_COOKIE_NAME ?? "refresh_token"
	const token = cookieStore.get(cookieName)?.value

	if (!token) redirect("/login")

	return <>{children}</>
}
