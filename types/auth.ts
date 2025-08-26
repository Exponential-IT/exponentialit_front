export type Account = {
	account_id: number
	account_name: string
	account_tax_id: string
	total_invoices_account: number
	[k: string]: unknown
}

export type MeResponse = {
	user_id: number
	user: string
	user_email: string
	total_invoices_user: number
	accounts: Account[]
}
