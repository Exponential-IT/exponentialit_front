// components/dialogs/request-errors/BodyErrorItem.tsx
"use client"

import { DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import type { RequestErrorsResponse } from "@/types/error"
import fmt from "@/lib/utils/format"
import { DialogContent } from "@radix-ui/react-dialog"

type Props = {
	data: RequestErrorsResponse
	requestId?: string | null
	finished?: boolean
}

export default function BodyErrorItem({ data, requestId, finished }: Props) {
	const e = data.error!
	const headerRequestId = requestId ?? data.request_id ?? "—"
	const headerFinished = finished ?? data.has_pipeline_done

	return (
		<>
			<DialogHeader>
				<DialogTitle>{headerRequestId}</DialogTitle>
				<DialogDescription>
					{headerFinished ? (
						<Badge variant="secondary">Terminado</Badge>
					) : (
						<Badge variant="destructive">Incompleto</Badge>
					)}
				</DialogDescription>
			</DialogHeader>
			<DialogContent className="truncate">
				<div className="p-3 space-y-2 text-sm">
					<div className="flex flex-col">
						<div>
							<span className="font-semibold">Paso:</span> {e.step ?? "—"}
						</div>
						<div>
							<span className="font-semibold">Fecha:</span> {fmt(e.ts)}
						</div>
					</div>

					<div className="text-xs">
						<span className="font-semibold">Error:</span>
						<pre className="mt-1 overflow-auto rounded bg-muted p-2">
							{JSON.stringify(e.error, null, 2)}
						</pre>
					</div>
				</div>
			</DialogContent>
		</>
	)
}
