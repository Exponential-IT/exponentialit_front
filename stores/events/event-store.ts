import { EventResponse } from "@/types/event"
import { create, StateCreator } from "zustand"
import { devtools, persist } from "zustand/middleware"

export interface EventState {
	count: number
	page: number
	page_size: number
	total_pages: number
	next: string | null
	previous: string | null
	results: EventResponse[]

	// FLags de runtime
	loading_event: boolean
	triedAutoLogin: boolean

	// Filtros/params extras (para que persista el contexto de búsqueda)
	params: Record<string, unknown>

	// Actions
	setEventData: (
		count: number,
		page: number,
		page_size: number,
		total_pages: number,
		results: EventResponse[],
		next: string | null,
		previous: string | null
	) => void
	setLoading: (value: boolean) => void
	setTriedAutoLogin: (value: boolean) => void

	// Acciones de paginación (solo actualizan el store; el hook hará el fetch)
	setPage: (page: number) => void
	setPageSize: (n: number) => void
	setParams: (p: Record<string, unknown>) => void
}

type PersistedSlice = Pick<EventState, "results" | "params">

const withMiddlewares = (
	f: StateCreator<EventState, [], [], EventState>
): StateCreator<EventState, [], [["zustand/devtools", never], ["zustand/persist", PersistedSlice]], EventState> =>
	devtools(
		persist<EventState, [], [], PersistedSlice>(f, {
			name: "userStore",
			partialize: (s) => ({
				results: s.results,
				params: s.params,
			}),
		})
	)

export const useEventStore = create<EventState>()(
	withMiddlewares((set, get) => ({
		count: 0,
		page: 1,
		page_size: 10,
		total_pages: 1,
		results: [],
		next: "",
		previous: "",

		loading_event: true,
		triedAutoLogin: false,

		params: {},

		setEventData: (count, page, page_size, total_pages, results, next, previous) =>
			set({ count, page, page_size, total_pages, results, next, previous }),

		setLoading: (value) => set({ loading_event: value }),
		setTriedAutoLogin: (v) => set({ triedAutoLogin: v }),

		setPage: (page) => set({ page }),
		setPageSize: (n) => set({ page_size: n, page: 1 }),
		setParams: (p) => set({ params: { ...get().params, ...p }, page: 1 }),
	}))
)
