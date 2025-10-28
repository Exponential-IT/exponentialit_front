"use client"

import * as React from "react"
import {
	Pagination,
	PaginationContent,
	PaginationItem,
	PaginationLink,
	PaginationPrevious,
	PaginationNext,
	PaginationEllipsis,
} from "@/components/ui/pagination"

type PaginationBarProps = {
	page: number
	totalPages: number
	onGoto: (page: number) => void
	onPrev?: () => void
	onNext?: () => void
	disabled?: boolean
	maxVisible?: number
}

function getPageWindow(page: number, total: number, maxVisible: number): number[] {
	if (total <= 0) return [1]
	if (total <= maxVisible) return Array.from({ length: total }, (_, i) => i + 1)
	const half = Math.floor(maxVisible / 2)
	let start = Math.max(1, page - half)
	let end = start + maxVisible - 1
	if (end > total) {
		end = total
		start = Math.max(1, end - maxVisible + 1)
	}
	return Array.from({ length: end - start + 1 }, (_, i) => start + i)
}

export function PaginationBar({
	page,
	totalPages,
	onGoto,
	onPrev,
	onNext,
	disabled = false,
	maxVisible = 5,
}: PaginationBarProps) {
	const pages = React.useMemo(() => getPageWindow(page, totalPages, maxVisible), [page, totalPages, maxVisible])

	const showLeftEllipsis = pages[0] > 2
	const showRightEllipsis = pages[pages.length - 1] < totalPages - 1
	const showFirst = pages[0] !== 1
	const showLast = pages[pages.length - 1] !== totalPages

	const atFirst = page <= 1
	const atLast = totalPages ? page >= totalPages : true

	return (
		<Pagination>
			<PaginationContent className="flex-nowrap overflow-hidden">
				<PaginationItem>
					<PaginationPrevious
						href="#"
						aria-disabled={disabled || atFirst}
						onClick={(e) => {
							e.preventDefault()
							if (!disabled && !atFirst) onPrev?.()
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
								onGoto(1)
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
							aria-disabled={disabled}
							onClick={(e) => {
								e.preventDefault()
								if (!disabled) onGoto(p)
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
							isActive={page === totalPages}
							onClick={(e) => {
								e.preventDefault()
								onGoto(totalPages)
							}}
						>
							{totalPages}
						</PaginationLink>
					</PaginationItem>
				)}

				<PaginationItem>
					<PaginationNext
						href="#"
						aria-disabled={disabled || atLast}
						onClick={(e) => {
							e.preventDefault()
							if (!disabled && !atLast) onNext?.()
						}}
					/>
				</PaginationItem>
			</PaginationContent>
		</Pagination>
	)
}
