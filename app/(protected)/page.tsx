"use client"

import { useSession } from "@/hooks/use-session"
import Footer from "@/components/layout/footer"
import Header from "@/components/layout/header"
import ControlPanel from "@/components/layout/control_panel"
import Filtrers from "@/components/layout/filtrers"

export default function Home() {
	const { loading, error } = useSession({ intervalMs: 60_000 })

	if (loading) return <div className="p-6">Cargando sesión...</div>
	if (error) return <div className="p-6">No autorizado {error}</div>

	return (
		<div className="bg-muted flex min-h-svh flex-col items-center justify-between ">
			<Header />
			<div className="w-full flex flex-col gap-2 p-2 md:px-6 xl:px-10 ">
				<ControlPanel />
				<Filtrers />
			</div>
			<Footer />
		</div>
	)
}
