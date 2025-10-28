"use client"
import { useEventStore } from "@/stores/events/event-store"

export function EventsStatusBadge() {
	const loading = useEventStore((s) => s.loading_event)
	const err = useEventStore((s) => s.events_error)
	const ts = useEventStore((s) => s.last_updated)

	if (loading) return <span className="text-xs text-muted-foreground">Actualizando…</span>
	if (err) return <span className="text-xs text-red-600">Error: {err}</span>
	if (ts) return <span className="text-xs text-green-600">Actualizado: {new Date(ts).toLocaleTimeString()}</span>
	return null
}
