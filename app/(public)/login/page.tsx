"use client"
import { LoginForm } from "@/components/auth/login_form"
import Isologo from "@/components/common/isologo"

import { useAuth } from "@/hooks/use-auth"

export default function LoginPage() {
	const { login, loading, error } = useAuth()

	return (
		<div className="bg-muted flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10 ">
			<div className="flex w-full max-w-sm flex-col gap-6 items-center">
				<Isologo className="w-32 h-auto" />
				<LoginForm
					onSubmit={async (email, password) => {
						await login(email, password)
					}}
					loading={loading}
					error={error}
					defaultEmail=""
				/>
			</div>
		</div>
	)
}
