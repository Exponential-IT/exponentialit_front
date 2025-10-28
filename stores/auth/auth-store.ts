import { Account } from "@/types/auth"
import { create, StateCreator } from "zustand"
import { devtools, persist, createJSONStorage } from "zustand/middleware"

interface UserState {
	user_id: number | null
	user: string
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

	loading: boolean
	triedAutoLogin: boolean

	setUserData: (
		user: string,
		user_id: number,
		user_email: string,
		maximum_invoices: number,
		total_invoices_user: number,
		total_invoices_month: number,
		total_invoices_success_month: number,
		total_invoices_failed_month: number,
		total_invoices: number,
		total_invoices_success: number,
		total_invoices_failed: number,
		accounts: Account[]
	) => void
	resetUser: () => void
	setLoading: (value: boolean) => void
	setTriedAutoLogin: (value: boolean) => void
}

const initialState: Omit<UserState, "setUserData" | "resetUser" | "setLoading" | "setTriedAutoLogin"> = {
	user: "",
	user_id: null,
	user_email: "",
	maximum_invoices: 0,
	total_invoices_user: 0,
	total_invoices_month: 0,
	total_invoices_success_month: 0,
	total_invoices_failed_month: 0,
	total_invoices: 0,
	total_invoices_success: 0,
	total_invoices_failed: 0,
	accounts: [],
	loading: true,
	triedAutoLogin: false,
}

type PersistedSlice = Pick<UserState, "user_id" | "user_email" | "user" | "accounts">

const withMiddlewares = (
	f: StateCreator<UserState, [], [], UserState>
): StateCreator<UserState, [], [["zustand/devtools", never], ["zustand/persist", PersistedSlice]], UserState> =>
	devtools(
		persist<UserState, [], [], PersistedSlice>(f, {
			name: "userStore",
			storage: createJSONStorage(() => localStorage),
			partialize: (s) => ({
				user_id: s.user_id,
				user_email: s.user_email,
				user: s.user, //
				accounts: s.accounts,
			}),
		})
	)

export const useUserStore = create<UserState>()(
	withMiddlewares((set) => ({
		...initialState,

		setUserData: (
			user,
			user_id,
			user_email,
			maximum_invoices,
			total_invoices_user,
			total_invoices_month,
			total_invoices_success_month,
			total_invoices_failed_month,
			total_invoices,
			total_invoices_success,
			total_invoices_failed,
			accounts
		) =>
			set({
				user,
				user_id,
				user_email,
				maximum_invoices,
				total_invoices_user,
				total_invoices_month,
				total_invoices_success_month,
				total_invoices_failed_month,
				total_invoices,
				total_invoices_success,
				total_invoices_failed,
				accounts,
				loading: false,
			}),

		setLoading: (value) => set({ loading: value }),
		setTriedAutoLogin: (v) => set({ triedAutoLogin: v }),

		resetUser: () => {
			set({ ...initialState, loading: false })
			try {
				localStorage.removeItem("userStore")
			} catch {}
		},
	}))
)
