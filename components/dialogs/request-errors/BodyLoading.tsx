"use client"

import { DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { LoaderCircle } from "lucide-react"
export default function BodyLoading() {
	return (
		<DialogHeader>
			<DialogTitle>Cargando...</DialogTitle>
			<DialogDescription>
				<LoaderCircle className="animate-spin">Load</LoaderCircle>
			</DialogDescription>
		</DialogHeader>
	)
}
