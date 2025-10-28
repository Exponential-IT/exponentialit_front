"use client"

import { useSession } from "@/hooks/use-session"
import { useUserStore } from "@/stores/auth/auth-store"
import Header from "@/components/layout/header"
import Footer from "@/components/layout/footer"
import ControlPanel from "@/components/layout/control_panel"
import HistoricalTotals from "@/components/layout/historical_totals"
import Filters from "@/components/layout/filters"
import Loading from "@/components/loaders/load"
import ErrorCommon from "@/components/common/error"
import { useEventController } from "@/hooks/use-event-controller"

export default function Home() {
	const { loading: sessLoading, error: sessError } = useSession({ intervalMs: 60_000 })

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

	if (sessError) {
		return (
			<div className="min-h-svh flex items-center justify-center">
				<ErrorCommon error={sessError} />
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
		<div className="bg-muted flex min-h-svh flex-col gap-4">
			<Header />
			<main className="w-full flex flex-col gap-4 p-2 md:px-6 xl:px-10">
				<ControlPanel />
				<Filters />
				<HistoricalTotals />
			</main>
			<Footer />
		</div>
	)
}
