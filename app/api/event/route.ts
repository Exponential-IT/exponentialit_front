// app/api/event/route.ts
import { NextRequest, NextResponse } from "next/server"

const BACKEND_EVENT = process.env.EVENT_URL ?? `${process.env.AUTH_SERVER_URL}/invoice-events/summary/`

export async function GET(req: NextRequest) {
	try {
		const upstreamUrl = new URL(BACKEND_EVENT)
		const incoming = new URL(req.url)

		incoming.searchParams.forEach((value, key) => {
			upstreamUrl.searchParams.set(key, value)
		})

		const upstream = await fetch(upstreamUrl.toString(), {
			method: "GET",
			headers: {
				cookie: req.headers.get("cookie") ?? "",
			},
		})

		const text = await upstream.text()
		const resp = new NextResponse(text, { status: upstream.status })

		const setCookie = upstream.headers?.getSetCookie?.() ?? upstream.headers.get("set-cookie")
		if (setCookie) {
			if (Array.isArray(setCookie)) {
				for (const c of setCookie) resp.headers.append("set-cookie", c)
			} else {
				resp.headers.set("set-cookie", setCookie)
			}
		}

		if (!resp.headers.has("content-type")) {
			resp.headers.set("content-type", "application/json; charset=utf-8")
		}
			
		return resp
	} catch {
		return NextResponse.json({ message: "EVENT proxy error" }, { status: 502 })
	}
}

export async function POST() {
	return NextResponse.json({ message: "Method Not Allowed" }, { status: 405 })
}
