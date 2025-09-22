"use client"
import React from "react"
import Image from "next/image"

export default function Isologo() {
	return (
		<Image
			src="/isologo.svg"
			alt="ExponentialIT Isologo"
			width={150}
			height={150}
			priority
			className="w-28 h-auto"
		/>
	)
}
