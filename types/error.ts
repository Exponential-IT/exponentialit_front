// types/error.ts

// Un solo error (real o sintético). Campos permisivos porque pueden venir nulos.
export type ErrorItem = {
	event_id: string | null
	ts?: string | null
	step?: string | null
	status?: string | null
	service?: string | null
	error?: string | null
	recommendations?: string | null
	meta?: Record<string, unknown> | null
	// útil para distinguir errores sintéticos en el front (opcional):
	synthetic?: boolean
}

export interface RequestErrorsResponse {
	request_id: string
	has_pipeline_done: boolean
	last_step?: string | null
	last_status?: string | null
	last_service?: string | null
	error_count: 0 | 1
	error: ErrorItem | null
}

export interface ApiError {
	detail: string
	error_type: string
	status_code: number
	timestamp: string
}

export type ErrorListParams = {
	request_id: string
}
