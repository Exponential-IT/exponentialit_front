export function fmt(iso?: string | null) {
	if (!iso) return "—"
	try {
		return new Date(iso).toLocaleString()
	} catch {
		return String(iso)
	}
}

export function format_date() {
	return new Date().toLocaleDateString("es-ES", {
		weekday: "long",
		day: "numeric",
		month: "long",
		year: "numeric",
	})
}
