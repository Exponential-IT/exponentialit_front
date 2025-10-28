"use client"
import { PaginationBar } from "@/components/common/pager/PaginationBar"
import { useEventPassive } from "@/hooks/use-event-passive"
import { useEffect, useState } from "react"

export function EventPaginationBar() {
	const { page, total_pages, next, prev, goto, loading } = useEventPassive()
	const [maxVisible, setMaxVisible] = useState(5)

	useEffect(() => {
		const updateMaxVisible = () => {
			if (window.innerWidth < 640) {
				setMaxVisible(2)
			} else if (window.innerWidth < 1024) {
				setMaxVisible(4)
			} else {
				setMaxVisible(10)
			}
		}

		updateMaxVisible()

		window.addEventListener("resize", updateMaxVisible)
		return () => window.removeEventListener("resize", updateMaxVisible)
	}, [])

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
