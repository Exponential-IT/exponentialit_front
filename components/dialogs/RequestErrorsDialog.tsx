// RequestErrorsDialog.tsx
"use client"

import * as React from "react"
import type { RequestErrorsResponse } from "@/types/error"
import {
	BodyApiError,
	BodyErrorItem,
	BodyFinishedNoError,
	BodyIncompleteNoError,
	BodyLoading,
	BodyNoData,
	DialogShell,
} from "./request-errors"

type ViewState = "loading" | "apiError" | "noData" | "hasErrorItem" | "finishedNoError" | "incompleteNoError"

function resolveViewState(loading: boolean, errorMsg: string | null, data: RequestErrorsResponse | null): ViewState {
	if (loading) return "loading"
	if (errorMsg) return "apiError"
	if (!data) return "noData"
	const e = data.error ?? null
	const finished = !!data.has_pipeline_done
	if (e) return "hasErrorItem"
	if (finished) return "finishedNoError"
	return "incompleteNoError"
}

export default function RequestErrorsDialog({
	open,
	onOpenChange,
	data,
	loading,
	errorMsg,
}: {
	open: boolean
	onOpenChange: (v: boolean) => void
	data: RequestErrorsResponse | null
	loading: boolean
	errorMsg: string | null
}) {
	const state = resolveViewState(loading, errorMsg, data)

	return (
		<DialogShell
			open={open}
			onOpenChange={onOpenChange}
		>
			{state === "loading" && <BodyLoading />}
			{state === "apiError" && <BodyApiError message={errorMsg!} />}
			{state === "noData" && <BodyNoData />}
			{state === "hasErrorItem" && data && <BodyErrorItem data={data} />}
			{state === "finishedNoError" && <BodyFinishedNoError />}
			{state === "incompleteNoError" && <BodyIncompleteNoError />}
		</DialogShell>
	)
}
