import React from "react"
import { Card, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
export default function Filtrers() {
	return (
		<Card>
			<CardHeader className="flex flex-row items-center justify-between">
				<div>
					<CardTitle>Filtros y búsqueda</CardTitle>
				</div>
				<Button
					variant="outline"
					className="cursor-pointer"
				>
					Filtrar
				</Button>
			</CardHeader>
		</Card>
	)
}
