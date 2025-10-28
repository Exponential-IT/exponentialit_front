// app/api/me/route.ts
import { NextRequest, NextResponse } from "next/server"

const BACKEND_ME = process.env.AUTH_ME_URL ?? `${process.env.AUTH_SERVER_URL}/auth/me/`

export async function GET(req: NextRequest) {
	try {
		const upstream = await fetch(BACKEND_ME, {
			method: "GET",
			headers: { cookie: req.headers.get("cookie") ?? "" },
			cache: "no-store",
			credentials: "include",
		})

		const text = await upstream.text()
		const resp = new NextResponse(text, { status: upstream.status })

		const setCookie = upstream.headers?.getSetCookie?.() ?? upstream.headers.get("set-cookie")
		if (setCookie) {
			if (Array.isArray(setCookie)) setCookie.forEach((c) => resp.headers.append("set-cookie", c))
			else resp.headers.set("set-cookie", setCookie)
		}
		if (!resp.headers.has("content-type")) resp.headers.set("content-type", "application/json; charset=utf-8")

		// evita revalidaciones automáticas
		resp.headers.set("cache-control", "no-store, no-cache, must-revalidate")

		return resp
	} catch {
		return NextResponse.json({ message: "ME proxy error" }, { status: 502 })
	}
}
