export function formatDisplayDate(dateString: string) {
	if (!dateString) return "Data inválida";
	// Replace space with 'T' to make it a valid ISO 8601 string
	const compliantDateString = dateString.replace(" ", "T");
	const date = new Date(compliantDateString);

	if (!isNaN(date.getTime())) {
		return date.toLocaleDateString("pt-BR", {
			day: "2-digit",
			month: "2-digit",
			year: "numeric",
		});
	}
	return "Data inválida";
}
