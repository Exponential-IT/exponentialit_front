export type Account = {
	account_id: number
	account_name: string
	account_tax_id: string
	total_invoices_account: number
	[k: string]: unknown
}

export type MeResponse = {
	user: string
	user_id: number
	user_email: string
	maximum_invoices: number
	total_invoices_user: number
	total_invoices_month: number
	total_invoices_success_month: number
	total_invoices_failed_month: number
	total_invoices: number
	total_invoices_success: number
	total_invoices_failed: number
	accounts: Account[]
}
