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
		<Table className="select-none ">
			<TableCaption>Eventos en Exponentialit</TableCaption>
			<TableHeader>
				<TableRow>
					<TableHead className="max-w-[100px] truncate">Proveedor</TableHead>
					<TableHead className="max-w-[100px] truncate">Cuenta</TableHead>
					<TableHead className="max-w-[100px] truncate">Nombre archivo</TableHead>
					<TableHead>Fecha</TableHead>
					<TableHead>Estado</TableHead>
				</TableRow>
			</TableHeader>
			<TableBody>
				{results.map((event) => (
					<TableRow
						key={event.request_id}
						onClick={() => handleClick(event)}
					>
						<TableCell className="font-medium max-w-[100px] truncate">{event.partner_name}</TableCell>
						<TableCell className="max-w-[100px] truncate">{event.client_name}</TableCell>
						<TableCell className="max-w-[100px] truncate">{event.file_name}</TableCell>
						<TableCell>{event.date}</TableCell>
						<TableCell>{event.has_pipeline_done ? "🟢 Completado" : "🔴 Fallido"}</TableCell>
					</TableRow>
				))}
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
