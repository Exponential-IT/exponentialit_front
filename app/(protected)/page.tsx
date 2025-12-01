"use client"
import Loading from "@/components/loaders/load"
import Filters from "@/components/layout/filters"
import ControlPanel from "@/components/layout/control_panel"
import HistoricalTotals from "@/components/layout/historical_totals"

import { useUserStore } from "@/stores/auth/auth-store"
import { useSession } from "@/hooks/use-session"
import { useEventController } from "@/hooks/use-event-controller"

export default function Home() {
	const { loading: sessLoading } = useSession({ intervalMs: 60_000 })

	const userEmail = useUserStore((s) => s.user_email)
	const isAuthed = useUserStore((s) => s.user_id !== null)

	useEventController({ user: userEmail, intervalMs: 60_000 })

	if (sessLoading) {
		return (
			<div className="w-full min-h-svh flex items-center justify-center">
				<Loading ClassName="p-8" />
			</div>
		)
	}

	if (!isAuthed || !userEmail) {
		return (
			<div className="w-full min-h-svh flex items-center justify-center ">
				<Loading ClassName="p-8" />
			</div>
		)
	}

	return (
		<div className="flex flex-1 flex-col gap-4 p-4">
			<ControlPanel />
			<Filters />
			<HistoricalTotals />
		</div>
	)
}
