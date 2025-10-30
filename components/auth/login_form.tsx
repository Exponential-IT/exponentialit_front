"use client"
import { useState, FormEvent } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Field, FieldDescription, FieldGroup, FieldLabel, FieldSeparator } from "@/components/ui/field"
import { toast } from "sonner"
import { useEffect } from "react"
import { Input } from "@/components/ui/input"
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
		<form
			className={cn("flex flex-col gap-6", className)}
			{...props}
			onSubmit={handle}
		>
			<FieldGroup>
				<div className="flex flex-col items-center gap-1 text-center">
					<h1 className="text-2xl font-bold">Ingresa a tu cuenta</h1>
					<p className="text-muted-foreground text-sm text-balance">
						Para ingresar a la cuenta ingresa tu email
					</p>
				</div>
				<Field>
					<FieldLabel htmlFor="email">Email</FieldLabel>
					<Input
						id="email"
						type="email"
						autoComplete="username"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						required
					/>
				</Field>
				<Field>
					<div className="flex items-center">
						<FieldLabel htmlFor="password">Password</FieldLabel>
						<a
							href="#"
							className="ml-auto text-sm underline-offset-4 hover:underline"
						>
							Forgot your password?
						</a>
					</div>
					<Input
						id="password"
						type="password"
						autoComplete="current-password"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						required
					/>
				</Field>
				<Field>
					<Button
						variant="default"
						type="submit"
						disabled={loading}
						className="cursor-pointer"
					>
						{loading ? "Ingresando" : "Ingresar"}
					</Button>
				</Field>
				<FieldDescription className="text-center">
					¿Aún no tienes una cuenta?{" "}
					<a
						href="mailto:soporte@exponentialit.net"
						className="text-primary hover:underline font-medium"
					>
						Contáctanos
					</a>
				</FieldDescription>
				<FieldSeparator>hola</FieldSeparator>
			</FieldGroup>
		</form>
	)
}
