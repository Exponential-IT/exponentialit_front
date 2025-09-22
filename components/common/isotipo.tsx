"use client"
import React from "react"
import Image from "next/image"

export default function Isotipo() {
	return (
		<Image
			src="/isotipo.svg"
			alt="ExponentialIT isotipo"
			width={70}
			height={70}
			priority
			className="w-16 h-auto"
		/>
	)
}
