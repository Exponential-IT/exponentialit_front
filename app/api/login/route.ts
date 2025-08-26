// app/api/login/route.ts
import { NextRequest, NextResponse } from "next/server"
const BACKEND_LOGIN = process.env.AUTH_LOGIN_URL

export async function POST(req: NextRequest) {
	if (!BACKEND_LOGIN) {
		return NextResponse.json({ message: "AUTH_LOGIN_URL not set" }, { status: 500 })
	}

	try {
		const body = await req.json().catch(() => ({}))

		const upstream = await fetch(BACKEND_LOGIN, {
			method: "POST",
			headers: { "Content-Type": "application/json" },

			body: JSON.stringify(body),
		})

		const text = await upstream.text()
		const resp = new NextResponse(text, { status: upstream.status })

		const setCookie = upstream.headers?.getSetCookie?.() ?? upstream.headers.get("set-cookie")

		if (setCookie) {
			if (Array.isArray(setCookie)) {
				// múltiples cookies
				for (const c of setCookie) resp.headers.append("set-cookie", c)
			} else {
				resp.headers.set("set-cookie", setCookie)
			}
		}

		// Asegura content-type si el backend no lo envía
		if (!resp.headers.has("content-type")) {
			resp.headers.set("content-type", "application/json; charset=utf-8")
		}

		return resp
	} catch {
		return NextResponse.json({ message: "Login proxy error" }, { status: 502 })
	}
}

// (Opcional) Si alguien hace GET, devuelve 405
export async function GET() {
	return NextResponse.json({ message: "Method Not Allowed" }, { status: 405 })
}
