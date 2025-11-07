"use client"
import { LoginForm } from "@/components/auth/login_form"
import Isologo from "@/components/common/isologo"
import Logotipo from "@/components/common/logotipo"
import { useAuth } from "@/hooks/use-auth"

export default function LoginPage() {
	const { login, loading, error } = useAuth()

	return (
		<div className="grid min-h-svh lg:grid-cols-2">
			<div className="flex flex-col gap-4 p-6 md:p-10">
				<div className="flex flex-1 items-center justify-center">
					<div className="w-full max-w-xs flex flex-col gap-4">
						<Logotipo className="w-96 h-auto lg:hidden" />
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
			</div>
			<div className="bg-muted relative hidden lg:block">
				<div className="w-full h-full flex justify-center items-center">
					<Isologo className="w-96 h-auto" />
				</div>
			</div>
		</div>
	)
}
