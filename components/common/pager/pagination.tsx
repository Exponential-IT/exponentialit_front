import React from "react"
import { useEvent } from "@/hooks/use-event"

export default function Pager() {
	const {
		page,
		page_size,
		total_pages,
		next,
		prev,
		goto,
		setPageSize,
		loading: loadingEvents,
	} = useEvent({ intervalMs: 60_000 })

	return (
		<div className="flex items-center gap-3">
			<button
				onClick={prev}
				disabled={loadingEvents || page <= 1}
			>
				← Anterior
			</button>
			<span>
				{" "}
				Página {page} de {total_pages || 1}{" "}
			</span>
			<button
				onClick={next}
				disabled={loadingEvents || (total_pages ? page >= total_pages : false)}
			>
				Siguiente →
			</button>

			<select
				value={page_size}
				onChange={(e) => setPageSize(Number(e.target.value))}
				disabled={loadingEvents}
			>
				{[5, 10, 20, 50].map((n) => (
					<option
						key={n}
						value={n}
					>
						{n} / pág.
					</option>
				))}
			</select>

			<input
				type="number"
				min={1}
				max={total_pages || 1}
				defaultValue={page}
				onKeyDown={(e) => {
					if (e.key === "Enter") {
						const v = Number((e.target as HTMLInputElement).value)
						if (!Number.isNaN(v)) goto(v)
					}
				}}
				className="w-20"
			/>
		</div>
	)
}
