import { useState } from "react";
import { View, Text, StyleSheet, Pressable, ScrollView } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { colors, page } from "@/assets/styles/stylesheets";
import Header from "@/components/common/Header";

import { ScheduleGeneralTab } from "@/components/pages/agenda/ScheduleGeneralTab";
import { PlanejamentoRotaTab } from "@/components/pages/agenda/RoutePlaningTab";
import { ExecucaoRotaTab } from "@/components/pages/agenda/RouteExecutionTab";
import { VisitasTecnicasTab } from "@/components/pages/agenda/ScheduleVisitsTab";
import { ScheduleProvider } from "@/contexts/ScheduleContext";

type TabId = "agenda" | "planejamento" | "execucao" | "visitas";

type Tab = {
	id: TabId;
	label: string;
	icon: any;
};

const TABS: Tab[] = [
	{ id: "agenda", label: "Agenda Geral", icon: "calendar-outline" },
	{ id: "planejamento", label: "Planejamento de Rota", icon: "map-outline" },
	{ id: "execucao", label: "Execução da Rota", icon: "navigate-outline" },
	{ id: "visitas", label: "Visitas Técnicas", icon: "build-outline" },
];

export default function ScheduleScreen() {
	const [activeTab, setActiveTab] = useState<TabId>("agenda");

	const renderTab = () => {
		switch (activeTab) {
			case "agenda":
				return <ScheduleGeneralTab />;
			case "planejamento":
				return <PlanejamentoRotaTab />;
			case "execucao":
				return <ExecucaoRotaTab />;
			case "visitas":
				return <VisitasTecnicasTab />;
		}
	};

	return (
		<ScheduleProvider>
			<View style={page.background}>
				{/* Page Header */}
			<Header
				pageName="Agenda"
				subtitle="Gestão de manutenções e rotas técnicas"
				secondButtonLabel="Novo Evento"
				secondButtonIcon="add"
				setIsFirstModalVisible={() => {}}
			/>

			{/* Tab Bar */}
			<View style={styles.tabBarWrapper}>
				<ScrollView horizontal showsHorizontalScrollIndicator={false}>
					<View style={styles.tabBar}>
						{TABS.map((tab) => {
							const active = activeTab === tab.id;
							return (
								<Pressable
									key={tab.id}
									style={[
										styles.tab,
										active && styles.tabActive,
									]}
									onPress={() => setActiveTab(tab.id)}
								>
									<Ionicons
										name={tab.icon}
										size={16}
										color={
											active
												? "#fff"
												: colors.textSecondary
										}
									/>
									<Text
										style={[
											styles.tabLabel,
											active && styles.tabLabelActive,
										]}
									>
										{tab.label}
									</Text>
								</Pressable>
							);
						})}
					</View>
				</ScrollView>
			</View>

				{/* Tab Content */}
				<View style={styles.tabContent}>{renderTab()}</View>
			</View>
		</ScheduleProvider>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: colors.background,
	},
	// Tab Bar
	tabBarWrapper: {
		width: "100%",
		marginBottom: 4,
	},
	tabBar: {
		flexDirection: "row",
		backgroundColor: "#fff",
		borderRadius: 14,
		padding: 5,
		gap: 4,
		borderWidth: 1,
		borderColor: "#f0f0f0",
		alignSelf: "flex-start",
	},
	tab: {
		flexDirection: "row",
		alignItems: "center",
		gap: 8,
		paddingHorizontal: 16,
		paddingVertical: 9,
		borderRadius: 10,
	},
	tabActive: {
		backgroundColor: colors.secondary,
	},
	tabLabel: {
		fontFamily: "Futura",
		fontSize: 13,
		color: colors.textSecondary,
		fontWeight: "600",
	},
	tabLabelActive: {
		color: "#fff",
		fontWeight: "bold",
	},
	// Content
	tabContent: {
		flex: 1,
		width: "100%",
		backgroundColor: "#fff",
		borderRadius: 16,
		borderWidth: 1,
		borderColor: "#f0f0f0",
		overflow: "hidden",
	},
});
