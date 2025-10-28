import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"

import { useUserStore } from "@/stores/auth/auth-store"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { FileText, CircleCheckBig, CircleX } from "lucide-react"
import InfoCard from "../common/card/info"
import { LogoutButton } from "../common/logut_button"

export default function ControlPanel() {
	const user = useUserStore((s) => s.user)

	const maximum_invoices = useUserStore((s) => s.maximum_invoices)
	const total_invoices_user = useUserStore((s) => s.total_invoices_user)
	const total_invoices_month = useUserStore((s) => s.total_invoices_month)
	const total_invoices_success_month = useUserStore((s) => s.total_invoices_success_month)
	const total_invoices_failed_month = useUserStore((s) => s.total_invoices_failed_month)
	const total_invoices = useUserStore((s) => s.total_invoices)
	const total_invoices_success = useUserStore((s) => s.total_invoices_success)
	const total_invoices_failed = useUserStore((s) => s.total_invoices_failed)

	const fecha = new Date().toLocaleDateString("es-ES", {
		weekday: "long",
		day: "numeric",
		month: "long",
		year: "numeric",
	})

	return (
		<Card>
			<CardHeader className="flex flex-nowrap items-center justify-between">
				<span>
					<CardTitle>{user || "Panel de control"}</CardTitle>
					<CardDescription>{fecha}</CardDescription>
				</span>
				<div className="flex justify-between gap-2">
					<span className="bg-accent text-accent-foreground p-1 rounded-sm select-none text-center hidden md:block">
						Consumo: {total_invoices_user} de {maximum_invoices} facturas
					</span>
					<LogoutButton />
				</div>
			</CardHeader>

			<CardContent className="grid gap-2">
				{/* Conteo de facturas */}
				<div>
					<h3 className="font-medium">Historicos totales</h3>
					<div className="grid grid-cols-1 sm:grid-cols-2 justify-center items-center gap-4 ">
						<div>
							<p>Mesual</p>
							<span className="grid grid-cols-3 max-w-[40em]  place-items-center sm:place-items-start">
								<InfoCard
									icon={FileText}
									label="Total"
									value={total_invoices_month}
									color="blue"
								/>
								<InfoCard
									icon={CircleCheckBig}
									label="Exitosas"
									value={total_invoices_success_month}
									color="green"
								/>
								<InfoCard
									icon={CircleX}
									label="Errores"
									value={total_invoices_failed_month}
									color="red"
								/>
							</span>
						</div>
						<div>
							<p>Total</p>
							<span className="grid grid-cols-3 max-w-[40em]  place-items-center sm:place-items-start">
								<InfoCard
									icon={CircleX}
									label="Total"
									value={total_invoices}
									color="blue"
								/>
								<InfoCard
									icon={CircleX}
									label="Exitosas"
									value={total_invoices_success}
									color="green"
								/>
								<InfoCard
									icon={CircleX}
									label="Errores"
									value={total_invoices_failed}
									color="red"
								/>
							</span>
						</div>
					</div>
				</div>

				<Separator />
				{/* progreso */}
				<div className="flex flex-row flex-wrap items-center justify-start gap-2">
					<p>Uso mensual</p>{" "}
					<span className="bg-accent text-accent-foreground py-0.5 px-2 rounded-full">
						{((total_invoices_user / maximum_invoices) * 100).toFixed(2)} %
					</span>
				</div>
				<Progress value={(total_invoices_user / maximum_invoices) * 100} />
			</CardContent>
		</Card>
	)
}
