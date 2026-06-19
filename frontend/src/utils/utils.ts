export function formatDisplayDate(dateInput: string | Date | null | undefined) {
	if (!dateInput) return "Data inválida";

	let date: Date;

	if (dateInput instanceof Date) {
		date = dateInput;
	} else if (typeof dateInput === "string") {
		const compliantDateString = dateInput.replace(" ", "T");
		date = new Date(compliantDateString);
	} else {
		return "Data inválida";
	}

	if (!isNaN(date.getTime())) {
		return date.toLocaleDateString("pt-BR", {
			day: "2-digit",
			month: "2-digit",
			year: "numeric",
		});
	}
	return "Data inválida";
}
