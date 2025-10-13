import React from "react"

type Props = {
	error?: string | null
}

export default function ErrorCommon({ error }: Props) {
	return (
		<div className="text-center bg-destructive text-destructive-foreground rounded-b shadow px-2 py-4 w-full">
			<p className="text-f">Error : {error}</p>
		</div>
	)
}
