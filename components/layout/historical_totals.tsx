"use client"

import React from "react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { EventsTable } from "../common/tables/event_table"
import { EventPaginationBar } from "../event/EventPaginationBar"
import { EventsStatusBadge } from "../event/EventsStatusBadge"
import { EventResponse } from "@/types/event"
import { useRequestErrors } from "@/hooks/use-request-errors"
import RequestErrorsDialog from "../dialogs/RequestErrorsDialog"
import { useRequestDelete } from "@/hooks/use-request-delete"
import { useEventPassive } from "@/hooks/use-event-passive"
import { toast } from "sonner"

export default function HistoricalTotals() {
	const [open, setOpen] = React.useState(false)
	const [selectedRequestId, setSelectedRequestId] = React.useState<string | null>(null)
	const [selectedDeleteId, setSelectedDeleteId] = React.useState<string | null>(null)

	const { data, loading, error } = useRequestErrors(selectedRequestId, open)
	const { refresh } = useEventPassive()

	const { delete_data, delete_error } = useRequestDelete(selectedDeleteId)

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

	const handleRowDelete = (event: EventResponse) => {
		if (!event?.request_id) return

		toast("¿Eliminar evento?", {
			position: "top-center",
			classNames: {
				actionButton: "!bg-chart-green !text-chart-green-foreground ",
				cancelButton: "!text-destructive ",
			},
			action: {
				label: "Eliminar",
				onClick: () => {
					setSelectedDeleteId(event.request_id)
				},
			},
			cancel: {
				label: "Cancelar",
				onClick: () => {},
			},
		})
	}

	React.useEffect(() => {
		if (!delete_data) return

		refresh()
		setSelectedDeleteId(null)

		toast.success("Evento eliminado correctamente", {
			position: "top-center",
		})
	}, [delete_data, refresh])

	React.useEffect(() => {
		if (!delete_error) return

		toast.error(delete_error, { position: "top-center" })
		setSelectedDeleteId(null)
	}, [delete_error])

	return (
		<>
			<Card>
				<CardHeader className="flex flex-row items-center justify-between ">
					<CardTitle>Historial de Facturas</CardTitle>
					<EventsStatusBadge />
				</CardHeader>

				<CardContent>
					<EventsTable
						onRowClick={handleRowClick}
						onRowDelete={handleRowDelete}
					/>
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
