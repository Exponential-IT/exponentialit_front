import type { Metadata } from "next"
import { Montserrat } from "next/font/google"
import "./globals.css"
import { Toaster } from "@/components/ui/sonner"
import { SpeedInsights } from "@vercel/speed-insights/next"

const montserrat = Montserrat({
	variable: "--font-montserrat",
	subsets: ["latin"],
	weight: ["300", "400", "500", "600", "700"],
})

export const metadata: Metadata = {
	title: "ExponentailIT",
	description: "En desarrollo",
	icons: {
		icon: "/isotipo.svg",
	},
}

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode
}>) {
	return (
		<html lang="en">
			<body className={`${montserrat.variable} antialiased font-sans`}>
				{children}
				<SpeedInsights />
				<Toaster
					position="bottom-right"
					closeButton
				/>
			</body>
		</html>
	)
}
