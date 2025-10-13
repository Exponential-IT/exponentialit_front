import React from "react"
import { LoaderCircle } from "lucide-react"
import { cn } from "@/lib/utils"

type Props = {
	ClassName?: string
}

function Loading({ ClassName, ...props }: Props) {
	return (
		<div
			className={cn("", ClassName)}
			{...props}
		>
			<LoaderCircle className="animate-spin">Load</LoaderCircle>
		</div>
	)
}

export default Loading
