"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useChangePassword } from "@/hooks/use-change-password"
import { useUserStore } from "@/stores/auth/auth-store"
import { apiLogout } from "@/lib/api"

export default function ResetPasswordPage() {
	const router = useRouter()
	const userEmail = useUserStore((s) => s.user_email)
	const resetUser = useUserStore((s) => s.resetUser)

	const { changePassword, loading, error, data } = useChangePassword()

	const [email, setEmail] = useState(userEmail ?? "")
	const [oldPassword, setOldPassword] = useState("")
	const [newPassword, setNewPassword] = useState("")

	const onSubmit = async (e: React.FormEvent) => {
		e.preventDefault()

		const res = await changePassword({
			email,
			old_password: oldPassword,
			new_password: newPassword,
		})

		if (res) {
			try {
				await apiLogout()
			} catch {}
			resetUser()
			router.replace("/login")
		}
	}

	return (
		<div className="flex flex-1 flex-col gap-4 p-4">
			<Card>
				<CardHeader>
					<CardTitle>Cambiar tu contraseña</CardTitle>
					<CardDescription>Actualiza tu contraseña de forma segura.</CardDescription>
				</CardHeader>
				<CardContent>
					<form
						onSubmit={onSubmit}
						className="space-y-4"
					>
						{/* Email */}
						<div className="space-y-1">
							<Label>Email</Label>
							<Input
								type="email"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								placeholder="tu-email@empresa.com"
								required
							/>
						</div>

						{/* Contraseña actual */}
						<div className="space-y-1">
							<Label>Contraseña actual</Label>
							<Input
								type="password"
								value={oldPassword}
								onChange={(e) => setOldPassword(e.target.value)}
								placeholder="••••••••"
								required
							/>
						</div>

						{/* Nueva contraseña */}
						<div className="space-y-1">
							<Label>Nueva contraseña</Label>
							<Input
								type="password"
								value={newPassword}
								onChange={(e) => setNewPassword(e.target.value)}
								placeholder="••••••••"
								required
							/>
						</div>

						{/* Error del backend */}
						{error && <p className="text-red-600 text-sm">{error}</p>}

						{/* (Opcional) Mensaje de éxito antes de redirigir, pero en este flujo casi ni lo ves */}
						{data?.detail && <p className="text-green-600 text-sm">{data.detail}</p>}

						<Button
							type="submit"
							className="w-full"
							disabled={loading}
						>
							{loading ? "Procesando..." : "Cambiar contraseña"}
						</Button>
					</form>
				</CardContent>
			</Card>
		</div>
	)
}
