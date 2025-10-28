import React from "react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { EventsTable } from "../common/tables/event_table"
import { EventPaginationBar } from "../event/EventPaginationBar"
import { EventsStatusBadge } from "../event/EventsStatusBadge"

export default function HistoricalTotals() {
	return (
		<Card>
			<CardHeader className="flex flex-row items-center justify-between">
				<CardTitle>Historial de Facturas</CardTitle>
				<EventsStatusBadge />
			</CardHeader>

			<CardContent>
				<EventsTable />
			</CardContent>

			<CardFooter>
				<EventPaginationBar />
			</CardFooter>
		</Card>
	)
}
