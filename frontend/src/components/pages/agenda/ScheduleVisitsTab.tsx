import { useState, useMemo, useEffect } from "react";
import {
	View,
	Text,
	StyleSheet,
	ScrollView,
	Pressable,
	TextInput,
	ActivityIndicator,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { colors } from "@/assets/styles/stylesheets";
import { scheduleService } from "@/services/scheduleService";
import { Appointment, AppointmentType, AppointmentStatus } from "@/assets/types/ms-schedule/Appointment";
import { useScheduleContext } from "@/contexts/ScheduleContext";

const TYPE_COLORS: Record<string, { bg: string; text: string }> = {
	Manutenção: { bg: "#e8f4fd", text: "#1a73e8" },
	Instalação: { bg: "#e6f4ea", text: "#188038" },
	Retirada: { bg: "#fce8e6", text: "#d93025" },
	Visita: { bg: "#fff3e0", text: "#e65100" },
};

const STATUS_CONFIG: Record<string, { bg: string; text: string; icon: any }> = {
	Concluído: { bg: "#e6f4ea", text: "#188038", icon: "checkmark-circle" },
	"Em Andamento": { bg: "#fff3e0", text: "#e65100", icon: "time" },
	Pendente: { bg: "#f5f5f5", text: "#757575", icon: "ellipse-outline" },
	Pulado: { bg: "#fce8e6", text: "#d93025", icon: "close-circle" },
	Confirmado: { bg: "#e6f4ea", text: "#188038", icon: "checkmark-circle" },
	Cancelado: { bg: "#fce8e6", text: "#d93025", icon: "close-circle" },
};

function formatDate(dateStr: string) {
	if (!dateStr) return "";
	// extract YYYY-MM-DD safely
	const isoDate = dateStr.split('T')[0];
	const [y, m, d] = isoDate.split("-").map(Number);
	const months = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun",
		"Jul", "Ago", "Set", "Out", "Nov", "Dez"];
	return `${d} ${months[m - 1]} ${y}`;
}

