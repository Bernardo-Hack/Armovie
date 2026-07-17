import { useState, useEffect, useMemo } from "react";
import { View, Text, StyleSheet, ScrollView, Pressable, ActivityIndicator } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { colors } from "@/assets/styles/stylesheets";
import { scheduleService } from "@/services/scheduleService";
import { Appointment } from "@/assets/types/ms-schedule/Appointment";
import { useScheduleContext } from "@/contexts/ScheduleContext";

type ViewMode = "Dia" | "Semana" | "Mês";

const MONTHS = [
	"Janeiro",
	"Fevereiro",
	"Março",
	"Abril",
	"Maio",
	"Junho",
	"Julho",
	"Agosto",
	"Setembro",
	"Outubro",
	"Novembro",
	"Dezembro",
];
const WEEKDAYS = ["DOM", "SEG", "TER", "QUA", "QUI", "SEX", "SÁB"];

const TYPE_COLORS: Record<string, { bg: string; text: string }> = {
	Manutenção: { bg: "#e8f4fd", text: "#1a73e8" },
	Instalação: { bg: "#e6f4ea", text: "#188038" },
	Retirada: { bg: "#fce8e6", text: "#d93025" },
	Visita: { bg: "#fff3e0", text: "#e65100" },
};

const STATUS_COLORS: Record<string, { bg: string; text: string }> = {
	Concluído: { bg: "#e6f4ea", text: "#188038" },
	Pendente: { bg: "#fce8e6", text: "#d93025" },
	"Em Andamento": { bg: "#fff3e0", text: "#e65100" },
};

function getDaysInMonth(year: number, month: number) {
	return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year: number, month: number) {
	return new Date(year, month, 1).getDay();
}

