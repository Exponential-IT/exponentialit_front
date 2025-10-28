// components/layout/footer.tsx
"use client"

import Link from "next/link"
import { Separator } from "@/components/ui/separator"
import Isotipo from "../common/isotipo"

export default function Footer() {
	return (
		<footer className="w-full border-t text-center bg-card">
			<div className="mx-auto max-w-7xl p-2">
				<div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
					<Isotipo className="w-20 h-auto" />
					<p className="text-sm text-muted-foreground">
						© {new Date().getFullYear()} ExponentialIT. Todos los derechos reservados.
					</p>
					<div className="flex gap-4 text-sm">
						<Link
							href="/privacy"
							className="hover:underline"
						>
							Privacidad
						</Link>
						<Separator
							orientation="vertical"
							className="h-4"
						/>
						<Link
							href="/terms"
							className="hover:underline"
						>
							Términos
						</Link>
					</div>
				</div>
			</div>
		</footer>
	)
}
