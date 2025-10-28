"use client"
import React from "react"
import Image from "next/image"
import { cn } from "@/lib/utils"

type Props = {
	className?: string
}

export default function Isologo({ className, ...props }: Props) {
	return (
		<Image
			src="/isologo.svg"
			alt="ExponentialIT Isologo"
			width={70}
			height={70}
			priority
			className={cn("flex flex-col gap-6", className)}
			{...props}
		/>
	)
}
