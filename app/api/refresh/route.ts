// app/api/refresh/route.ts
import { NextRequest, NextResponse } from "next/server"

export const runtime = "nodejs"

const ensureTrailingSlash = (s: string) => (s.endsWith("/") ? s : s + "/")

function buildRefreshUrl(): string | null {
	const direct = process.env.AUTH_REFRESH_URL?.trim()
	if (direct) {
		return ensureTrailingSlash(direct)
	}

	const authBase = process.env.AUTH_SERVER_URL?.trim()
	if (!authBase) {
		return null
	}

	return ensureTrailingSlash(`${authBase}/auth/refresh/`)
}

export async function POST(req: NextRequest) {
	const upstreamUrl = buildRefreshUrl()
	if (!upstreamUrl) {
		return NextResponse.json(
			{
				detail: "AUTH_REFRESH_URL o AUTH_SERVER_URL no están configuradas correctamente",
			},
			{ status: 500 }
		)
	}

	try {
		const upstream = await fetch(upstreamUrl, {
			method: "POST",
			headers: {
				cookie: req.headers.get("cookie") ?? "",
			},
		})

		const text = await upstream.text()
		const resp = new NextResponse(text, { status: upstream.status })

		// Propagar set-cookie
		const headersWithGetSetCookie = upstream.headers as unknown as {
			getSetCookie?: () => string[]
		}
		const setCookie = headersWithGetSetCookie.getSetCookie?.() ?? upstream.headers.get("set-cookie")

		if (setCookie) {
			if (Array.isArray(setCookie)) {
				for (const c of setCookie) {
					resp.headers.append("set-cookie", c)
				}
			} else {
				resp.headers.set("set-cookie", setCookie)
			}
		}

		// content-type
		if (!resp.headers.has("content-type")) {
			resp.headers.set("content-type", "application/json; charset=utf-8")
		}

		return resp
	} catch (e) {
		return NextResponse.json({ detail: "Refresh proxy error", error: String(e) }, { status: 502 })
	}
}
