// hooks/use-event.ts
"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { apiEvent } from "@/lib/api"
import { useEventStore, type EventState } from "@/stores/events/event-store"

type UseEventOptions = { intervalMs?: number }

// Lee cada campo con selector simple (evita objetos nuevos y equalityFn)
const useSel = <T>(sel: (s: EventState) => T) => useEventStore(sel)

export function useEvent({ intervalMs = 60_000 }: UseEventOptions = {}) {
	// ---- Estado global (selectores individuales, sin shallow) ----
	const page = useSel((s) => s.page)
	const page_size = useSel((s) => s.page_size)
	const total_pages = useSel((s) => s.total_pages)
	const params = useSel((s) => s.params)

	const setEventData = useSel((s) => s.setEventData)
	const setPage = useSel((s) => s.setPage)
	const setPS = useSel((s) => s.setPageSize)
	const setParams = useSel((s) => s.setParams)

	// ---- Estado local ----
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)

	// ---- Refs para abortar y para tener una función de fetch estable ----
	const inflight = useRef<AbortController | null>(null)
	const timer = useRef<ReturnType<typeof setInterval> | null>(null)
	const doFetchRef = useRef<() => Promise<void>>(async () => {}) // se setea más abajo

	// ---- Definimos la función de fetch con dependencias capturadas y la guardamos en ref ----
	const defineFetch = useCallback(() => {
		doFetchRef.current = async () => {
			// Cancela petición anterior
			if (inflight.current) {
				try {
					inflight.current.abort()
				} catch {}
			}
			const ac = new AbortController()
			inflight.current = ac

			try {
				setError(null)
				const payload = { page, page_size, ...params }
				const event = await apiEvent(payload, { signal: ac.signal })

				// Normaliza a números (por si el backend manda strings)
				const nextPage = Number(event.page)
				const nextPageSize = Number(event.page_size)
				const nextTotalPages = Number(event.total_pages)

				// Evita escribir si no hay cambios relevantes
				const shouldUpdate =
					nextPage !== page ||
					nextPageSize !== page_size ||
					nextTotalPages !== total_pages ||
					event.next !== useEventStore.getState().next ||
					event.previous !== useEventStore.getState().previous ||
					// results puede ser grande; si necesitas evitar renders,
					// podrías comparar lengths o un request_id de página
					true

				if (shouldUpdate) {
					setEventData(
						event.count,
						nextPage,
						nextPageSize,
						nextTotalPages,
						event.results,
						event.next ?? null,
						event.previous ?? null
					)
				}
			} catch {
				if (!ac.signal.aborted) setError("No autorizado")
			} finally {
				if (!ac.signal.aborted) {
					setLoading(false)
					inflight.current = null
				}
			}
		}
	}, [page, page_size, total_pages, params, setEventData])

	// Actualiza la ref de fetch cuando cambien dependencias
	useEffect(() => {
		defineFetch()
	}, [defineFetch])

	// Primer fetch y cada vez que cambien paginación/filtros
	useEffect(() => {
		doFetchRef.current()
		// deps explícitas a lo que dispara el cambio, NO a la identidad de una función
	}, [page, page_size, params])

	// Polling solo depende de intervalMs; usa la ref estable
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

	// ---- Acciones de paginación ----
	const goto = useCallback(
		(p: number) => {
			const bounded = Math.max(1, total_pages ? Math.min(p, total_pages) : p)
			if (bounded !== page) {
				setLoading(true)
				setPage(bounded) // disparará fetch por efecto [page,...]
			}
		},
		[page, total_pages, setPage]
	)

	const next = useCallback(() => goto(page + 1), [goto, page])
	const prev = useCallback(() => goto(page - 1), [goto, page])

	const setPageSize = useCallback(
		(n: number) => {
			if (n !== page_size) {
				setLoading(true)
				setPS(n) // tu store debe resetear page=1; disparará fetch
			}
		},
		[page_size, setPS]
	)

	const updateParams = useCallback(
		(p: Record<string, unknown>) => {
			setLoading(true)
			setParams(p) // tu store resetea page=1; disparará fetch
		},
		[setParams]
	)

	return {
		loading,
		error,
		refresh: () => doFetchRef.current(),
		page,
		page_size,
		total_pages,
		goto,
		next,
		prev,
		setPageSize,
		setParams: updateParams,
	}
}
