export type ErrorResponse = {
	event_id: string
	ts: string
	step: string
	status: string
	error: string
	request_id: string
	invoice_id: string
	date: string | null
	file_name: string
	partner_cif: string | null
	partner_name: string | null
	amount_total: number | null
	amount_tax: number | null
}

export type EventResponse = {
	request_id: string
	has_pipeline_done: boolean
	invoice_id: string
	date: string | null
	file_name: string
	partner_cif: string
	partner_name: string
	amount_total: string | null
	amount_tax: string | null
	errors: ErrorResponse[]
}
export interface EventPagResponse {
	count: number
	page: number
	page_size: number
	total_pages: number
	results: EventResponse[]
	next: string | null
	previous: string | null
}
