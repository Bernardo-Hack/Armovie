import { useState, useEffect } from "react";
import {
	View,
	Text,
	StyleSheet,
	ScrollView,
	Pressable,
	ActivityIndicator,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { colors } from "@/assets/styles/stylesheets";
import { scheduleService } from "@/services/scheduleService";
import { Appointment } from "@/assets/types/ms-schedule/Appointment";
import { useScheduleContext } from "@/contexts/ScheduleContext";

const TYPE_COLORS: Record<string, { bg: string; text: string; icon: any }> = {
	Manutenção: { bg: "#e8f4fd", text: "#1a73e8", icon: "build-outline" },
	Instalação: { bg: "#e6f4ea", text: "#188038", icon: "download-outline" },
	Retirada: { bg: "#fce8e6", text: "#d93025", icon: "arrow-up-circle-outline" },
	Visita: { bg: "#fff3e0", text: "#e65100", icon: "eye-outline" },
};

const STATUS_COLORS: Record<string, { bg: string; text: string }> = {
	Confirmado: { bg: "#e6f4ea", text: "#188038" },
	Pendente: { bg: "#fff3e0", text: "#e65100" },
	Cancelado: { bg: "#fce8e6", text: "#d93025" },
};

export function PlanejamentoRotaTab() {
	const [stops, setStops] = useState<Appointment[]>([]);
	const [expandedId, setExpandedId] = useState<string | null>(null);
	const [isFetching, setIsFetching] = useState(true);
	
	const { getClientName, getAddressStr, loading } = useScheduleContext();

	useEffect(() => {
		setIsFetching(true);
		const today = new Date().toISOString().split('T')[0];
		scheduleService.getAppointmentsByDate(today)
			.then(data => {
				const sorted = [...data].sort((a, b) => (a.routeOrder || 999) - (b.routeOrder || 999));
				setStops(sorted);
			})
			.catch(console.error)
			.finally(() => setIsFetching(false));
	}, []);

	const moveUp = async (idx: number) => {
		if (idx === 0) return;
		const updated = [...stops];
		[updated[idx - 1], updated[idx]] = [updated[idx], updated[idx - 1]];
		setStops(updated);

		try {
			await Promise.all([
				scheduleService.updateAppointment(updated[idx - 1].id, { routeOrder: idx }),
				scheduleService.updateAppointment(updated[idx].id, { routeOrder: idx + 1 })
			]);
		} catch (error) {
			console.error("Failed to update route order", error);
		}
	};

	const moveDown = async (idx: number) => {
		if (idx === stops.length - 1) return;
		const updated = [...stops];
		[updated[idx], updated[idx + 1]] = [updated[idx + 1], updated[idx]];
		setStops(updated);

		try {
			await Promise.all([
				scheduleService.updateAppointment(updated[idx].id, { routeOrder: idx + 1 }),
				scheduleService.updateAppointment(updated[idx + 1].id, { routeOrder: idx + 2 })
			]);
		} catch (error) {
			console.error("Failed to update route order", error);
		}
	};

	const totalTime = stops.reduce((acc, s) => acc + (s.estimatedDuration || 0), 0);
	const totalHours = Math.floor(totalTime / 60);
	const totalMins = totalTime % 60;

	return (
		<ScrollView style={styles.container} contentContainerStyle={styles.content}>
			{/* Summary Bar */}
			<View style={styles.summaryBar}>
				<View style={styles.summaryItem}>
					<Ionicons name="location-outline" size={18} color={colors.primary} />
					<Text style={styles.summaryValue}>{stops.length}</Text>
					<Text style={styles.summaryLabel}>Paradas</Text>
				</View>
				<View style={styles.summaryDivider} />
				<View style={styles.summaryItem}>
					<Ionicons name="time-outline" size={18} color={colors.primary} />
					<Text style={styles.summaryValue}>
						{totalHours > 0 ? `${totalHours}h ` : ""}{totalMins}min
					</Text>
					<Text style={styles.summaryLabel}>Estimado</Text>
				</View>
				<View style={styles.summaryDivider} />
				<View style={styles.summaryItem}>
					<Ionicons name="checkmark-circle-outline" size={18} color="#188038" />
					<Text style={styles.summaryValue}>
						{stops.filter((s) => s.status === "Confirmado").length}
					</Text>
					<Text style={styles.summaryLabel}>Confirmados</Text>
				</View>
				<View style={styles.summaryDivider} />
				<View style={styles.summaryItem}>
					<Ionicons name="alert-circle-outline" size={18} color="#e65100" />
					<Text style={styles.summaryValue}>
						{stops.filter((s) => s.status === "Pendente").length}
					</Text>
					<Text style={styles.summaryLabel}>Pendentes</Text>
				</View>

				<Pressable style={styles.startRouteBtn}>
					<Ionicons name="navigate-outline" size={16} color="#fff" />
					<Text style={styles.startRouteBtnText}>Iniciar Rota</Text>
				</Pressable>
			</View>

			{/* Route List */}
			<View style={styles.routeList}>
				{loading || isFetching ? (
					<View style={{ padding: 40, alignItems: "center" }}>
						<ActivityIndicator size="large" color={colors.primary} />
						<Text style={{ marginTop: 10, color: colors.textSecondary }}>Carregando rota de hoje...</Text>
					</View>
				) : stops.length === 0 ? (
					<View style={{ padding: 40, alignItems: "center" }}>
						<Ionicons name="map-outline" size={36} color="#ccc" />
						<Text style={{ marginTop: 10, color: colors.textSecondary }}>Nenhuma rota planejada para hoje.</Text>
					</View>
				) : stops.map((stop, idx) => {
					const typeStyle = TYPE_COLORS[stop.type] || { bg: "#f5f5f5", text: "#666", icon: "help-outline" };
					const statusStyle = STATUS_COLORS[stop.status] || { bg: "#f5f5f5", text: "#666" };
					const isExpanded = expandedId === stop.id;
					const clientName = getClientName(stop.clientId);
					const address = getAddressStr(stop.clientId);
					const formattedTime = new Date(stop.scheduledDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

					return (
						<View key={stop.id} style={styles.stopWrapper}>
							{/* Connector line */}
							{idx < stops.length - 1 && (
								<View style={styles.connectorLine} />
							)}

							{/* Order Badge */}
							<View style={styles.orderBadge}>
								<Text style={styles.orderBadgeText}>{idx + 1}</Text>
							</View>

							{/* Card */}
							<Pressable
								style={[styles.stopCard, isExpanded && styles.stopCardExpanded]}
								onPress={() => setExpandedId(isExpanded ? null : stop.id)}
							>
								<View style={styles.stopCardTop}>
									<View style={styles.stopLeft}>
										{/* Type icon */}
										<View style={[styles.typeIconBox, { backgroundColor: typeStyle.bg }]}>
											<Ionicons name={typeStyle.icon} size={18} color={typeStyle.text} />
										</View>
										<View style={styles.stopInfo}>
											<Text style={styles.stopClient} numberOfLines={1}>
												{clientName}
											</Text>
											<View style={styles.stopMeta}>
												<Ionicons name="location-outline" size={12} color={colors.textSecondary} />
												<Text style={styles.stopMetaText} numberOfLines={1}>
													{address}
												</Text>
											</View>
										</View>
									</View>

									<View style={styles.stopRight}>
										<View style={styles.stopTimeBadge}>
											<Ionicons name="time-outline" size={12} color={colors.textSecondary} />
											<Text style={styles.stopTime}>{formattedTime}</Text>
										</View>
										<View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
											{/* Reorder controls */}
											<View style={styles.reorderBtns}>
												<Pressable
													style={[styles.reorderBtn, idx === 0 && styles.reorderBtnDisabled]}
													onPress={() => moveUp(idx)}
													disabled={idx === 0}
												>
													<Ionicons name="arrow-up" size={14} color={idx === 0 ? "#ccc" : colors.textSecondary} />
												</Pressable>
												<Pressable
													style={[styles.reorderBtn, idx === stops.length - 1 && styles.reorderBtnDisabled]}
													onPress={() => moveDown(idx)}
													disabled={idx === stops.length - 1}
												>
													<Ionicons name="arrow-down" size={14} color={idx === stops.length - 1 ? "#ccc" : colors.textSecondary} />
												</Pressable>
											</View>
											<View style={[styles.badge, { backgroundColor: statusStyle.bg }]}>
												<Text style={[styles.badgeText, { color: statusStyle.text }]}>
													{stop.status}
												</Text>
											</View>
										</View>
									</View>
								</View>

								{/* Expanded details */}
								{isExpanded && (
									<View style={styles.stopDetails}>
										<View style={styles.detailRow}>
											<View style={[styles.typePill, { backgroundColor: typeStyle.bg }]}>
												<Text style={[styles.typePillText, { color: typeStyle.text }]}>
													{stop.type}
												</Text>
											</View>
											<Text style={styles.detailDuration}>
												Duração: {stop.estimatedDuration ? `${stop.estimatedDuration} min` : "Não informada"}
											</Text>
										</View>
										{stop.notes && (
											<View style={styles.notesBox}>
												<Ionicons name="document-text-outline" size={14} color={colors.textSecondary} />
												<Text style={styles.notesText}>{stop.notes}</Text>
											</View>
										)}
									</View>
								)}
							</Pressable>
						</View>
					);
				})}
			</View>
		</ScrollView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	content: {
		padding: 24,
		gap: 20,
	},
	// Summary bar
	summaryBar: {
		flexDirection: "row",
		alignItems: "center",
		backgroundColor: "#fff",
		borderRadius: 14,
		padding: 16,
		borderWidth: 1,
		borderColor: "#f0f0f0",
		gap: 16,
		flexWrap: "wrap",
	},
	summaryItem: {
		flexDirection: "row",
		alignItems: "center",
		gap: 6,
	},
	summaryValue: {
		fontFamily: "Futura",
		fontSize: 16,
		fontWeight: "bold",
		color: colors.textPrimary,
	},
	summaryLabel: {
		fontFamily: "Futura",
		fontSize: 13,
		color: colors.textSecondary,
	},
	summaryDivider: {
		width: 1,
		height: 24,
		backgroundColor: "#e0e0e0",
	},
	startRouteBtn: {
		marginLeft: "auto",
		flexDirection: "row",
		alignItems: "center",
		gap: 6,
		backgroundColor: colors.secondary,
		paddingHorizontal: 16,
		paddingVertical: 10,
		borderRadius: 10,
	},
	startRouteBtnText: {
		fontFamily: "Futura",
		fontSize: 14,
		fontWeight: "bold",
		color: "#fff",
	},
	// Route list
	routeList: {
		gap: 0,
	},
	stopWrapper: {
		flexDirection: "row",
		alignItems: "flex-start",
		gap: 12,
		marginBottom: 12,
		position: "relative",
	},
	connectorLine: {
		position: "absolute",
		left: 19,
		top: 40,
		width: 2,
		height: "100%",
		backgroundColor: "#e0e0e0",
		zIndex: 0,
	},
	orderBadge: {
		width: 40,
		height: 40,
		borderRadius: 20,
		backgroundColor: colors.secondary,
		justifyContent: "center",
		alignItems: "center",
		marginTop: 8,
		zIndex: 1,
		flexShrink: 0,
	},
	orderBadgeText: {
		fontFamily: "Futura",
		fontSize: 15,
		fontWeight: "bold",
		color: "#fff",
	},
	stopCard: {
		flex: 1,
		backgroundColor: "#fff",
		borderRadius: 14,
		padding: 14,
		borderWidth: 1,
		borderColor: "#f0f0f0",
		shadowColor: "#000",
		shadowOpacity: 0.04,
		shadowRadius: 6,
		shadowOffset: { width: 0, height: 2 },
	},
	stopCardExpanded: {
		borderColor: colors.secondary,
	},
	stopCardTop: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		gap: 12,
	},
	stopLeft: {
		flexDirection: "row",
		alignItems: "center",
		gap: 12,
		flex: 1,
	},
	typeIconBox: {
		width: 40,
		height: 40,
		borderRadius: 10,
		justifyContent: "center",
		alignItems: "center",
		flexShrink: 0,
	},
	stopInfo: {
		flex: 1,
		gap: 4,
	},
	stopClient: {
		fontFamily: "Futura",
		fontSize: 14,
		fontWeight: "bold",
		color: colors.textPrimary,
	},
	stopMeta: {
		flexDirection: "row",
		alignItems: "center",
		gap: 4,
	},
	stopMetaText: {
		fontFamily: "Futura",
		fontSize: 12,
		color: colors.textSecondary,
		flex: 1,
	},
	stopRight: {
		alignItems: "flex-end",
		gap: 6,
		flexShrink: 0,
	},
	stopTimeBadge: {
		flexDirection: "row",
		alignItems: "center",
		gap: 4,
	},
	stopTime: {
		fontFamily: "Futura",
		fontSize: 13,
		fontWeight: "bold",
		color: colors.textPrimary,
	},
	badge: {
		paddingHorizontal: 8,
		paddingVertical: 3,
		borderRadius: 6,
	},
	badgeText: {
		fontFamily: "Futura",
		fontSize: 11,
		fontWeight: "bold",
	},
	// Expanded
	stopDetails: {
		marginTop: 12,
		paddingTop: 12,
		borderTopWidth: 1,
		borderTopColor: "#f0f0f0",
		gap: 8,
	},
	detailRow: {
		flexDirection: "row",
		alignItems: "center",
		gap: 12,
	},
	typePill: {
		paddingHorizontal: 10,
		paddingVertical: 4,
		borderRadius: 20,
	},
	typePillText: {
		fontFamily: "Futura",
		fontSize: 12,
		fontWeight: "bold",
	},
	detailDuration: {
		fontFamily: "Futura",
		fontSize: 13,
		color: colors.textSecondary,
	},
	notesBox: {
		flexDirection: "row",
		gap: 8,
		backgroundColor: "#fafafa",
		borderRadius: 8,
		padding: 10,
	},
	notesText: {
		fontFamily: "Futura",
		fontSize: 13,
		color: colors.textSecondary,
		flex: 1,
	},
	// Reorder
	reorderBtns: {
		flexDirection: "row",
		gap: 6,
	},
	reorderBtn: {
		width: 28,
		height: 28,
		borderRadius: 6,
		backgroundColor: "#f5f5f5",
		justifyContent: "center",
		alignItems: "center",
	},
	reorderBtnDisabled: {
		opacity: 0.4,
	},
});
