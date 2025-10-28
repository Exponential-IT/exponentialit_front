"use client"

import { useCallback } from "react"
import { useEventStore, type EventState } from "@/stores/events/event-store"
import type { EventListParams } from "@/types/event"

const useSel = <T>(sel: (s: EventState) => T) => useEventStore(sel)

export function useEventPassive() {
	const page = useSel((s) => s.page)
	const page_size = useSel((s) => s.page_size)
	const total_pages = useSel((s) => s.total_pages)
	const loading = useSel((s) => s.loading_event)

	const setPage = useSel((s) => s.setPage)
	const setPS = useSel((s) => s.setPageSize)
	const setParamsStore = useSel((s) => s.setParams)
	const refreshStore = useSel((s) => s.refresh)

	const goto = useCallback(
		(p: number) => {
			const bounded = Math.max(1, total_pages ? Math.min(p, total_pages) : p)

			if (bounded !== page) setPage(bounded)
		},
		[setPage, page, total_pages]
	)

	const next = useCallback(() => {
		const target = total_pages ? Math.min(page + 1, total_pages) : page + 1

		if (target !== page) setPage(target)
	}, [setPage, page, total_pages])

	const prev = useCallback(() => {
		const target = Math.max(1, page - 1)

		if (target !== page) setPage(target)
	}, [setPage, page])

	const setPageSize = useCallback(
		(n: number, resetPage = true) => {
			setPS(n, resetPage)
		},
		[setPS]
	)

	const setParams = useCallback(
		(p: Partial<Omit<EventListParams, "user">>, resetPage = true) => {
			setParamsStore(p as Record<string, unknown>, resetPage)
		},
		[setParamsStore]
	)

	const refresh = useCallback(() => {
		refreshStore()
	}, [refreshStore])

	return { page, page_size, total_pages, loading, goto, next, prev, setPageSize, setParams, refresh }
}
