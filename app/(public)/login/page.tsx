"use client"
import { LoginForm } from "@/components/auth/login_form"
import Isologo from "@/components/common/isologo"
import Isotipo from "@/components/common/isotipo"
import { useAuth } from "@/hooks/use-auth"

export default function LoginPage() {
	const { login, loading, error } = useAuth()

	return (
		<div className="grid min-h-svh lg:grid-cols-2">
			<div className="flex flex-col gap-4 p-6 md:p-10">
				<div className="flex flex-1 items-center justify-center">
					<div className="w-full max-w-xs flex flex-col justify-center gap-4">
						<Isotipo className="h-auto lg:hidden w-52 ml-auto mr-auto" />
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
					<Isologo className="w-[28rem] h-auto" />
				</div>
			</div>
		</div>
	)
}
