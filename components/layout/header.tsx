import React from "react"
import Isologo from "../common/isologo"
import { LogoutButton } from "../common/logut_button"

export default function Header() {
	return (
		<header className="w-full flex flex-row items-center justify-center text-center gap-2 mt-2">
			<Isologo />
			<div>

			<h1 className="text-3xl md:text-4xl font-bold xl:text-5xl">Extractor de facturas</h1>
			<h2>Plataforma de extracción automatizada de datos con inteligencia artificial.</h2>
			</div>
			<LogoutButton />
		</header>
	)
}
