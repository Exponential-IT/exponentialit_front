"use client"

import React from "react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { EventsTable } from "../common/tables/event_table"
import { EventPaginationBar } from "../event/EventPaginationBar"
import { EventsStatusBadge } from "../event/EventsStatusBadge"
import { EventResponse } from "@/types/event"
import { useRequestErrors } from "@/hooks/use-request-errors"
import RequestErrorsDialog from "../dialogs/RequestErrorsDialog"

export default function HistoricalTotals() {
	const [open, setOpen] = React.useState(false)
	const [selectedRequestId, setSelectedRequestId] = React.useState<string | null>(null)

	const { data, loading, error } = useRequestErrors(selectedRequestId, open)

	const handleRowClick = (event: EventResponse) => {
		if (event?.request_id) {
			setSelectedRequestId(event.request_id)
			setOpen(true)
		}
	}

	const handleOpenChange = (v: boolean) => {
		setOpen(v)
		if (!v) setSelectedRequestId(null)
	}

	return (
		<>
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

			<RequestErrorsDialog
				open={open}
				onOpenChange={handleOpenChange}
				data={data}
				loading={loading}
				errorMsg={error}
			/>
		</>
	)
}
