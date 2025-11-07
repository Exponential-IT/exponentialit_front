// components/dialogs/request-errors/DialogShell.tsx
"use client"

import * as React from "react"
import { Dialog, DialogContent } from "@/components/ui/dialog"

type Props = {
	open: boolean
	onOpenChange: (v: boolean) => void
	children: React.ReactNode
}

export function DialogShell({ open, onOpenChange, children }: Props) {
	return (
		<Dialog
			open={open}
			onOpenChange={onOpenChange}
		>
			<DialogContent className="sm:max-w-md select-text">{children}</DialogContent>
		</Dialog>
	)
}
