"use client"
import { PaginationBar } from "@/components/common/pager/PaginationBar"
import { useEventPassive } from "@/hooks/use-event-passive"

export function EventPaginationBar({ maxVisible = 5 }: { maxVisible?: number }) {
	const { page, total_pages, next, prev, goto, loading } = useEventPassive()

	if (!total_pages || total_pages <= 1) return null

	return (
		<PaginationBar
			page={page}
			totalPages={total_pages}
			onGoto={goto}
			onPrev={prev}
			onNext={next}
			maxVisible={maxVisible}
			disabled={loading}
		/>
	)
}
