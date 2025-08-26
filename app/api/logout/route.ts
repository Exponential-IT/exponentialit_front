import { NextRequest, NextResponse } from "next/server"

const BACKEND_LOGOUT = process.env.AUTH_LOGOUT_URL ?? `${process.env.AUTH_SERVER_URL}/auth/logout/`

export async function POST(req: NextRequest) {
	try {
		const upstream = await fetch(BACKEND_LOGOUT!, {
			method: "POST",
			headers: {
				cookie: req.headers.get("cookie") ?? "",
			},
		})

		const text = await upstream.text()
		const resp = new NextResponse(text, { status: upstream.status })

		const setCookie = upstream.headers?.getSetCookie?.() ?? upstream.headers.get("set-cookie")
		if (setCookie) {
			if (Array.isArray(setCookie)) setCookie.forEach((c) => resp.headers.append("set-cookie", c))
			else resp.headers.set("set-cookie", setCookie)
		}

		if (!resp.headers.has("content-type")) {
			resp.headers.set("content-type", "application/json; charset=utf-8")
		}
		return resp
	} catch {
		return NextResponse.json({ message: "Logout proxy error" }, { status: 502 })
	}
}
