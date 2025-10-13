// components/EventPager.tsx
"use client"

import { useEvent } from "@/hooks/use-event"

export default function EventPager() {
	const { loading, error, page, page_size, total_pages, next, prev, goto, setPageSize } = useEvent({
		intervalMs: 60_000,
	})

	if (error) console.log(error)

	return (
		<div className="flex items-center gap-3">
			<button
				onClick={prev}
				disabled={loading || page <= 1}
			>
				← Anterior
			</button>

			<span>
				Página {page} de {total_pages || 1}
			</span>

			<button
				onClick={next}
				disabled={loading || (total_pages ? page >= total_pages : false)}
			>
				Siguiente →
			</button>

			<select
				value={page_size}
				onChange={(e) => setPageSize(Number(e.target.value))}
				disabled={loading}
			>
				{[5, 10, 20, 50].map((n) => (
					<option
						key={n}
						value={n}
					>
						{n} por página
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
