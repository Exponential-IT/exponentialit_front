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
import { Trash2Icon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useUserStore } from "@/stores/auth/auth-store"

interface EventsTableProps {
	onRowClick?: (event: EventResponse) => void
	onRowDelete?: (event: EventResponse) => void
}

export function EventsTable({ onRowClick, onRowDelete }: EventsTableProps) {
	const { results } = useEventStore()
	const userEmail = useUserStore((s) => s.user_email)

	const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL ?? "jacob.ruiz@exponentialit.net"
	const isAdmin = userEmail === adminEmail

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
					{isAdmin && <TableHead>Remover</TableHead>}
				</TableRow>
			</TableHeader>

			<TableBody>
				{results.length === 0 ? (
					<TableRow>
						<TableCell
							colSpan={isAdmin ? 6 : 5}
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

							{isAdmin && (
								<TableCell>
									<Button
										variant="ghost"
										size="icon"
										aria-label={`Eliminar request ${event.request_id ?? ""}`}
										onClick={(e) => {
											e.stopPropagation()
											e.preventDefault()
											if (onRowDelete) onRowDelete(event)
										}}
									>
										<Trash2Icon className="w-4 h-4" />
									</Button>
								</TableCell>
							)}
						</TableRow>
					))
				)}
			</TableBody>

			<TableFooter>
				<TableRow>
					<TableCell colSpan={isAdmin ? 5 : 4}>Filas</TableCell>
					<TableCell className="text-right">{results.length}</TableCell>
				</TableRow>
			</TableFooter>
		</Table>
	)
}
