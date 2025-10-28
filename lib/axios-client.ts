// lib/axios-client.ts
"use client"

import axios, { AxiosError, AxiosInstance, AxiosRequestConfig, InternalAxiosRequestConfig, AxiosHeaders } from "axios"
import { useUserStore } from "@/stores/auth/auth-store"
import { toast } from "sonner"

/** ------- Utils ------- */
function isFormData(body: unknown): body is FormData {
	return typeof FormData !== "undefined" && body instanceof FormData
}

/** ------- Axios base (cliente) ------- */
const client: AxiosInstance = axios.create({
	baseURL: "/api",
	withCredentials: true,
	headers: { accept: "application/json" },
	timeout: 30_000,
})

/** ------- Interceptor de request ------- */
client.interceptors.request.use((config: InternalAxiosRequestConfig) => {
	// Normaliza headers a AxiosHeaders
	const headers = AxiosHeaders.from(config.headers)

	if (config.data && isFormData(config.data)) {
		// Deja que el browser ponga el boundary automáticamente
		headers.delete("Content-Type")
		headers.delete("content-type")
	} else if (!headers.has("Content-Type")) {
		headers.set("Content-Type", "application/json")
	}

	// Asigna AxiosHeaders (no un objeto plano)
	config.headers = headers
	return config
})

/** ------- Refresh con cola ------- */
type QueueItem = {
	resolve: (value?: unknown) => void
	reject: (reason?: unknown) => void
}

let isRefreshing = false
let refreshPromise: Promise<Response> | null = null
const pendingQueue: QueueItem[] = []

const RETRY_STATUSES = new Set([401, 419, 440])

async function doRefresh(): Promise<Response> {
	return fetch("/api/refresh", {
		method: "POST",
		credentials: "include",
	})
}

function enqueueRequest(): Promise<unknown> {
	return new Promise<unknown>((resolve, reject) => {
		pendingQueue.push({ resolve, reject })
	})
}

function flushQueue(error: unknown, data?: unknown): void {
	while (pendingQueue.length) {
		const item = pendingQueue.shift()!
		if (error) item.reject(error)
		else item.resolve(data)
	}
}

/** ------- Interceptor de response (refresh + retry) ------- */
client.interceptors.response.use(
	(res) => res,
	async (error: AxiosError) => {
		const original = error.config as (AxiosRequestConfig & { _retry?: boolean }) | undefined
		const status = error.response?.status

		if (!original || !status || !RETRY_STATUSES.has(status) || original._retry) {
			return Promise.reject(error)
		}

		original._retry = true

		try {
			if (isRefreshing) {
				await enqueueRequest()
			} else {
				isRefreshing = true
				refreshPromise = doRefresh()

				const res = await refreshPromise
				isRefreshing = false

				if (!res.ok) {
					useUserStore.getState().resetUser()
					flushQueue(new Error("Refresh failed"))
					try {
						toast.error("Sesión expirada")
					} catch {
						/* noop */
					}
					if (typeof window !== "undefined") window.location.assign("/login")
					return Promise.reject(error)
				}

				flushQueue(undefined, true)
			}

			return client(original)
		} catch (err: unknown) {
			isRefreshing = false
			flushQueue(err)
			return Promise.reject(err)
		}
	}
)

export default client
