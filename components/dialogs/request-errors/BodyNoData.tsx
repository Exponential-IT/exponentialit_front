"use client"

import { DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"

export default function BodyNoData() {
	return (
		<DialogHeader>
			<DialogTitle>Sin Datos</DialogTitle>
			<DialogDescription>No se logro obtener los datos.</DialogDescription>
		</DialogHeader>
	)
}
