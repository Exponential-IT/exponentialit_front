export type ErrorResponse = {
	error: string
	event_id: string
	request_id: string
	status: string
	step: string
	ts: string
}

export type EventResponse = {
	amount_total: string | null
	amount_tax: string | null
	date: string | null
	errors: ErrorResponse[]
	file_name: string
	has_pipeline_done: boolean
	invoice_id: string
	partner_cif: string
	partner_name: string
	request_id: string
}
export interface EventPageResponse {
	count: number
	next: string | null
	page: number
	page_size: number
	previous: string | null
	results: EventResponse[]
	total_pages: number
}

export type EventListParams = {
	page?: number | string
	page_size?: number | string
	user?: string
	invoice_id?: string
	file_name?: string
	partner_cif?: string
	date_from?: string
	date_to?: string
	has_pipeline_done?: boolean
}

export interface ApiError {
	detail: string
	error_type: string
	status_code: number
	timestamp: string
}
