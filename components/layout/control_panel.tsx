import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"

import { useUserStore } from "@/stores/auth/auth-store"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { FileText, CircleCheckBig, CircleX } from "lucide-react"
import InfoCard from "../common/card/info"

export default function ControlPanel() {
	const user = useUserStore((s) => s.user)

	const maximum_invoices = useUserStore((s) => s.maximum_invoices)
	const total_invoices_user = useUserStore((s) => s.total_invoices_user)

	const fecha = new Date().toLocaleDateString("es-ES", {
		weekday: "long",
		day: "numeric",
		month: "long",
		year: "numeric",
	})

	return (
		<Card>
			<CardHeader className="flex flex-row items-center justify-between">
				<div>
					<CardTitle>{user || "Panel de control"}</CardTitle>
					<CardDescription>{fecha}</CardDescription>
				</div>
				<span className="bg-accent text-accent-foreground p-1.5 rounded-sm select-none">
					Consumo: {total_invoices_user} de {maximum_invoices} facturas
				</span>
			</CardHeader>

			<CardContent className="grid gap-3">
				{/* Conteo de facturas */}
				<div>
					<h3 className="font-medium">Historicos totales</h3>
					<div className="flex flex-wrap gap-6 items-center justify-start">
						<InfoCard
							icon={FileText}
							label="Total"
							value={1}
							color="blue"
						/>
						<InfoCard
							icon={CircleCheckBig}
							label="Exitosas"
							value={2}
							color="red"
						/>
						<InfoCard
							icon={CircleX}
							label="Errores"
							value={1}
							color="green"
						/>
						<InfoCard
							icon={CircleX}
							label="Este mes"
							value={0}
							color="orange"
						/>
						<InfoCard
							icon={CircleX}
							label="Disponible"
							value={1000}
							color="purple"
						/>
					</div>
				</div>

				<Separator />
				{/* progreso */}
				<div className="flex flex-row flex-wrap items-center justify-start gap-2">
					<p>Uso mensual</p>{" "}
					<span className="bg-accent text-accent-foreground py-0.5 px-2 rounded-full">
						{(total_invoices_user / maximum_invoices) * 100} %
					</span>
				</div>
				<Progress value={(total_invoices_user / maximum_invoices) * 100} />
			</CardContent>
		</Card>
	)
}
