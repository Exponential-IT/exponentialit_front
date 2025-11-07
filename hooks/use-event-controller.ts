// hooks/use-event-controller.ts
"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { useEventStore, type EventState } from "@/stores/events/event-store"
import { apiEvent } from "@/lib/api"
import type { EventListParams, EventPageResponse } from "@/types/event"
import { ApiError } from "@/types/error"

const useSel = <T>(sel: (s: EventState) => T) => useEventStore(sel)

type Options = { user: string; intervalMs?: number }

export function useEventController({ user, intervalMs = 60_000 }: Options) {
	const page = useSel((s) => s.page)
	const page_size = useSel((s) => s.page_size)
	const total_pages = useSel((s) => s.total_pages)
	const params = useSel((s) => s.params)

	const setEventData = useSel((s) => s.setEventData)
	const setPage = useSel((s) => s.setPage)
	const setPS = useSel((s) => s.setPageSize)
	const setParamsStore = useSel((s) => s.setParams)
	const setLoadingStore = useSel((s) => s.setLoading)
	const setEventsError = useSel((s) => s.setEventsError)
	const setLastUpdated = useSel((s) => s.setLastUpdated)
	const refreshStore = useSel((s) => s.refresh)

	const [loading, setLoadingLocal] = useState(true)
	const [error, setError] = useState<string | null>(null)

	const inflight = useRef<AbortController | null>(null)
	const timer = useRef<ReturnType<typeof setInterval> | null>(null)
	const doFetchRef = useRef<() => Promise<void>>(async () => {})

	useEffect(() => {
		setParamsStore({ user }, false) // false = no resetear página
	}, [user, setParamsStore])

	const defineFetch = useCallback(() => {
		doFetchRef.current = async () => {
			if (inflight.current) {
				try {
					inflight.current.abort()
				} catch {}
			}
			const ac = new AbortController()
			inflight.current = ac

			try {
				setError(null)
				setEventsError(null)
				setLoadingStore(true)
				setLoadingLocal(true)

				// 🔥 FIX: Filtrar page y page_size de params para evitar que sobrescriban
				// eslint-disable-next-line @typescript-eslint/no-unused-vars
				const { page: _, page_size: __, ...filteredParams } = params

				const payload: EventListParams = {
					user,
					page, // Usar el page del estado de Zustand
					page_size, // Usar el page_size del estado de Zustand
					...filteredParams, // Spread del resto de params (sin page ni page_size)
				}

				const event: EventPageResponse = await apiEvent(payload, { signal: ac.signal })

				const nextPage = Number(event.page)
				const nextPageSize = Number(event.page_size)
				const nextTotalPages = Number(event.total_pages)

				setEventData(
					Number(event.count ?? 0),
					nextPage,
					nextPageSize,
					nextTotalPages,
					event.results ?? [],
					event.next ?? null,
					event.previous ?? null
				)

				setLastUpdated(Date.now())
			} catch (err: unknown) {
				if (!ac.signal.aborted) {
					const apiErr = err as Partial<ApiError> | undefined
					const msg = String(apiErr?.detail ?? "No autorizado o error de red")
					setError(msg)
					setEventsError(msg)
				}
			} finally {
				if (!ac.signal.aborted) {
					setLoadingStore(false)
					setLoadingLocal(false)
					inflight.current = null
				}
			}
		}
	}, [user, page, page_size, params, setEventData, setEventsError, setLastUpdated, setLoadingStore])

	useEffect(() => {
		defineFetch()
	}, [defineFetch])

	useEffect(() => {
		doFetchRef.current()
	}, [page, page_size, params, user])

	useEffect(() => {
		if (intervalMs > 0) {
			timer.current = setInterval(() => {
				doFetchRef.current()
			}, intervalMs)
		}
		return () => {
			if (timer.current) clearInterval(timer.current)
			inflight.current?.abort()
		}
	}, [intervalMs])

	const goto = useCallback(
		(p: number) => {
			const bounded = Math.max(1, total_pages ? Math.min(p, total_pages) : p)
			if (bounded !== page) {
				setLoadingStore(true)
				setLoadingLocal(true)
				setPage(bounded)
			}
		},
		[page, total_pages, setPage, setLoadingStore]
	)

	const next = useCallback(() => {
		const target = total_pages ? Math.min(page + 1, total_pages) : page + 1
		if (target !== page) goto(target)
	}, [goto, page, total_pages])

	const prev = useCallback(() => {
		const target = Math.max(1, page - 1)
		if (target !== page) goto(target)
	}, [goto, page])

	const setPageSize = useCallback(
		(n: number, resetPage = true) => {
			if (n !== page_size) {
				setLoadingStore(true)
				setLoadingLocal(true)
				setPS(n, resetPage)
			}
		},
		[page_size, setPS, setLoadingStore]
	)

	const setParams = useCallback(
		(p: Partial<Omit<EventListParams, "user">>, resetPage = true) => {
			setLoadingStore(true)
			setLoadingLocal(true)
			setParamsStore(p, resetPage)
		},
		[setParamsStore, setLoadingStore]
	)

	const refresh = useCallback(() => {
		setLoadingStore(true)
		setLoadingLocal(true)
		refreshStore()
	}, [refreshStore, setLoadingStore])

	return {
		loading,
		error,
		refresh,
		page,
		page_size,
		total_pages,
		goto,
		next,
		prev,
		setPageSize,
		setParams,
	}
}
