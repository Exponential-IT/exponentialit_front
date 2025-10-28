import React from "react"

import Logotipo from "../common/logotipo"

export default function Header() {
	return (
		<header className="flex flex-col gap-2 items-center justify-center text-center">
			<Logotipo className="w-80 h-auto" />
			<p className="drop-shadow-2xl text-xl hidden md:block">
				Plataforma de extracción de datos automatizada con inteligencia artificial
			</p>
		</header>
	)
}
