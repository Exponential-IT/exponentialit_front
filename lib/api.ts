// lib/api.ts
"use client"

import { isAxiosError, AxiosError } from "axios"
import http from "@/lib/axios-client"

import type { MeResponse } from "@/types/auth"
import type { ApiError, RequestErrorsResponse } from "@/types/error"
import type { EventListParams, EventPageResponse } from "@/types/event"

/* ---------------------------------------------------------
   ERROR NORMALIZATION
--------------------------------------------------------- */

function toApiError(error: unknown): ApiError {
	if (isAxiosError(error)) {
		const err = error as AxiosError<unknown, unknown>
		const status = err.response?.status ?? 0
		const data = err.response?.data

		if (data && typeof data === "object") {
			const obj = data as {
				detail?: unknown
				error_type?: unknown
				status_code?: unknown
				timestamp?: unknown
			}

			if (
				typeof obj.detail === "string" &&
				typeof obj.error_type === "string" &&
				typeof obj.status_code === "number"
			) {
				return {
					detail: obj.detail,
					error_type: obj.error_type,
					status_code: obj.status_code,
					timestamp: typeof obj.timestamp === "string" ? obj.timestamp : new Date().toISOString(),
				}
			}
		}

		let detailFromData: string | undefined

		if (typeof data === "string") {
			detailFromData = data
		} else if (data && typeof data === "object") {
			const obj = data as { detail?: unknown }
			if (typeof obj.detail === "string") {
				detailFromData = obj.detail
			}
		}

		return {
			detail: detailFromData ?? err.message ?? "Error desconocido",
			error_type: "HTTPError",
			status_code: status,
			timestamp: new Date().toISOString(),
		}
	}

	return {
		detail: String(error),
		error_type: "UnknownError",
		status_code: 0,
		timestamp: new Date().toISOString(),
	}
}

/* ---------------------------------------------------------
   AUTH
--------------------------------------------------------- */

/** GET /api/me */
export async function apiMe(opts?: { signal?: AbortSignal }) {
	const { data } = await http.get<MeResponse>("/me", {
		signal: opts?.signal,
	})
	return data
}

/** POST /api/login */
export async function apiLogin(payload: { email: string; password: string }, opts?: { signal?: AbortSignal }) {
	const { data, status } = await http.post("/login", payload, {
		signal: opts?.signal,
	})
	return { data, status }
}

/** POST /api/logout */
export async function apiLogout(opts?: { signal?: AbortSignal }) {
	const { data } = await http.post("/logout", undefined, {
		signal: opts?.signal,
	})
	return data
}

/** POST /api/reset */
export async function ApiResetPassword(
	payload: Record<string, unknown>,
	opts?: { signal?: AbortSignal }
): Promise<unknown> {
	try {
		const { data } = await http.post("/reset", payload, {
			signal: opts?.signal,
		})
		return data
	} catch (err) {
		throw toApiError(err)
	}
}

/* ---------------------------------------------------------
   EVENTOS
--------------------------------------------------------- */

/** GET /api/event */
export async function apiEvent(params: EventListParams, opts?: { signal?: AbortSignal }): Promise<EventPageResponse> {
	try {
		const { data } = await http.get<EventPageResponse>("/event", {
			params,
			signal: opts?.signal,
		})
		return data
	} catch (err) {
		throw toApiError(err)
	}
}

/** GET /api/error/:request_id */
export async function ApiErrorByRequestId(
	request_id: string,
	opts?: { signal?: AbortSignal }
): Promise<RequestErrorsResponse> {
	try {
		const { data } = await http.get<RequestErrorsResponse>(`/error/${encodeURIComponent(request_id)}`, {
			signal: opts?.signal,
		})
		return data
	} catch (err) {
		throw toApiError(err)
	}
}

/** DELETE /api/delete/:request_id */
export async function ApiDeleteByRequestId(
	request_id: string,
	opts?: { signal?: AbortSignal }
): Promise<RequestErrorsResponse> {
	try {
		const { data } = await http.delete<RequestErrorsResponse>(`/delete/${encodeURIComponent(request_id)}`, {
			signal: opts?.signal,
		})
		return data
	} catch (err) {
		throw toApiError(err)
	}
}
