// app/(protected)/seed-user.tsx
"use client"
import { useEffect, useRef } from "react"
import { useUserStore } from "@/stores/auth/auth-store"
import type { MeResponse } from "@/types/auth"

export default function SeedUser({ me }: { me: MeResponse }) {
	const setUserData = useUserStore((s) => s.setUserData)
	const seededRef = useRef(false)

	useEffect(() => {
		if (seededRef.current) return
		seededRef.current = true
		setUserData(
			me.user,
			me.user_id,
			me.user_email,
			me.maximum_invoices,
			me.total_invoices_user,
			me.total_invoices_month,
			me.total_invoices_success_month,
			me.total_invoices_failed_month,
			me.total_invoices,
			me.total_invoices_success,
			me.total_invoices_failed,
			me.accounts ?? []
		)
	}, [me, setUserData])
	return null
}
