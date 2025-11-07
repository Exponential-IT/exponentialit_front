export default function fmt(iso?: string | null) {
	if (!iso) return "—"
	try {
		return new Date(iso).toLocaleString()
	} catch {
		return String(iso)
	}
}
