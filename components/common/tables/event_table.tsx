"use client"

import {
	Table,
	TableBody,
	TableCaption,
	TableCell,
	TableFooter,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table"
import { useEventStore } from "@/stores/events/event-store"
import { EventResponse } from "@/types/event"
import { useCallback } from "react"

interface EventsTableProps {
	onRowClick?: (event: EventResponse) => void
}

export function EventsTable({ onRowClick }: EventsTableProps) {
	const { results } = useEventStore()

	const handleClick = useCallback(
		(eventData: EventResponse) => {
			if (onRowClick) onRowClick(eventData)
		},
		[onRowClick]
	)

	return (
		<Table className="select-none">
			<TableCaption>Eventos en Exponentialit</TableCaption>

			<TableHeader>
				<TableRow>
					<TableHead className="max-w-[140px] truncate">Proveedor</TableHead>
					<TableHead className="max-w-[140px] truncate">Cuenta</TableHead>
					<TableHead className="max-w-[200px] truncate">Nombre archivo</TableHead>
					<TableHead>Fecha</TableHead>
					<TableHead>Estado</TableHead>
				</TableRow>
			</TableHeader>

			<TableBody>
				{results.length === 0 ? (
					<TableRow>
						<TableCell
							colSpan={5}
							className="text-center text-sm text-muted-foreground"
						>
							No hay eventos para mostrar.
						</TableCell>
					</TableRow>
				) : (
					results.map((event) => (
						<TableRow
							key={event.request_id}
							onClick={() => handleClick(event)}
							className="cursor-pointer hover:bg-muted/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
							role="button"
							tabIndex={0}
							aria-label={`Ver detalle del request ${event.request_id ?? ""}`}
							onKeyDown={(e) => {
								if (e.key === "Enter" || e.key === " ") handleClick(event)
							}}
						>
							<TableCell
								className="font-medium max-w-[140px] truncate"
								title={event.partner_name ?? ""}
							>
								{event.partner_name ?? "—"}
							</TableCell>

							<TableCell
								className="max-w-[140px] truncate"
								title={event.client_name ?? ""}
							>
								{event.client_name ?? "—"}
							</TableCell>

							<TableCell
								className="max-w-[200px] truncate"
								title={event.file_name ?? ""}
							>
								{event.file_name ?? "—"}
							</TableCell>

							<TableCell>{event.date ?? "—"}</TableCell>

							<TableCell>{event.has_pipeline_done ? "🟢 Completado" : "🔴 Fallido"}</TableCell>
						</TableRow>
					))
				)}
			</TableBody>

			<TableFooter>
				<TableRow>
					<TableCell colSpan={4}>Filas</TableCell>
					<TableCell className="text-right">{results.length}</TableCell>
				</TableRow>
			</TableFooter>
		</Table>
	)
}