export function VisitasTecnicasTab() {
	const [visits, setVisits] = useState<Appointment[]>([]);
	const [isFetching, setIsFetching] = useState(true);
	
	const { getClientName, getAddressStr, getTechnicianName, loading } = useScheduleContext();

	const [search, setSearch] = useState("");
	const [filterType, setFilterType] = useState<AppointmentType | "Todos">("Todos");
	const [filterStatus, setFilterStatus] = useState<AppointmentStatus | "Todos">("Todos");
	const [expandedId, setExpandedId] = useState<string | null>(null);

	useEffect(() => {
		setIsFetching(true);
		scheduleService.getAllAppointments()
			.then(setVisits)
			.catch(console.error)
			.finally(() => setIsFetching(false));
	}, []);

	const filtered = useMemo(() => {
		return visits.filter((v) => {
			const clientName = getClientName(v.clientId).toLowerCase();
			const techName = getTechnicianName(v.technicianId).toLowerCase();
			const addr = getAddressStr(v.clientId).toLowerCase();
			
			const matchSearch =
				search === "" ||
				clientName.includes(search.toLowerCase()) ||
				techName.includes(search.toLowerCase()) ||
				addr.includes(search.toLowerCase());
			const matchType = filterType === "Todos" || v.type === filterType;
			const matchStatus = filterStatus === "Todos" || v.status === filterStatus;
			return matchSearch && matchType && matchStatus;
		});
	}, [search, filterType, filterStatus, visits]);

	// Summary metrics
	const total = visits.length;
	const completed = visits.filter((v) => v.status === "Concluído").length;
	const inProgress = visits.filter((v) => v.status === "Em Andamento").length;
	const pending = visits.filter((v) => v.status === "Pendente").length;

	return (
		<ScrollView style={styles.container} contentContainerStyle={styles.content}>
			{/* Summary cards */}
			<View style={styles.summaryRow}>
				<View style={[styles.summaryCard, { borderLeftColor: "#757575" }]}>
					<Text style={styles.summaryNum}>{total}</Text>
					<Text style={styles.summaryLabel}>Total</Text>
				</View>
				<View style={[styles.summaryCard, { borderLeftColor: "#188038" }]}>
					<Text style={[styles.summaryNum, { color: "#188038" }]}>{completed}</Text>
					<Text style={styles.summaryLabel}>Concluídas</Text>
				</View>
				<View style={[styles.summaryCard, { borderLeftColor: "#e65100" }]}>
					<Text style={[styles.summaryNum, { color: "#e65100" }]}>{inProgress}</Text>
					<Text style={styles.summaryLabel}>Em Andamento</Text>
				</View>
				<View style={[styles.summaryCard, { borderLeftColor: "#757575" }]}>
					<Text style={[styles.summaryNum, { color: "#757575" }]}>{pending}</Text>
					<Text style={styles.summaryLabel}>Pendentes</Text>
				</View>
			</View>

			{/* Filters */}
			<View style={styles.filtersRow}>
				{/* Search */}
				<View style={styles.searchBox}>
					<Ionicons name="search-outline" size={16} color={colors.textSecondary} />
					<TextInput
						style={styles.searchInput}
						placeholder="Buscar cliente, técnico..."
						placeholderTextColor={colors.textSecondary}
						value={search}
						onChangeText={setSearch}
					/>
					{search !== "" && (
						<Pressable onPress={() => setSearch("")}>
							<Ionicons name="close-circle" size={16} color={colors.textSecondary} />
						</Pressable>
					)}
				</View>

				{/* Type filter */}
				<ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll}>
					<View style={styles.filterChips}>
						{(["Todos", "Manutenção", "Instalação", "Retirada", "Visita"] as const).map((t) => (
							<Pressable
								key={t}
								style={[styles.chip, filterType === t && styles.chipActive]}
								onPress={() => setFilterType(t as any)}
							>
								<Text style={[styles.chipText, filterType === t && styles.chipTextActive]}>
									{t}
								</Text>
							</Pressable>
						))}
					</View>
				</ScrollView>

				{/* Result filter */}
				<ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll}>
					<View style={styles.filterChips}>
						{(["Todos", "Concluído", "Pendente", "Em Andamento"] as const).map((r) => (
							<Pressable
								key={r}
								style={[styles.chip, filterStatus === r && styles.chipActive]}
								onPress={() => setFilterStatus(r as any)}
							>
								<Text style={[styles.chipText, filterStatus === r && styles.chipTextActive]}>
									{r}
								</Text>
							</Pressable>
						))}
					</View>
				</ScrollView>
			</View>

			{/* Results count */}
			<Text style={styles.resultsCount}>
				{filtered.length} visita{filtered.length !== 1 ? "s" : ""} encontrada{filtered.length !== 1 ? "s" : ""}
			</Text>

			{/* Visit cards */}
			{loading || isFetching ? (
				<View style={styles.emptyState}>
					<ActivityIndicator size="large" color={colors.primary} />
					<Text style={styles.emptyStateText}>Carregando visitas...</Text>
				</View>
			) : filtered.length === 0 ? (
				<View style={styles.emptyState}>
					<Ionicons name="search-outline" size={40} color="#ccc" />
					<Text style={styles.emptyStateText}>Nenhuma visita encontrada</Text>
				</View>
			) : (
				filtered.map((visit) => {
					const rc = STATUS_CONFIG[visit.status] || { bg: "#f5f5f5", text: "#666", icon: "ellipse-outline" };
					const tc = TYPE_COLORS[visit.type] || { bg: "#f5f5f5", text: "#666" };
					const isExpanded = expandedId === visit.id;
					
					const clientName = getClientName(visit.clientId);
					const techName = getTechnicianName(visit.technicianId);
					const address = getAddressStr(visit.clientId);
					const dateFmt = formatDate(visit.scheduledDate) || " N/A";
					const day = dateFmt.split(" ")[0];
					const month = dateFmt.split(" ")[1];

					return (
						<Pressable
							key={visit.id}
							style={styles.visitCard}
							onPress={() => setExpandedId(isExpanded ? null : visit.id)}
						>
							{/* Top row */}
							<View style={styles.visitTop}>
								<View style={styles.dateBlock}>
									<Text style={styles.dateDay}>
										{day}
									</Text>
									<Text style={styles.dateMonth}>
										{month}
									</Text>
								</View>

								<View style={styles.visitMain}>
									<View style={styles.visitTitleRow}>
										<Text style={styles.visitClient} numberOfLines={1}>
											{clientName}
										</Text>
										<View style={[styles.resultBadge, { backgroundColor: rc.bg }]}>
											<Ionicons name={rc.icon} size={12} color={rc.text} />
											<Text style={[styles.resultBadgeText, { color: rc.text }]}>
												{visit.status}
											</Text>
										</View>
									</View>

									<View style={styles.visitMeta}>
										<Ionicons name="location-outline" size={12} color={colors.textSecondary} />
										<Text style={styles.visitMetaText} numberOfLines={1}>{address}</Text>
									</View>

									<View style={styles.visitTagsRow}>
										<View style={[styles.typePill, { backgroundColor: tc.bg }]}>
											<Text style={[styles.typePillText, { color: tc.text }]}>{visit.type}</Text>
										</View>
										<View style={styles.visitMetaItem}>
											<Ionicons name="person-outline" size={12} color={colors.textSecondary} />
											<Text style={styles.visitMetaText}>{techName}</Text>
										</View>
										<View style={styles.visitMetaItem}>
											<Ionicons name="time-outline" size={12} color={colors.textSecondary} />
											<Text style={styles.visitMetaText}>{visit.estimatedDuration || "N/A"} min</Text>
										</View>
									</View>
								</View>

								<Ionicons
									name={isExpanded ? "chevron-up" : "chevron-down"}
									size={18}
									color={colors.textSecondary}
								/>
							</View>

							{/* Expanded details */}
							{isExpanded && (
								<View style={styles.visitDetails}>
									{visit.notes && (
										<View style={styles.observationBox}>
											<Text style={styles.observationLabel}>Observações</Text>
											<Text style={styles.observationText}>{visit.notes}</Text>
										</View>
									)}
									{visit.nextVisitDate && (
										<View style={styles.nextVisitBox}>
											<Ionicons name="calendar-outline" size={14} color={colors.primary} />
											<Text style={styles.nextVisitText}>
												Próxima visita: {formatDate(visit.nextVisitDate)}
											</Text>
										</View>
									)}
								</View>
							)}
						</Pressable>
					);
				})
			)}
		</ScrollView>
	);
}

