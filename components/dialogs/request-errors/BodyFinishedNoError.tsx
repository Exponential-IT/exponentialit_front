"use client"

import { DialogHeader, DialogDescription, DialogTitle } from "@/components/ui/dialog"

export default function BodyFinishedNoError() {
	return (
		<DialogHeader>
			<DialogTitle>No se registraron errores.</DialogTitle>
			<DialogDescription>El proceso terminó correctamente.</DialogDescription>
		</DialogHeader>
	)
}
