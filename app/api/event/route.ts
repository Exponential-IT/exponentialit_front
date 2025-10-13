// app\api\event\route.ts
import { NextRequest, NextResponse } from "next/server"

const BACKEND_EVENT = process.env.EVENT_URL ?? `${process.env.AUTH_SERVER_URL}/invoice-events/summary/`

export async function GET(req: NextRequest) {
	try {
		const { searchParams } = new URL(req.url)

		const page = searchParams.get("page") ?? "1"
		const page_size = searchParams.get("page_size") ?? "10"
		const extra = searchParams.get("extra") ?? null

		const query = new URLSearchParams()
		query.set("page", page)
		query.set("page_size", page_size)
		if (extra) query.set("extra", extra)

		const url = `${BACKEND_EVENT}?${query.toString()}`

		const upstream = await fetch(url, {
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
