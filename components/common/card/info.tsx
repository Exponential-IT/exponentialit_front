import React from "react"
import { LucideIcon } from "lucide-react"

type Color = "red" | "green" | "blue" | "purple" | "orange"

type Props = {
	icon: LucideIcon
	value: number | string
	label: string
	color: Color
}

const bgClasses: Record<Color, string> = {
	red: "bg-chart-red",
	green: "bg-chart-green",
	blue: "bg-chart-blue",
	purple: "bg-chart-purple",
	orange: "bg-chart-orange",
}

const textClasses: Record<Color, string> = {
	red: "text-chart-red-foreground",
	green: "text-chart-green-foreground",
	blue: "text-chart-blue-foreground",
	purple: "text-chart-purple-foreground",
	orange: "text-chart-orange-foreground",
}

export default function InfoCard({ icon: Icon, value, label, color }: Props) {
	return (
		<div className="flex flex-col items-center justify-center text-center w-fit">
			<Icon
				size={50}
				className={`m-2 p-1 rounded-sm shadow-sm ${bgClasses[color]} ${textClasses[color]}`}
			/>
			<p className={`text-xl font-bold drop-shadow-sm ${textClasses[color]}`}>{value}</p>
			<p className={`text-xs`}>{label}</p>
		</div>
	)
}
