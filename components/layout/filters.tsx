"use client"

import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { Separator } from "@/components/ui/separator"
import { Input } from "@/components/ui/input"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import type { EventListParams } from "@/types/event"
import { useDebouncedCallback } from "@/hooks/use-debounced"
import { useEventPassive } from "@/hooks/use-event-passive"
import { useEventStore } from "@/stores/events/event-store"

export default function Filters() {
	const { setParams, refresh } = useEventPassive()
	const loading = useEventStore((s) => s.loading_event) ?? false

	const [invoiceId, setInvoiceId] = React.useState("")
	const [fileName, setFileName] = React.useState("")
	const [partnerCif, setPartnerCif] = React.useState("")
	const [hasPipelineDone, setHasPipelineDone] = React.useState<"all" | "true" | "false">("all")
	const [dateFrom, setDateFrom] = React.useState<string>("")
	const [dateTo, setDateTo] = React.useState<string>("")

	const pushInvoiceDebounced = useDebouncedCallback((value: string) => {
		const param: Partial<Omit<EventListParams, "user">> = { invoice_id: value || undefined }
		setParams(param, true)
	}, 500)

	React.useEffect(() => {
		pushInvoiceDebounced(invoiceId.trim())
	}, [invoiceId, pushInvoiceDebounced])

	const applyFilters = React.useCallback(() => {
		if ((dateFrom && !dateTo) || (!dateFrom && dateTo)) return
		const payload: Partial<Omit<EventListParams, "user">> = {
			file_name: fileName.trim() || undefined,
			partner_cif: partnerCif.trim() || undefined,
			has_pipeline_done: hasPipelineDone === "all" ? undefined : hasPipelineDone === "true",
			date_from: dateFrom || undefined,
			date_to: dateTo || undefined,
		}
		setParams(payload, true)
	}, [fileName, partnerCif, hasPipelineDone, dateFrom, dateTo, setParams])

	const clearAll = React.useCallback(() => {
		setInvoiceId("")
		setFileName("")
		setPartnerCif("")
		setHasPipelineDone("all")
		setDateFrom("")
		setDateTo("")
		const payload: Partial<Omit<EventListParams, "user">> = {
			invoice_id: undefined,
			file_name: undefined,
			partner_cif: undefined,
			has_pipeline_done: undefined,
			date_from: undefined,
			date_to: undefined,
		}
		setParams(payload, true)
	}, [setParams])

	return (
		<Card>
			<CardHeader>
				<CardTitle>Filtros y Búsqueda</CardTitle>
				<Separator />
			</CardHeader>

			<CardContent className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
				<div className="flex flex-col gap-1">
					<label className="text-sm font-medium">Buscar por Nombre archivo</label>
					<Input
						placeholder="Escribe para buscar..."
						value={invoiceId}
						onChange={(e) => setInvoiceId(e.target.value)}
						disabled={loading}
						autoComplete="off"
					/>
					<span className="text-xs text-muted-foreground">Coincidencia parcial (case-insensitive)</span>
				</div>

				<div className="flex flex-col gap-1">
					<label className="text-sm font-medium">Partner CIF</label>
					<Input
						placeholder="p. ej. B46401329"
						value={partnerCif}
						onChange={(e) => setPartnerCif(e.target.value)}
						disabled={loading}
						autoComplete="off"
					/>
				</div>

				<div className="flex flex-col gap-1">
					<label className="text-sm font-medium">Estado pipeline</label>
					<Select
						value={hasPipelineDone}
						onValueChange={(v) => setHasPipelineDone(v as "all" | "true" | "false")}
						disabled={loading}
					>
						<SelectTrigger>
							<SelectValue placeholder="Todos" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="all">Todos</SelectItem>
							<SelectItem value="true">Solo completados</SelectItem>
							<SelectItem value="false">Solo pendientes</SelectItem>
						</SelectContent>
					</Select>
				</div>

				<div className="flex flex-col gap-1">
					<label className="text-sm font-medium">Fecha desde</label>
					<Input
						type="date"
						value={dateFrom}
						onChange={(e) => setDateFrom(e.target.value)}
						disabled={loading}
					/>
				</div>

				<div className="flex flex-col gap-1">
					<label className="text-sm font-medium">Fecha hasta</label>
					<Input
						type="date"
						value={dateTo}
						onChange={(e) => setDateTo(e.target.value)}
						disabled={loading}
					/>
				</div>

				<div className="col-span-full flex items-center gap-2 pt-2">
					<Button
						onClick={applyFilters}
						disabled={loading}
					>
						Aplicar
					</Button>
					<Button
						variant="outline"
						onClick={clearAll}
						disabled={loading}
					>
						Limpiar
					</Button>
					<Button
						variant="ghost"
						onClick={refresh}
						disabled={loading}
					>
						Refrescar
					</Button>
				</div>
			</CardContent>
		</Card>
	)
}
