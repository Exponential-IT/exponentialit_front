import {
	Pagination,
	PaginationContent,
	PaginationEllipsis,
	PaginationItem,
	PaginationLink,
	PaginationNext,
	PaginationPrevious,
} from "@/components/ui/pagination"
import { useEffect, useMemo, useRef, useState } from "react"
import { useEvent } from "@/hooks/use-event"

function getPageWindow(page: number, total: number, maxVisible: number) {
	if (total <= maxVisible) {
		return Array.from({ length: total }, (_, i) => i + 1)
	}
	// ventana centrada en la página actual
	const half = Math.floor(maxVisible / 2)
	let start = Math.max(1, page - half)
	let end = start + maxVisible - 1
	if (end > total) {
		end = total
		start = Math.max(1, end - maxVisible + 1)
	}
	return Array.from({ length: end - start + 1 }, (_, i) => start + i)
}

export function PaginationResponsive() {
	const { page, total_pages, next, prev, goto, loading: loadingEvents } = useEvent({ intervalMs: 60_000 })

	const containerRef = useRef<HTMLDivElement>(null)
	const [maxVisible, setMaxVisible] = useState(3)

	// Observa el ancho del contenedor y estima cuántos botones caben
	useEffect(() => {
		const el = containerRef.current
		if (!el) return

		const ro = new ResizeObserver(([entry]) => {
			const w = entry.contentRect.width

			// Estimaciones (px) — ajusta si tus botones son más anchos:
			const btnWidth = 44 // ancho aprox. de un <PaginationLink>
			const sideControls = 44 * 2 // prev + next
			const ellipsisReserve = 44 * 2 // posible "…" a ambos lados
			const padding = 16 // margen interno

			const available = Math.max(0, w - sideControls - ellipsisReserve - padding)
			const estimate = Math.floor(available / btnWidth)

			// Reglas: mínimo 3, máximo total_pages
			const computed = Math.min(total_pages || 0, Math.max(3, estimate))
			setMaxVisible(computed)
		})

		ro.observe(el)
		return () => ro.disconnect()
	}, [total_pages])

	const pages = useMemo(() => getPageWindow(page, total_pages, maxVisible), [page, total_pages, maxVisible])

	const showLeftEllipsis = pages[0] > 2
	const showRightEllipsis = pages[pages.length - 1] < total_pages - 1
	const showFirst = pages[0] !== 1
	const showLast = pages[pages.length - 1] !== total_pages

	return (
		<Pagination>
			<PaginationContent className="flex-nowrap overflow-hidden">
				<PaginationItem>
					<PaginationPrevious
						href="#"
						onClick={(e) => {
							e.preventDefault()
							if (!loadingEvents) prev()
						}}
					/>
				</PaginationItem>

				{showFirst && (
					<PaginationItem>
						<PaginationLink
							href="#"
							isActive={page === 1}
							onClick={(e) => {
								e.preventDefault()
								goto(1)
							}}
						>
							1
						</PaginationLink>
					</PaginationItem>
				)}

				{showLeftEllipsis && (
					<PaginationItem>
						<PaginationEllipsis />
					</PaginationItem>
				)}

				{pages.map((p) => (
					<PaginationItem key={p}>
						<PaginationLink
							href="#"
							isActive={page === p}
							onClick={(e) => {
								e.preventDefault()
								goto(p)
							}}
						>
							{p}
						</PaginationLink>
					</PaginationItem>
				))}

				{showRightEllipsis && (
					<PaginationItem>
						<PaginationEllipsis />
					</PaginationItem>
				)}

				{showLast && (
					<PaginationItem>
						<PaginationLink
							href="#"
							isActive={page === total_pages}
							onClick={(e) => {
								e.preventDefault()
								goto(total_pages)
							}}
						>
							{total_pages}
						</PaginationLink>
					</PaginationItem>
				)}

				<PaginationItem>
					<PaginationNext
						href="#"
						onClick={(e) => {
							e.preventDefault()
							if (!loadingEvents) next()
						}}
					/>
				</PaginationItem>
			</PaginationContent>
		</Pagination>
	)
}
