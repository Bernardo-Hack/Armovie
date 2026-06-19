import {
	View,
	Text,
	ScrollView,
	StyleSheet,
	ActivityIndicator,
	Pressable,
} from "react-native";
import { useEffect, useState } from "react";
import { Toast } from "react-native-toast-message/lib/src/Toast";
import Ionicons from "@expo/vector-icons/Ionicons";

import { colors, text as globalText } from "@/assets/styles/stylesheets";
import Header from "@/components/common/Header";
import { Fragrance, initialFragranceState } from "@/assets/types/ms-item/Fragrance";
import { fragranceService, FragranceData } from "@/services/fragranceService";
import { GenericCreateModal } from "@/components/common/GenericCreateModal";
import { StatBox } from "@/components/common/Statbox";

// ─── Family color/icon map ────────────────────────────────────────────────────

const FAMILY_CONFIG: Record<
	string,
	{ color: string; bg: string; icon: string }
> = {
	Frutal: { color: "#ef790c", bg: "#fff3e8", icon: "flame-outline" },
	Amadeirada: { color: "#8B5E3C", bg: "#f5efe8", icon: "leaf-outline" },
	Herbal: { color: "#4caf50", bg: "#e8f5e9", icon: "flower-outline" },
	Cítrica: { color: "#4caf50", bg: "#e8f5e9", icon: "color-palette-outline" },
	Floral: { color: "#e91e8c", bg: "#fce4f4", icon: "rose-outline" },
	Aquática: { color: "#1e88e5", bg: "#e3f2fd", icon: "water-outline" },
	Oriental: { color: "#9c27b0", bg: "#f3e5f5", icon: "star-outline" },
	Gourmand: { color: "#ff7043", bg: "#fbe9e7", icon: "ice-cream-outline" },
};

function getFamilyConfig(family: string) {
	return (
		FAMILY_CONFIG[family] ?? {
			color: colors.textSecondary,
			bg: colors.overlayBackground,
			icon: "flask-outline",
		}
	);
}



// ─── Page ─────────────────────────────────────────────────────────────────────

export default function FragrancesPage() {
	const [fragrances, setFragrances] = useState<Fragrance[]>([]);
	const [loading, setLoading] = useState(true);
	const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);

	const fetchFragrances = async () => {
		setLoading(true);
		try {
			const data = await fragranceService.getAllFragrances();
			setFragrances(data);
		} catch (error: any) {
			if (
				error.message === "Not Found" ||
				error.message?.includes("404")
			) {
				setFragrances([]);
			} else {
				Toast.show({
					type: "error",
					text1: "Erro ao carregar fragrâncias",
					text2: error.message,
				});
			}
		} finally {
			setLoading(false);
		}
	};

	const handleCreate = async (data: Fragrance) => {
		try {
			const { id, createdAt, updatedAt, ...payload } = data;
			await fragranceService.createFragrance(payload as FragranceData);
			Toast.show({
				type: "success",
				text1: "Fragrância criada com sucesso!",
			});
			setIsCreateModalVisible(false);
			fetchFragrances();
		} catch (error: any) {
			Toast.show({
				type: "error",
				text1: "Erro ao criar fragrância",
				text2: error.message,
			});
		}
	};

	const handleDelete = async (id: string) => {
		try {
			await fragranceService.deleteFragrance(id);
			Toast.show({ type: "success", text1: "Fragrância excluída!" });
			fetchFragrances();
		} catch (error: any) {
			Toast.show({
				type: "error",
				text1: "Erro ao excluir fragrância",
				text2: error.message,
			});
		}
	};

	useEffect(() => {
		fetchFragrances();
	}, []);

	return (
		<View style={styles.page}>
			{/* Header */}
			<Header
				pageName="Fragrâncias"
				subtitle="Visão geral das essências cadastradas no estoque"
				fetchItems={fetchFragrances}
				setIsCreateModalVisible={setIsCreateModalVisible}
			/>

			{/* Content */}
			{loading ? (
				<View style={styles.centered}>
					<ActivityIndicator size="large" color={colors.primary} />
				</View>
			) : fragrances.length === 0 ? (
				<View style={styles.centered}>
					<Ionicons
						name="flask-outline"
						size={64}
						color={colors.textSecondary}
						style={{ opacity: 0.3 }}
					/>
					<Text
						style={[
							globalText.title,
							{ marginTop: 16, fontSize: 20 },
						]}
					>
						Nenhuma fragrância cadastrada.
					</Text>
				</View>
			) : (
				<ScrollView
					contentContainerStyle={styles.grid}
					showsVerticalScrollIndicator={false}
				>
					{fragrances.map((fragrance) => (
						<FragranceCard
							key={fragrance.id}
							fragrance={fragrance}
							onDelete={() => handleDelete(fragrance.id)}
						/>
					))}
				</ScrollView>
			)}

			{/* Create Modal */}
			<GenericCreateModal
				initialState={initialFragranceState}
				visible={isCreateModalVisible}
				onClose={() => setIsCreateModalVisible(false)}
				onSave={handleCreate}
				renderContent={(item, handleInputChange) => (
					<FragranceFormContent
						fragrance={item as Fragrance}
						handleInputChange={handleInputChange}
					/>
				)}
			/>
		</View>
	);
}

// ─── Fragrance Card ───────────────────────────────────────────────────────────

