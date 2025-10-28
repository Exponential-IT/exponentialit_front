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

	loading_event: boolean
	events_error: string | null
	last_updated: number | null

	triedAutoLogin: boolean
	params: Record<string, unknown>

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
	setEventsError: (msg: string | null) => void
	setLastUpdated: (ts: number | null) => void
	setTriedAutoLogin: (value: boolean) => void

	setPage: (page: number) => void
	setPageSize: (n: number, resetPage?: boolean) => void
	setParams: (p: Record<string, unknown>, resetPage?: boolean) => void
	refresh: () => void
}

type PersistedSlice = Pick<EventState, "results" | "params">

const withMiddlewares = (
	f: StateCreator<EventState, [], [], EventState>
): StateCreator<EventState, [], [["zustand/devtools", never], ["zustand/persist", PersistedSlice]], EventState> =>
	devtools(
		persist<EventState, [], [], PersistedSlice>(f, {
			name: "eventStore",
			partialize: (s) => ({
				results: s.results,
				params: s.params,
			}),
		})
	)

export const useEventStore = create<EventState>()(
	withMiddlewares((set) => ({
		count: 0,
		page: 1,
		page_size: 10,
		total_pages: 1,
		results: [],
		next: null,
		previous: null,

		loading_event: true,
		events_error: null,
		last_updated: null,

		triedAutoLogin: false,
		params: {},

		setEventData: (count, page, page_size, total_pages, results, next, previous) => {
			set({ count, page, page_size, total_pages, results, next, previous })
		},

		setLoading: (value) => set({ loading_event: value }),
		setEventsError: (msg) => set({ events_error: msg }),
		setLastUpdated: (ts) => set({ last_updated: ts }),
		setTriedAutoLogin: (v) => set({ triedAutoLogin: v }),

		setPage: (page) => {
			set({ page })
		},

		setPageSize: (n, resetPage = true) => {
			if (resetPage) {
			}
			set({
				page_size: n,
				...(resetPage ? { page: 1 } : {}),
			})
		},

		setParams: (p, resetPage = true) => {
			set(({ params }) => ({
				params: { ...params, ...p },
				...(resetPage ? { page: 1 } : {}),
			}))
		},

		refresh: () => {
			set(({ params, page }) => ({
				params: { ...params, _refresh: String(Date.now()) },
				page,
			}))
		},
	}))
)
