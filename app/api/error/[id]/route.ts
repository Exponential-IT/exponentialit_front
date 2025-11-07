// app/api/error/[id]/route.ts
import { NextRequest, NextResponse } from "next/server"

export const runtime = "nodejs"

const ensureTrailingSlash = (s: string) => (s.endsWith("/") ? s : s + "/")

const BACKEND_ERROR_BASE = ensureTrailingSlash(
	process.env.ERROR_URL ?? `${process.env.AUTH_SERVER_URL}/invoice-events/errors/`
)

export async function GET(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
	try {
		const { id } = await ctx.params
		const upstreamUrl = new URL(`${encodeURIComponent(id)}/`, BACKEND_ERROR_BASE).toString()

		let upstream: Response
		try {
			upstream = await fetch(upstreamUrl, {
				method: "GET",
				headers: { cookie: req.headers.get("cookie") ?? "" },
			})
		} catch (err) {
			return NextResponse.json(
				{ detail: "Fallo al contactar upstream", error: String(err), upstreamUrl },
				{ status: 502 }
			)
		}

		const bodyText = await upstream.text()
		const resp = new NextResponse(bodyText, { status: upstream.status })

		const ct = upstream.headers.get("content-type")
		resp.headers.set("content-type", ct ?? "application/json; charset=utf-8")

		const anyHeaders = upstream.headers as unknown as { getSetCookie?: () => string[] }
		const setCookie = anyHeaders.getSetCookie?.() ?? upstream.headers.get("set-cookie")
		if (setCookie) {
			if (Array.isArray(setCookie)) for (const c of setCookie) resp.headers.append("set-cookie", c)
			else resp.headers.set("set-cookie", setCookie)
		}

		return resp
	} catch (e) {
		return NextResponse.json({ detail: "Handler error", error: String(e) }, { status: 502 })
	}
}

export async function POST() {
	return NextResponse.json({ message: "Method Not Allowed" }, { status: 405 })
}