export function ScheduleGeneralTab() {
	const today = new Date();
	const [currentYear, setCurrentYear] = useState(today.getFullYear());
	const [currentMonth, setCurrentMonth] = useState(today.getMonth());
	const [selectedDay, setSelectedDay] = useState(today.getDate());
	const [viewMode, setViewMode] = useState<ViewMode>("Mês");
	
	const [appointments, setAppointments] = useState<Appointment[]>([]);
	const [isFetching, setIsFetching] = useState(true);
	const { getClientName, getAddressStr, getTechnicianName, loading } = useScheduleContext();

	useEffect(() => {
		setIsFetching(true);
		scheduleService.getAllAppointments()
			.then(setAppointments)
			.catch(console.error)
			.finally(() => setIsFetching(false));
	}, []);

	const daysInMonth = getDaysInMonth(currentYear, currentMonth);
	const firstDay = getFirstDayOfMonth(currentYear, currentMonth);

	const prevMonth = () => {
		if (currentMonth === 0) {
			setCurrentMonth(11);
			setCurrentYear(currentYear - 1);
		} else {
			setCurrentMonth(currentMonth - 1);
		}
		setSelectedDay(1);
	};

	const nextMonth = () => {
		if (currentMonth === 11) {
			setCurrentMonth(0);
			setCurrentYear(currentYear + 1);
		} else {
			setCurrentMonth(currentMonth + 1);
		}
		setSelectedDay(1);
	};

	const goToToday = () => {
		setCurrentYear(today.getFullYear());
		setCurrentMonth(today.getMonth());
		setSelectedDay(today.getDate());
	};

	const appointmentsByDay = useMemo(() => {
		const map: Record<number, Appointment[]> = {};
		appointments.forEach((appt) => {
			const d = new Date(appt.scheduledDate);
			if (d.getMonth() === currentMonth && d.getFullYear() === currentYear) {
				const day = d.getDate();
				if (!map[day]) map[day] = [];
				map[day].push(appt);
			}
		});
		return map;
	}, [appointments, currentMonth, currentYear]);

	const selectedAppointments = appointmentsByDay[selectedDay] || [];
	const daysWithEvents = Object.keys(appointmentsByDay).map(Number);

	// Build calendar grid
	const calendarCells: (number | null)[] = [];
	for (let i = 0; i < firstDay; i++) calendarCells.push(null);
	for (let d = 1; d <= daysInMonth; d++) calendarCells.push(d);
	while (calendarCells.length % 7 !== 0) calendarCells.push(null);

	const isToday = (day: number) =>
		day === today.getDate() &&
		currentMonth === today.getMonth() &&
		currentYear === today.getFullYear();

	return (
		<View style={styles.container}>
			{/* Left: Calendar */}
			<View style={styles.calendarSection}>
				{/* Month Navigation */}
				<View style={styles.calendarHeader}>
					<View style={styles.monthNav}>
						<Text style={styles.monthTitle}>
							{MONTHS[currentMonth]} {currentYear}
						</Text>
						<Pressable onPress={prevMonth} style={styles.navBtn}>
							<Ionicons
								name="chevron-back"
								size={18}
								color={colors.textPrimary}
							/>
						</Pressable>
						<Pressable onPress={goToToday} style={styles.todayBtn}>
							<Text style={styles.todayBtnText}>Hoje</Text>
						</Pressable>
						<Pressable onPress={nextMonth} style={styles.navBtn}>
							<Ionicons
								name="chevron-forward"
								size={18}
								color={colors.textPrimary}
							/>
						</Pressable>
					</View>

					{/* View Mode Switcher */}
					<View style={styles.viewModeSwitcher}>
						{(["Dia", "Semana", "Mês"] as ViewMode[]).map(
							(mode) => (
								<Pressable
									key={mode}
									style={[
										styles.viewModeBtn,
										viewMode === mode &&
											styles.viewModeBtnActive,
									]}
									onPress={() => setViewMode(mode)}
								>
									<Text
										style={[
											styles.viewModeBtnText,
											viewMode === mode &&
												styles.viewModeBtnTextActive,
										]}
									>
										{mode}
									</Text>
								</Pressable>
							),
						)}
					</View>
				</View>

				{/* Weekday headers */}
				<View style={styles.weekdayRow}>
					{WEEKDAYS.map((d) => (
						<Text key={d} style={styles.weekdayText}>
							{d}
						</Text>
					))}
				</View>

				{/* Calendar grid */}
				<ScrollView>
					<View style={styles.calendarGrid}>
						{calendarCells.map((day, idx) => {
							const hasEvents =
								day !== null && daysWithEvents.includes(day);
							const selected = day === selectedDay;
							const todayCell = day !== null && isToday(day);
							return (
								<Pressable
									key={idx}
									style={[
										styles.dayCell,
										selected && styles.dayCellSelected,
										todayCell &&
											!selected &&
											styles.dayCellToday,
									]}
									onPress={() => day && setSelectedDay(day)}
								>
									<Text
										style={[
											styles.dayText,
											selected && styles.dayTextSelected,
											todayCell &&
												!selected &&
												styles.dayTextToday,
										]}
									>
										{day ?? ""}
									</Text>
									{hasEvents && (
										<View
											style={[
												styles.eventDot,
												selected && {
													backgroundColor: "#fff",
												},
											]}
										/>
									)}
								</Pressable>
							);
						})}
					</View>
				</ScrollView>
			</View>

			{/* Right: Day appointments */}
			<View style={styles.dayPanel}>
				<View style={styles.dayPanelHeader}>
					<Text style={styles.dayPanelTitle}>
						Hoje, {selectedDay} de {MONTHS[currentMonth]}
					</Text>
					<Text style={styles.dayPanelWeekday}>
						{
							[
								"Domingo",
								"Segunda-feira",
								"Terça-feira",
								"Quarta-feira",
								"Quinta-feira",
								"Sexta-feira",
								"Sábado",
							][
								new Date(
									currentYear,
									currentMonth,
									selectedDay,
								).getDay()
							]
						}
					</Text>
				</View>

				<Text style={styles.sectionLabel}>PRÓXIMOS COMPROMISSOS</Text>

				<ScrollView showsVerticalScrollIndicator={false}>
					{loading || isFetching ? (
						<View style={styles.emptyDay}>
							<ActivityIndicator size="large" color={colors.primary} />
							<Text style={styles.emptyDayText}>Carregando agenda...</Text>
						</View>
					) : selectedAppointments.length === 0 ? (
						<View style={styles.emptyDay}>
							<Ionicons
								name="calendar-outline"
								size={36}
								color="#ccc"
							/>
							<Text style={styles.emptyDayText}>
								Nenhum compromisso neste dia
							</Text>
						</View>
					) : (
						selectedAppointments.map((appt) => {
							const clientName = getClientName(appt.clientId);
							const address = getAddressStr(appt.clientId);
							const techName = getTechnicianName(appt.technicianId);
							const formattedTime = new Date(appt.scheduledDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

							return (
								<View key={appt.id} style={styles.appointmentCard}>
									<Text style={styles.appointmentTime}>
										{formattedTime}
									</Text>
									<View style={styles.appointmentBody}>
										<View style={styles.appointmentBadgeRow}>
											<View
												style={[
													styles.badge,
													{
														backgroundColor:
															TYPE_COLORS[appt.type]
																?.bg || "#f5f5f5",
													},
												]}
											>
												<Text
													style={[
														styles.badgeText,
														{
															color: TYPE_COLORS[
																appt.type
															]?.text || "#666",
														},
													]}
												>
													{appt.type.toUpperCase()}
												</Text>
											</View>
											{appt.status && (
												<View
													style={[
														styles.badge,
														{
															backgroundColor:
																STATUS_COLORS[
																	appt.status
																]?.bg || "#f5f5f5",
														},
													]}
												>
													<Text
														style={[
															styles.badgeText,
															{
																color: STATUS_COLORS[
																	appt.status
																]?.text || "#666",
															},
														]}
													>
														{appt.status.toUpperCase()}
													</Text>
												</View>
											)}
										</View>
										<Text style={styles.appointmentTitle}>
											{appt.notes ? `${appt.type} - ${appt.notes}` : `${appt.type} em ${clientName}`}
										</Text>
										<View style={styles.appointmentMeta}>
											<Ionicons
												name="location-outline"
												size={13}
												color={colors.textSecondary}
											/>
											<Text
												style={styles.appointmentMetaText}
											>
												{clientName} • {address}
											</Text>
										</View>
										<View style={styles.appointmentMeta}>
											<Ionicons
												name="person-outline"
												size={13}
												color={colors.textSecondary}
											/>
											<Text
												style={styles.appointmentMetaText}
											>
												{techName}
											</Text>
										</View>
									</View>
								</View>
							);
						})
					)}
				</ScrollView>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		flexDirection: "row",
		gap: 0,
	},
	// Calendar
	calendarSection: {
		flex: 1,
		padding: 24,
		borderRightWidth: 1,
		borderRightColor: "#f0f0f0",
	},
	calendarHeader: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		marginBottom: 20,
		flexWrap: "wrap",
		gap: 12,
	},
	monthNav: {
		flexDirection: "row",
		alignItems: "center",
		gap: 8,
	},
	monthTitle: {
		fontFamily: "Futura",
		fontSize: 22,
		fontWeight: "bold",
		color: colors.textPrimary,
		marginRight: 8,
	},
	navBtn: {
		width: 30,
		height: 30,
		borderRadius: 8,
		backgroundColor: "#f5f5f5",
		justifyContent: "center",
		alignItems: "center",
	},
	todayBtn: {
		paddingHorizontal: 12,
		paddingVertical: 6,
		borderRadius: 8,
		borderWidth: 1,
		borderColor: "#e0e0e0",
		backgroundColor: "#fff",
	},
	todayBtnText: {
		fontFamily: "Futura",
		fontSize: 13,
		color: colors.textPrimary,
	},
	viewModeSwitcher: {
		flexDirection: "row",
		backgroundColor: "#f5f5f5",
		borderRadius: 10,
		padding: 3,
	},
	viewModeBtn: {
		paddingHorizontal: 14,
		paddingVertical: 6,
		borderRadius: 8,
	},
	viewModeBtnActive: {
		backgroundColor: "#fff",
		shadowColor: "#000",
		shadowOpacity: 0.08,
		shadowRadius: 4,
		shadowOffset: { width: 0, height: 1 },
	},
	viewModeBtnText: {
		fontFamily: "Futura",
		fontSize: 13,
		color: colors.textSecondary,
	},
	viewModeBtnTextActive: {
		color: colors.textPrimary,
		fontWeight: "bold",
	},
	weekdayRow: {
		flexDirection: "row",
		marginBottom: 8,
	},
	weekdayText: {
		flex: 1,
		textAlign: "center",
		fontFamily: "Futura",
		fontSize: 12,
		fontWeight: "bold",
		color: colors.textSecondary,
		paddingVertical: 8,
	},
	calendarGrid: {
		flexDirection: "row",
		flexWrap: "wrap",
	},
	dayCell: {
		width: `${100 / 7}%`,
		aspectRatio: 1.2,
		justifyContent: "center",
		alignItems: "center",
		borderRadius: 10,
		gap: 4,
	},
	dayCellSelected: {
		backgroundColor: colors.secondary,
	},
	dayCellToday: {
		backgroundColor: "#ef790c22",
	},
	dayText: {
		fontFamily: "Futura",
		fontSize: 14,
		color: colors.textPrimary,
	},
	dayTextSelected: {
		color: "#fff",
		fontWeight: "bold",
	},
	dayTextToday: {
		color: colors.primary,
		fontWeight: "bold",
	},
	eventDot: {
		width: 5,
		height: 5,
		borderRadius: 3,
		backgroundColor: colors.primary,
	},
	// Day Panel
	dayPanel: {
		width: 280,
		padding: 20,
		backgroundColor: "#fafafa",
	},
	dayPanelHeader: {
		marginBottom: 20,
	},
	dayPanelTitle: {
		fontFamily: "Futura",
		fontSize: 16,
		fontWeight: "bold",
		color: colors.textPrimary,
	},
	dayPanelWeekday: {
		fontFamily: "Futura",
		fontSize: 13,
		color: colors.textSecondary,
		marginTop: 2,
	},
	sectionLabel: {
		fontFamily: "Futura",
		fontSize: 11,
		fontWeight: "bold",
		color: colors.textSecondary,
		letterSpacing: 1,
		marginBottom: 14,
	},
	emptyDay: {
		alignItems: "center",
		paddingTop: 40,
		gap: 12,
	},
	emptyDayText: {
		fontFamily: "Futura",
		fontSize: 14,
		color: "#bbb",
		textAlign: "center",
	},
	appointmentCard: {
		flexDirection: "row",
		gap: 12,
		marginBottom: 16,
		backgroundColor: "#fff",
		borderRadius: 12,
		padding: 12,
		borderWidth: 1,
		borderColor: "#f0f0f0",
		shadowColor: "#000",
		shadowOpacity: 0.04,
		shadowRadius: 4,
		shadowOffset: { width: 0, height: 1 },
	},
	appointmentTime: {
		fontFamily: "Futura",
		fontSize: 13,
		fontWeight: "bold",
		color: colors.textSecondary,
		width: 44,
		paddingTop: 2,
	},
	appointmentBody: {
		flex: 1,
		gap: 6,
	},
	appointmentBadgeRow: {
		flexDirection: "row",
		gap: 6,
		flexWrap: "wrap",
	},
	badge: {
		paddingHorizontal: 7,
		paddingVertical: 2,
		borderRadius: 4,
	},
	badgeText: {
		fontFamily: "Futura",
		fontSize: 9,
		fontWeight: "bold",
	},
	appointmentTitle: {
		fontFamily: "Futura",
		fontSize: 13,
		fontWeight: "bold",
		color: colors.textPrimary,
	},
	appointmentMeta: {
		flexDirection: "row",
		alignItems: "center",
		gap: 4,
	},
	appointmentMetaText: {
		fontFamily: "Futura",
		fontSize: 12,
		color: colors.textSecondary,
		flex: 1,
	},
});
