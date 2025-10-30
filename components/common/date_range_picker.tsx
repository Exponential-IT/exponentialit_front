// components/common/date_range_picker.tsx
"use client"

import * as React from "react"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { Calendar as CalendarIcon } from "lucide-react"
import { DateRange } from "react-day-picker"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

function toISODateLocal(d: Date) {
	const copy = new Date(d)
	copy.setMinutes(copy.getMinutes() - copy.getTimezoneOffset())
	return copy.toISOString().split("T")[0]
}

interface Props {
	label?: string
	value: DateRange | undefined
	onChange: (range: DateRange | undefined) => void
	disabled?: boolean
	classNameTrigger?: string
	classNamePopover?: string
	numberOfMonths?: 1 | 2
	disableFuture?: boolean
}

export function DateRangePicker({
	label,
	value,
	onChange,
	disabled,
	classNameTrigger,
	classNamePopover,
	numberOfMonths = 1,
	disableFuture = false,
}: Props) {
	const sameYear = value?.from && value?.to && value.from.getFullYear() === value.to.getFullYear()

	const display =
		value?.from && value?.to
			? sameYear
				? `${format(value.from, "dd MMM", { locale: es })} – ${format(value.to, "dd MMM yyyy", { locale: es })}`
				: `${format(value.from, "dd MMM yyyy", { locale: es })} – ${format(value.to, "dd MMM yyyy", {
						locale: es,
				  })}`
			: "Seleccionar rango"

	return (
		<div className="flex flex-col gap-1">
			{label && <label className="text-sm font-medium">{label}</label>}
			<Popover>
				<PopoverTrigger asChild>
					<Button
						variant="outline"
						disabled={disabled}
						className={cn(
							"justify-start text-left font-normal truncate",
							!value?.from && "text-muted-foreground",
							classNameTrigger
						)}
					>
						<CalendarIcon className="mr-2 h-4 w-4" />
						{display}
					</Button>
				</PopoverTrigger>
				<PopoverContent
					className={cn("w-auto p-0", classNamePopover)}
					align="start"
					side="bottom"
				>
					<Calendar
						mode="range"
						selected={value}
						onSelect={onChange}
						numberOfMonths={numberOfMonths}
						disabled={disableFuture ? (d) => d > new Date() : undefined}
						autoFocus
						animate
					/>
				</PopoverContent>
			</Popover>
		</div>
	)
}

export function rangeToISO(range: DateRange | undefined) {
	return {
		from: range?.from ? toISODateLocal(range.from) : "",
		to: range?.to ? toISODateLocal(range.to) : "",
	}
}
