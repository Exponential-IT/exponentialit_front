// app/(protected)/page.tsx
"use client"

import { useSession } from "@/hooks/use-session"
import Footer from "@/components/layout/footer"
import Header from "@/components/layout/header"
import ControlPanel from "@/components/layout/control_panel"
import Loading from "@/components/loaders/load"
import ErrorCommon from "@/components/common/error"
import HistoricalTotals from "@/components/layout/historical_totals"
import Filters from "@/components/layout/filters"

export default function Home() {
	const { loading, error } = useSession({ intervalMs: 60_000 })

	if (loading)
		return (
			<div className="bg-muted flex min-h-svh flex-col items-center justify-between">
				<Loading ClassName="p-8" />
			</div>
		)

	if (error)
		return (
			<div className="bg-muted flex min-h-svh flex-col items-center justify-between">
				<ErrorCommon error={error} />
			</div>
		)

	return (
		<div className="bg-muted flex min-h-svh flex-col items-center justify-between gap-4">
			<Header />
			<div className="w-full flex flex-col gap-4 p-2 md:px-6 xl:px-10">
				<ControlPanel />
				<Filters />
				<HistoricalTotals />
			</div>
			<Footer />
		</div>
	)
}
