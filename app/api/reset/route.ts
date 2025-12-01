// app/api/reset/route.ts
import { NextRequest, NextResponse } from "next/server"

export const runtime = "nodejs"

const ensureTrailingSlash = (s: string) => (s.endsWith("/") ? s : s + "/")

function buildResetPasswordUrl(): string | null {
	const direct = process.env.RESET_PASSWORD_URL
	if (direct && direct.trim() !== "") {
		return ensureTrailingSlash(direct.trim())
	}

	const authBase = process.env.AUTH_SERVER_URL
	if (!authBase || authBase.trim() === "") {
		return null
	}

	return ensureTrailingSlash(`${authBase.trim()}/auth/change-password/`)
}

/** POST /api/reset */
export async function POST(req: NextRequest) {
	const baseUrl = buildResetPasswordUrl()
	if (!baseUrl) {
		return NextResponse.json(
			{
				detail: "RESET_PASSWORD_URL o AUTH_SERVER_URL no configuradas correctamente",
			},
			{ status: 500 }
		)
	}

	let payload: unknown
	try {
		payload = await req.json()
	} catch {
		return NextResponse.json({ detail: "Body JSON inválido o ausente" }, { status: 400 })
	}

	if (payload === null || typeof payload !== "object") {
		return NextResponse.json({ detail: "El body debe ser un objeto JSON" }, { status: 400 })
	}

	const upstreamUrl = baseUrl

	let upstream: Response
	try {
		upstream = await fetch(upstreamUrl, {
			method: "POST",
			headers: {
				"content-type": "application/json",
				authorization: req.headers.get("authorization") ?? "",
				cookie: req.headers.get("cookie") ?? "",
			},
			body: JSON.stringify(payload),
		})
	} catch (err) {
		return NextResponse.json(
			{
				detail: "Fallo al contactar upstream",
				error: String(err),
				upstreamUrl,
			},
			{ status: 502 }
		)
	}

	const bodyText = await upstream.text()
	const resp = new NextResponse(bodyText, { status: upstream.status })

	// content-type
	const ct = upstream.headers.get("content-type")
	resp.headers.set("content-type", ct ?? "application/json; charset=utf-8")

	// Propagar set-cookie
	const headersWithGetSetCookie = upstream.headers as unknown as {
		getSetCookie?: () => string[]
	}
	const setCookie = headersWithGetSetCookie.getSetCookie?.() ?? upstream.headers.get("set-cookie")

	if (setCookie) {
		if (Array.isArray(setCookie)) {
			for (const c of setCookie) resp.headers.append("set-cookie", c)
		} else {
			resp.headers.set("set-cookie", setCookie)
		}
	}

	return resp
}

export async function GET() {
	return NextResponse.json({ message: "Method Not Allowed" }, { status: 405 })
}
