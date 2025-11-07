"use client"

import { DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"

export default function BodyIncompleteNoError() {
	return (
		<DialogHeader>
			<DialogTitle>El proceso no terminó</DialogTitle>
			<DialogDescription>No se recibió detalle del último error.</DialogDescription>
		</DialogHeader>
	)
}
