import React from "react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { EventsTable } from "../common/tables/event_table"
import { EventPaginationBar } from "../event/EventPaginationBar"
import { EventsStatusBadge } from "../event/EventsStatusBadge"
import { EventResponse } from "@/types/event"

export default function HistoricalTotals() {
	const handleRowClick = (event: EventResponse) => {
		// console.log("Evento seleccionado:", event)
		// Ejemplo: abrir modal o navegar
		// router.push(`/events/${event.request_id}`)
	}
	return (
		<Card>
			<CardHeader className="flex flex-row items-center justify-between">
				<CardTitle>Historial de Facturas</CardTitle>
				<EventsStatusBadge />
			</CardHeader>

			<CardContent>
				<EventsTable onRowClick={handleRowClick} />
			</CardContent>

			<CardFooter>
				<EventPaginationBar />
			</CardFooter>
		</Card>
	)
}
