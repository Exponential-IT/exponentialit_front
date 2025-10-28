// lib/api.ts
"use client"

import http from "@/lib/axios-client"
import { MeResponse } from "@/types/auth"
import { ApiError, EventListParams, EventPageResponse } from "@/types/event"

/** GET /api/me → { user_id, accounts } */
export async function apiMe(opts?: { signal?: AbortSignal }) {
	const { data } = await http.get<MeResponse>("/me", { signal: opts?.signal })
	return data
}

/** POST /api/login { email, password } */
export async function apiLogin(payload: { email: string; password: string }, opts?: { signal?: AbortSignal }) {
	const { data, status } = await http.post("/login", payload, { signal: opts?.signal })
	return { data, status }
}

/** POST /api/logout */
export async function apiLogout(opts?: { signal?: AbortSignal }) {
	const { data } = await http.post("/logout", undefined, { signal: opts?.signal })
	return data
}

function buildQS(params: Record<string, unknown>) {
	const qs = new URLSearchParams()
	Object.entries(params).forEach(([k, v]) => {
		if (v === undefined || v === null) return
		if (typeof v === "string" && v.trim() === "") return
		qs.set(k, String(v))
	})
	return qs.toString()
}

/** GET /api/event */
export async function apiEvent(params: EventListParams, init?: RequestInit): Promise<EventPageResponse> {
	const qs = buildQS(params)
	const url = `/api/event${qs ? `?${qs}` : ""}`

	const r = await fetch(url, { ...init })
	const text = await r.text()

	const json = text ? (JSON.parse(text) as unknown) : null

	if (!r.ok) {
		const err: ApiError = (json as ApiError) ?? {
			detail: "Error desconocido",
			error_type: "HTTPError",
			status_code: r.status,
			timestamp: new Date().toISOString(),
		}
		throw err
	}

	return json as EventPageResponse
}
