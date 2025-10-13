import React from "react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

import { EventsTable } from "../common/tables/event_table"
import { PaginationResponsive } from "../common/pager/preview"

export default function HistoricalTotals() {
	return (
		<Card>
			<CardHeader className="flex flex-row items-center justify-between">
				<div>
					<CardTitle>Historial de Facturas</CardTitle>
				</div>
			</CardHeader>
			<CardContent>
				<EventsTable />
			</CardContent>
			<CardFooter>
				<PaginationResponsive />
			</CardFooter>
		</Card>
	)
}
