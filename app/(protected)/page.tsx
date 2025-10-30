"use client"

import { useSession } from "@/hooks/use-session"
import { useUserStore } from "@/stores/auth/auth-store"
import Header from "@/components/layout/header"
import ControlPanel from "@/components/layout/control_panel"
import HistoricalTotals from "@/components/layout/historical_totals"
import Filters from "@/components/layout/filters"
import Loading from "@/components/loaders/load"
import { useEventController } from "@/hooks/use-event-controller"
import Footer from "@/components/layout/footer"

export default function Home() {
	const { loading: sessLoading } = useSession({ intervalMs: 60_000 })

	const userEmail = useUserStore((s) => s.user_email)
	const isAuthed = useUserStore((s) => s.user_id !== null)

	useEventController({ user: userEmail, intervalMs: 60_000 })

	if (sessLoading) {
		return (
			<div className="min-h-svh flex items-center justify-center">
				<Loading ClassName="p-8" />
			</div>
		)
	}

	if (!isAuthed || !userEmail) {
		return (
			<div className="min-h-svh flex items-center justify-center">
				<Loading ClassName="p-8" />
			</div>
		)
	}

	return (
		<div className="flex flex-col min-h-svh gap-4 pt-2">
			<Header />
			<main className="flex flex-col gap-4 px-2 sm:px-3 md:px-4">
				<ControlPanel />
				<Filters />
				<HistoricalTotals />
			</main>
			<Footer />
		</div>
	)
}
