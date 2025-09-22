import { Account } from "@/types/auth"
import { create, StateCreator } from "zustand"
import { devtools, persist } from "zustand/middleware"

interface UserState {
	user_id: number | null
	user: string
	user_email: string
	maximum_invoices: number
	total_invoices_user: number
	accounts: Account[]

	// flags de runtime
	loading: boolean
	triedAutoLogin: boolean

	// actions
	setUserData: (
		user: string,
		user_id: number,
		user_email: string,
		maximum_invoices: number,
		total_invoices_user: number,
		accounts: Account[]
	) => void
	resetUser: () => void
	setLoading: (value: boolean) => void
	setTriedAutoLogin: (value: boolean) => void
}

// Sólo persistimos esta parte del estado
type PersistedSlice = Pick<UserState, "user_id" | "accounts">

const withMiddlewares = (
	f: StateCreator<UserState, [], [], UserState>
): StateCreator<UserState, [], [["zustand/devtools", never], ["zustand/persist", PersistedSlice]], UserState> =>
	devtools(
		persist<UserState, [], [], PersistedSlice>(f, {
			name: "userStore",
			partialize: (s) => ({
				user_id: s.user_id,
				accounts: s.accounts,
			}),
		})
	)

export const useUserStore = create<UserState>()(
	withMiddlewares((set) => ({
		user: "",
		user_id: null,
		user_email: "",
		maximum_invoices: 0,
		total_invoices_user: 0,
		accounts: [],

		loading: true, // arranca en true para mostrar loader
		triedAutoLogin: false, // evita reintentos infinitos

		setUserData: (user, user_id, user_email, maximum_invoices, total_invoices_user, accounts) =>
			set({ user, user_id, user_email, maximum_invoices, total_invoices_user, accounts, loading: false }),

		setLoading: (value) => set({ loading: value }),
		setTriedAutoLogin: (v) => set({ triedAutoLogin: v }),

		resetUser: () => {
			set({
				user_id: null,
				accounts: [],
				loading: false,
				triedAutoLogin: false,
			})
			try {
				localStorage.removeItem("userStore") // limpia storage persistido
			} catch {}
		},
	}))
)
