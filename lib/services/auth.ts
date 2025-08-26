"use client"
import http from "@/lib/axios-client"
import type { MeResponse } from "@/types/auth"

export async function loginRequest(payload: { email: string; password: string }) {
	return http.post("/login", payload)
}

export async function fetchMe() {
	const { data } = await http.get<MeResponse>("/me")
	return data
}

export async function logoutRequest() {
	return http.post("/logout")
}
