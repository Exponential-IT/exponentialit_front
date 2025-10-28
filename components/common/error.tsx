import React from "react"

type Props = {
	error?: string | null
}

export default function ErrorCommon({ error }: Props) {
	return (
		<div className="text-center bg-destructive-foreground text-destructive rounded shadow px-2 py-4 w-1/2">
			<p className="text-f">Error : {error}</p>
		</div>
	)
}
