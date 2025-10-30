// types/event.ts

export type ErrorResponse = {
	event_id: string
	ts: string
	step: string
	status: string
	service: string
	error: string
	recommendations?: string | null
	meta?: Record<string, unknown>
}

export type EventResponse = {
	request_id: string
	has_pipeline_done: boolean
	invoice_id: string
	date: string | null
	file_name: string
	partner_cif: string
	partner_name: string
	client_cif: string
	client_name: string
	amount_total: string | number | null
	amount_tax: string | number | null
}

export interface EventPageResponse {
	count: number
	page: number
	page_size: number
	total_pages: number
	next: string | null
	previous: string | null
	results: EventResponse[]
}

export type EventListParams = {
	page?: number | string
	page_size?: number | string
	user?: string
	invoice_id?: string
	file_name?: string
	partner_cif?: string
	partner_name?: string
	client_cif?: string // ← NUEVO
	date_from?: string
	date_to?: string
	has_pipeline_done?: boolean
}

export interface RequestErrorsResponse {
	request_id: string
	error_count: number
	errors: ErrorResponse[]
}

export interface ApiError {
	detail: string
	error_type: string
	status_code: number
	timestamp: string
}
