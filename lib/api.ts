// lib/api.ts
"use client"

import http from "@/lib/axios-client"
import { MeResponse } from "@/types/auth"

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
