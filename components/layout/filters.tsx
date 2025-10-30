"use client"

import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem, SelectGroup } from "@/components/ui/select"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { ChevronDown } from "lucide-react"

import type { EventListParams } from "@/types/event"
import { useDebouncedCallback } from "@/hooks/use-debounced"
import { useEventPassive } from "@/hooks/use-event-passive"
import { useEventStore } from "@/stores/events/event-store"
import { useUserStore } from "@/stores/auth/auth-store"

import { DateRange } from "react-day-picker"
import { DateRangePicker, rangeToISO } from "../common/date_range_picker"
import { Account } from "@/types/auth"

export default function Filters() {
	const accounts = useUserStore((s) => s.accounts)

	const { setParams, refresh } = useEventPassive()
	const loading = useEventStore((s) => s.loading_event) ?? false

	const [isOpen, setIsOpen] = React.useState(false)

	// Filtros activos
	const [fileName, setFileName] = React.useState("")
	const [supplierName, setSupplierName] = React.useState("")
	const [hasPipelineDone, setHasPipelineDone] = React.useState<"all" | "true" | "false">("all")
	const [selectedAccountTaxId, setSelectedAccountTaxId] = React.useState<string | "all">("all")
	const [dateFrom, setDateFrom] = React.useState<string>("")
	const [dateTo, setDateTo] = React.useState<string>("")

	// Normaliza shapes distintos de account
	function normAccount(acc: Account) {
		return {
			id: acc.account_id ?? acc.id,
			name: acc.account_name ?? acc.name,
			taxId: acc.account_tax_id ?? acc.tax_id,
		}
	}

	// Rango de fechas (inicia “hasta hoy”)
	const [range, setRange] = React.useState<DateRange | undefined>(() => {
		const today = new Date()
		return {
			from: dateFrom ? new Date(dateFrom) : undefined,
			to: dateTo ? new Date(dateTo) : today,
		}
	})

	const handleRange = (r: DateRange | undefined) => {
		setRange(r)
		const { from, to } = rangeToISO(r)
		setDateFrom(from)
		setDateTo(to)
	}

	// Contador de filtros activos
	const activeFiltersCount = React.useMemo(() => {
		let count = 0
		if (fileName.trim()) count++
		if (supplierName.trim()) count++
		if (hasPipelineDone !== "all") count++
		if (selectedAccountTaxId !== "all") count++
		if (dateFrom || dateTo) count++
		return count
	}, [fileName, supplierName, hasPipelineDone, selectedAccountTaxId, dateFrom, dateTo])

	// Debounce para Supplier
	const pushSupplierDebounced = useDebouncedCallback((value: string) => {
		const param: Partial<Omit<EventListParams, "user">> = { partner_name: value || undefined }
		setParams(param, true)
	}, 800)

	React.useEffect(() => {
		pushSupplierDebounced(supplierName.trim())
	}, [supplierName, pushSupplierDebounced])

	// Debounce para FileName
	const pushFileNameDebounced = useDebouncedCallback((value: string) => {
		const param: Partial<Omit<EventListParams, "user">> = { file_name: value || undefined }
		setParams(param, true)
	}, 800)

	React.useEffect(() => {
		pushFileNameDebounced(fileName.trim())
	}, [fileName, pushFileNameDebounced])

	const applyFilters = React.useCallback(() => {
		if ((dateFrom && !dateTo) || (!dateFrom && dateTo)) return
		const payload: Partial<Omit<EventListParams, "user">> = {
			has_pipeline_done: hasPipelineDone === "all" ? undefined : hasPipelineDone === "true",
			date_from: dateFrom || undefined,
			date_to: dateTo || undefined,
			client_cif: selectedAccountTaxId !== "all" ? selectedAccountTaxId : undefined,
		}
		setParams(payload, true)
		setIsOpen(false)
	}, [hasPipelineDone, dateFrom, dateTo, selectedAccountTaxId, setParams])

	const clearAll = React.useCallback(() => {
		setFileName("")
		setSupplierName("")
		setHasPipelineDone("all")
		setSelectedAccountTaxId("all")
		setDateFrom("")
		setDateTo("")
		setRange(undefined)

		const payload: Partial<Omit<EventListParams, "user">> = {
			file_name: undefined,
			has_pipeline_done: undefined,
			client_cif: undefined,
			date_from: undefined,
			date_to: undefined,
			invoice_id: undefined,
		}
		setParams(payload, true)
		setIsOpen(false)
	}, [setParams])

	return (
		<Collapsible
			open={isOpen}
			onOpenChange={setIsOpen}
		>
			<Card>
				<CardHeader>
					<CollapsibleTrigger asChild>
						<button
							type="button"
							aria-expanded={isOpen}
							className="w-full flex items-center justify-between cursor-pointer select-none rounded-md p-2 hover:bg-muted/60"
						>
							<CardTitle className="flex items-center justify-between w-full">
								<span>Filtros y Búsqueda</span>
								<div className="flex items-center gap-2">
									{activeFiltersCount > 0 && (
										<Badge variant="secondary">
											{activeFiltersCount}{" "}
											{activeFiltersCount === 1 ? "filtro activo" : "filtros activos"}
										</Badge>
									)}
									<ChevronDown className="h-4 w-4 transition-transform duration-200 data-[state=open]:rotate-180" />
								</div>
							</CardTitle>
							<span className="sr-only">Alternar filtros</span>
						</button>
					</CollapsibleTrigger>
					<Separator />
				</CardHeader>

				<CardContent>
					<CollapsibleContent className="space-y-4 pt-2">
						{/* Grid responsiva */}
						<div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
							{/* Nombre de archivo */}
							<div className="flex flex-col gap-1">
								<label className="text-sm font-medium">Nombre de archivo</label>
								<Input
									placeholder="p.ej. 30102025_exponen.pdf"
									value={fileName}
									onChange={(e) => setFileName(e.target.value)}
									disabled={loading}
									autoComplete="off"
								/>
								<span className="text-xs text-muted-foreground">
									Coincidencia parcial (case-insensitive)
								</span>
							</div>

							{/* Proveedor */}
							<div className="flex flex-col gap-1">
								<label className="text-sm font-medium">Proveedor</label>
								<Input
									placeholder="p.ej. Exponen…"
									value={supplierName}
									onChange={(e) => setSupplierName(e.target.value)}
									disabled={loading}
									autoComplete="off"
								/>
								<span className="text-xs text-muted-foreground">
									Coincidencia parcial (case-insensitive)
								</span>
							</div>

							{/* Estado */}
							<div className="flex flex-col gap-1">
								<label className="text-sm font-medium">Estado</label>
								<Select
									value={hasPipelineDone}
									onValueChange={(v) => setHasPipelineDone(v as "all" | "true" | "false")}
									disabled={loading}
								>
									<SelectTrigger className="w-full">
										<SelectValue placeholder="Todos" />
									</SelectTrigger>
									<SelectContent>
										<SelectGroup>
											<SelectItem value="all">Todos</SelectItem>
											<SelectItem value="true">Completados</SelectItem>
											<SelectItem value="false">Fallidos</SelectItem>
										</SelectGroup>
									</SelectContent>
								</Select>
							</div>

							{/* Cuenta (muestra name, envía tax_id) */}
							<div className="flex flex-col gap-1">
								<label className="text-sm font-medium">Cuenta</label>
								<Select
									value={selectedAccountTaxId ?? "all"}
									onValueChange={(v) => setSelectedAccountTaxId(v || "all")}
									disabled={loading}
								>
									<SelectTrigger className="w-full">
										<SelectValue placeholder="Todas" />
									</SelectTrigger>
									<SelectContent>
										<SelectGroup>
											<SelectItem
												key="all"
												value="all"
											>
												Todas
											</SelectItem>
											{accounts?.map((raw: Account) => {
												const acc = normAccount(raw)
												if (!acc.taxId) return null
												return (
													<SelectItem
														key={`${acc.id}-${acc.taxId}`}
														value={String(acc.taxId)}
													>
														{acc.name ?? String(acc.taxId)}
													</SelectItem>
												)
											})}
										</SelectGroup>
									</SelectContent>
								</Select>
							</div>

							{/* Rango de fechas */}
							<div className="flex flex-col gap-1 md:col-span-2 xl:col-span-3">
								<DateRangePicker
									label="Rango de fechas"
									value={range}
									onChange={handleRange}
									disabled={loading}
									classNamePopover="z-50"
									classNameTrigger="max-w-md"
									numberOfMonths={1}
									disableFuture
								/>
							</div>
						</div>

						<div className="flex items-center gap-2 pt-4 border-t">
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
					</CollapsibleContent>
				</CardContent>
			</Card>
		</Collapsible>
	)
}