const styles = StyleSheet.create({
	container: { flex: 1 },
	content: { padding: 24, gap: 16 },
	// Summary
	summaryRow: {
		flexDirection: "row",
		gap: 12,
		flexWrap: "wrap",
	},
	summaryCard: {
		flex: 1,
		minWidth: 100,
		backgroundColor: "#fff",
		borderRadius: 12,
		padding: 16,
		borderWidth: 1,
		borderColor: "#f0f0f0",
		borderLeftWidth: 4,
	},
	summaryNum: {
		fontFamily: "Futura",
		fontSize: 26,
		fontWeight: "bold",
		color: colors.textPrimary,
	},
	summaryLabel: {
		fontFamily: "Futura",
		fontSize: 12,
		color: colors.textSecondary,
		marginTop: 2,
	},
	// Filters
	filtersRow: {
		gap: 10,
	},
	searchBox: {
		flexDirection: "row",
		alignItems: "center",
		gap: 10,
		backgroundColor: "#fff",
		borderRadius: 12,
		borderWidth: 1,
		borderColor: "#e0e0e0",
		paddingHorizontal: 14,
		paddingVertical: 10,
	},
	searchInput: {
		flex: 1,
		fontFamily: "Futura",
		fontSize: 14,
		color: colors.textPrimary,
		outlineStyle: "none" as any,
	},
	filterScroll: {
		flexGrow: 0,
	},
	filterChips: {
		flexDirection: "row",
		gap: 8,
	},
	chip: {
		paddingHorizontal: 14,
		paddingVertical: 7,
		borderRadius: 20,
		backgroundColor: "#f5f5f5",
		borderWidth: 1,
		borderColor: "#e0e0e0",
	},
	chipActive: {
		backgroundColor: colors.secondary,
		borderColor: colors.secondary,
	},
	chipText: {
		fontFamily: "Futura",
		fontSize: 13,
		color: colors.textSecondary,
	},
	chipTextActive: {
		color: "#fff",
		fontWeight: "bold",
	},
	resultsCount: {
		fontFamily: "Futura",
		fontSize: 13,
		color: colors.textSecondary,
	},
	// Empty
	emptyState: {
		alignItems: "center",
		paddingVertical: 48,
		gap: 12,
	},
	emptyStateText: {
		fontFamily: "Futura",
		fontSize: 15,
		color: "#bbb",
	},
	// Visit card
	visitCard: {
		backgroundColor: "#fff",
		borderRadius: 14,
		borderWidth: 1,
		borderColor: "#f0f0f0",
		overflow: "hidden",
		shadowColor: "#000",
		shadowOpacity: 0.04,
		shadowRadius: 6,
		shadowOffset: { width: 0, height: 2 },
	},
	visitTop: {
		flexDirection: "row",
		alignItems: "center",
		gap: 14,
		padding: 14,
	},
	dateBlock: {
		width: 44,
		alignItems: "center",
		backgroundColor: "#f5f5f5",
		borderRadius: 10,
		paddingVertical: 8,
		flexShrink: 0,
	},
	dateDay: {
		fontFamily: "Futura",
		fontSize: 20,
		fontWeight: "bold",
		color: colors.secondary,
	},
	dateMonth: {
		fontFamily: "Futura",
		fontSize: 11,
		color: colors.textSecondary,
		textTransform: "uppercase",
	},
	visitMain: {
		flex: 1,
		gap: 5,
	},
	visitTitleRow: {
		flexDirection: "row",
		alignItems: "center",
		gap: 10,
		flexWrap: "wrap",
	},
	visitClient: {
		fontFamily: "Futura",
		fontSize: 14,
		fontWeight: "bold",
		color: colors.textPrimary,
		flex: 1,
	},
	resultBadge: {
		flexDirection: "row",
		alignItems: "center",
		gap: 4,
		paddingHorizontal: 8,
		paddingVertical: 3,
		borderRadius: 6,
	},
	resultBadgeText: {
		fontFamily: "Futura",
		fontSize: 11,
		fontWeight: "bold",
	},
	visitMeta: {
		flexDirection: "row",
		alignItems: "center",
		gap: 4,
	},
	visitMetaText: {
		fontFamily: "Futura",
		fontSize: 12,
		color: colors.textSecondary,
		flex: 1,
	},
	visitTagsRow: {
		flexDirection: "row",
		alignItems: "center",
		gap: 10,
		flexWrap: "wrap",
	},
	typePill: {
		paddingHorizontal: 8,
		paddingVertical: 3,
		borderRadius: 12,
	},
	typePillText: {
		fontFamily: "Futura",
		fontSize: 11,
		fontWeight: "bold",
	},
	visitMetaItem: {
		flexDirection: "row",
		alignItems: "center",
		gap: 4,
	},
	// Expanded
	visitDetails: {
		padding: 14,
		paddingTop: 0,
		gap: 10,
		borderTopWidth: 1,
		borderTopColor: "#f5f5f5",
		marginHorizontal: 14,
		paddingBottom: 14,
	},
	observationBox: {
		backgroundColor: "#fafafa",
		borderRadius: 10,
		padding: 12,
		gap: 6,
	},
	observationLabel: {
		fontFamily: "Futura",
		fontSize: 12,
		fontWeight: "bold",
		color: colors.textSecondary,
		textTransform: "uppercase",
		letterSpacing: 0.5,
	},
	observationText: {
		fontFamily: "Futura",
		fontSize: 13,
		color: colors.textPrimary,
		lineHeight: 20,
	},
	nextVisitBox: {
		flexDirection: "row",
		alignItems: "center",
		gap: 8,
		backgroundColor: "#fff8f0",
		borderRadius: 8,
		paddingHorizontal: 12,
		paddingVertical: 8,
	},
	nextVisitText: {
		fontFamily: "Futura",
		fontSize: 13,
		color: colors.primary,
		fontWeight: "bold",
	},
});