function FragranceCard({
	fragrance,
	onDelete,
}: {
	fragrance: Fragrance;
	onDelete: () => void;
}) {
	const cfg = getFamilyConfig(fragrance.family);
	const bottles = Math.floor(fragrance.stock / 100);

	return (
		<View style={[styles.card, { backgroundColor: cfg.bg }]}>
			{/* Header row */}
			<View style={styles.cardTop}>
				<Ionicons name={cfg.icon as any} size={22} color={cfg.color} />
				<View style={{ flex: 1 }} />
				<Pressable
					onPress={onDelete}
					style={styles.deleteBtn}
					hitSlop={8}
				>
					<Ionicons name="trash-outline" size={14} color="#f44336" />
				</Pressable>
			</View>

			{/* Name */}
			<Text style={styles.cardName}>{fragrance.name.toUpperCase()}</Text>

			{/* Family badge */}
			<View style={styles.familyRow}>
				<View
					style={[styles.familyDot, { backgroundColor: cfg.color }]}
				/>
				<Text style={[styles.familyText, { color: cfg.color }]}>
					{fragrance.family}
				</Text>
			</View>

			{/* Divider */}
			<View style={styles.divider} />

			{/* Stats */}
			<View style={styles.statsGrid}>
				<StatRow
					label="Estoque atual"
					value={`${fragrance.stock} ml`}
					highlight={fragrance.stock === 0}
					highlightColor={cfg.color}
				/>
				<StatRow
					label="Frascos (100ml)"
					value={`${bottles} un.`}
					highlight={bottles === 0}
					highlightColor={cfg.color}
				/>
				<StatRow
					label="Custo unitário"
					value={`R$ ${fragrance.unitCost.toFixed(2)}`}
					highlight={false}
					highlightColor={cfg.color}
				/>
				<StatRow
					label="Fornecedor"
					value={fragrance.supplier || "—"}
					highlight={false}
					highlightColor={cfg.color}
				/>
			</View>
		</View>
	);
}

function StatRow({
	label,
	value,
	highlight,
	highlightColor,
}: {
	label: string;
	value: string;
	highlight: boolean;
	highlightColor: string;
}) {
	return (
		<View style={styles.statRow}>
			<Text style={styles.statLabel}>{label}</Text>
			<Text
				style={[
					styles.statValue,
					highlight && { color: highlightColor, fontWeight: "bold" },
				]}
			>
				{value}
			</Text>
		</View>
	);
}

// ─── Form content for create modal ───────────────────────────────────────────

function FragranceFormContent({
	fragrance,
	handleInputChange,
}: {
	fragrance: Fragrance;
	handleInputChange: (field: keyof Fragrance, value: any) => void;
}) {
	const FAMILIES = [
		"Frutal",
		"Amadeirada",
		"Herbal",
		"Cítrica",
		"Floral",
		"Aquática",
		"Oriental",
		"Gourmand",
	];

	return (
		<View style={{ gap: 8, width: "100%" }}>
			<StatBox
				isEditing
				direction="horizontal"
				label="Nome"
				value={fragrance.name}
				onChange={(v) => handleInputChange("name", v)}
			/>
			<StatBox
				isEditing
				type="select"
				direction="horizontal"
				label="Família"
				value={fragrance.family}
				onChange={(v) => handleInputChange("family", v)}
				options={FAMILIES.map((f) => ({ label: f, value: f }))}
			/>
			<StatBox
				isEditing
				direction="horizontal"
				label="Descrição"
				value={fragrance.description}
				onChange={(v) => handleInputChange("description", v)}
				isMultiline
			/>
			<StatBox
				isEditing
				direction="horizontal"
				label="Estoque (ml)"
				value={String(fragrance.stock)}
				keyboardType="numeric"
				onChange={(v) => handleInputChange("stock", Number(v))}
			/>
			<StatBox
				isEditing
				direction="horizontal"
				label="Custo unitário (R$)"
				value={String(fragrance.unitCost)}
				keyboardType="numeric"
				onChange={(v) => handleInputChange("unitCost", Number(v))}
			/>
			<StatBox
				isEditing
				direction="horizontal"
				label="Fornecedor"
				value={fragrance.supplier}
				onChange={(v) => handleInputChange("supplier", v)}
			/>
		</View>
	);
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
	page: {
		flex: 1,
		backgroundColor: colors.background,
		alignItems: "center",
		paddingHorizontal: 20,
		paddingVertical: 50,
		gap: 30,
	},
	centered: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		gap: 12,
	},
	grid: {
		flexDirection: "row",
		flexWrap: "wrap",
		gap: 16,
		justifyContent: "flex-start",
		paddingBottom: 40,
	},

	// Card
	card: {
		width: 240,
		borderRadius: 16,
		padding: 18,
		gap: 8,
		boxShadow: "0px 2px 8px rgba(0,0,0,0.07)",
	} as any,
	cardTop: {
		flexDirection: "row",
		alignItems: "center",
	},
	cardName: {
		fontFamily: "Futura",
		fontWeight: "bold",
		fontSize: 16,
		color: colors.textPrimary,
		marginTop: 8,
	},
	familyRow: {
		flexDirection: "row",
		alignItems: "center",
		gap: 6,
	},
	familyDot: {
		width: 8,
		height: 8,
		borderRadius: 4,
	},
	familyText: {
		fontFamily: "Futura",
		fontSize: 13,
		fontWeight: "bold",
	},
	divider: {
		height: 1,
		backgroundColor: "rgba(0,0,0,0.08)",
		marginVertical: 6,
	},
	statsGrid: {
		gap: 4,
	},
	statRow: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
	},
	statLabel: {
		fontFamily: "Futura",
		fontSize: 12,
		color: colors.textSecondary,
	},
	statValue: {
		fontFamily: "Futura",
		fontSize: 13,
		color: colors.textPrimary,
	},
	deleteBtn: {
		padding: 4,
	},
});
