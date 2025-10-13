// lib/api.ts
"use client"

import http from "@/lib/axios-client"
import { MeResponse } from "@/types/auth"
import { EventPagResponse } from "@/types/event"

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

/** GET /api/event */
export async function apiEvent(
	params?: { page?: number; page_size?: number; [key: string]: unknown },
	opts?: { signal?: AbortSignal }
) {
	const query = new URLSearchParams()

	// primero page y page_size
	if (params?.page != null) query.set("page", String(params.page))
	if (params?.page_size != null) query.set("page_size", String(params.page_size))

	// luego cualquier otro param
	for (const [key, value] of Object.entries(params ?? {})) {
		if (key !== "page" && key !== "page_size" && value !== undefined && value !== null) {
			query.set(key, String(value))
		}
	}

	const url = query.toString() ? `/event?${query.toString()}` : "/event"

	const { data } = await http.get<EventPagResponse>(url, { signal: opts?.signal })
	return data
}
