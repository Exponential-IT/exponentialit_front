"use client"
import { useState, FormEvent } from "react"
import { cn } from "@/lib/utils"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "../ui/button"
import { toast } from "sonner"
import { useEffect } from "react"

type Props = {
	onSubmit: (email: string, password: string) => Promise<void | boolean>
	loading?: boolean
	error?: string | null
	defaultEmail?: string
	className?: string
}

export function LoginForm({ onSubmit, loading, error, defaultEmail = "", className, ...props }: Props) {
	const [email, setEmail] = useState(defaultEmail)
	const [password, setPassword] = useState("")

	const handle = async (e: FormEvent) => {
		e.preventDefault()
		await onSubmit(email, password)
	}

	useEffect(() => {
		if (error) {
			toast.error(error)
		}
	}, [error])

	return (
		<div
			className={cn("flex flex-col gap-6", className)}
			{...props}
		>
			<Card>
				<CardHeader>
					<CardTitle>Accede a tu cuenta</CardTitle>
					<CardDescription>Ingresa con tu correo para acceder.</CardDescription>
				</CardHeader>
				<CardContent>
					<form onSubmit={handle}>
						<div className="flex flex-col gap-6">
							<div className="grid gap-3">
								<label
									htmlFor="email"
									className="text-sm font-medium"
								>
									Email
								</label>
								<input
									id="email"
									type="email"
									autoComplete="username"
									value={email}
									onChange={(e) => setEmail(e.target.value)}
									className="border rounded px-3 py-2 text-sm"
									required
								/>
							</div>
							<div className="grid gap-3">
								<label
									htmlFor="password"
									className="text-sm font-medium"
								>
									Contraseña
								</label>
								<input
									id="password"
									type="password"
									autoComplete="current-password"
									value={password}
									onChange={(e) => setPassword(e.target.value)}
									className="border rounded px-3 py-2 text-sm"
									required
								/>
							</div>
							<div className="flex flex-col gap-3">
								<Button
									variant="default"
									type="submit"
									disabled={loading}
									className="cursor-pointer"
								>
									{loading ? "Ingresando" : "Ingresar"}
								</Button>
							</div>
						</div>
						<div className="mt-4 text-center text-sm">
							¿Aún no tienes una cuenta?{" "}
							<a
								href="mailto:soporte@exponentialit.net"
								className="text-primary hover:underline font-medium"
							>
								Contáctanos
							</a>
						</div>
					</form>
				</CardContent>
			</Card>
		</div>
	)
}
