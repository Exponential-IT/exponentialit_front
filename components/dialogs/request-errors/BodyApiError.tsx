"use client"

import { DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"

export default function BodyApiError({ message }: { message: string }) {
	return (
		<DialogHeader>
			<DialogTitle>Se registraron errores.</DialogTitle>
			<DialogDescription>{message}</DialogDescription>
		</DialogHeader>
	)
}
