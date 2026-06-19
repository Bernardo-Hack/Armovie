import { Text, View, TextInput, ScrollView, StyleSheet } from "react-native";
import { Client } from "@/assets/types/ms-client/Client";
import { text } from "@/assets/styles/stylesheets";
import { StatBox, StatusBox } from "@/components/common/Statbox";
import { formatDisplayDate } from "@/utils/utils";

interface Props {
	client: Client;
	isEditing: boolean;
	handleInputChange: (field: keyof Client, value: any) => void;
	sellers: { id: string; name: string }[];
}

export function ClientDetailsContent({
	client,
	isEditing,
	handleInputChange,
	sellers,
}: Props) {
	return (
		<ScrollView contentContainerStyle={{ width: "100%" }}>
			{/* Name */}
			{isEditing ? (
				<View style={{ marginBottom: 20 }}>
					<TextInput
						style={[
							styles.title,
							{
								borderBottomWidth: 1,
								borderColor: "#ddd",
								paddingBottom: 0,
							},
						]}
						value={client.fullName}
						onChangeText={(text) =>
							handleInputChange("fullName", text)
						}
						placeholder="Razão Social / Nome Completo"
					/>
					<TextInput
						style={[
							text.body,
							{
								borderBottomWidth: 1,
								borderColor: "#ddd",
								marginTop: 10,
							},
						]}
						value={client.fantasyName || ""}
						onChangeText={(text) =>
							handleInputChange("fantasyName", text)
						}
						placeholder="Nome Fantasia (Opcional)"
					/>
				</View>
			) : (
				<View style={{ marginBottom: 20 }}>
					<Text style={[styles.title, { marginBottom: 0 }]}>
						{client.fullName}
					</Text>
					{client.fantasyName && (
						<Text style={[text.body, { color: "#666" }]}>
							{client.fantasyName}
						</Text>
					)}
				</View>
			)}

			{/* Seller */}
			<StatBox
				type="select"
				isEditing={isEditing}
				onChange={(value) =>
					handleInputChange("sellerId", value as string)
				}
				direction="horizontal"
				label="Vendedor"
				value={client.sellerId}
				options={[
					{ label: "Selecione um vendedor...", value: "" },
					...sellers.map((s) => ({
						label: s.name,
						value: s.id,
					})),
				]}
			/>

			{/* Almost all data */}
			<View style={styles.statsGrid}>
				<StatBox
					isEditing={isEditing}
					onChange={(text) => handleInputChange("document", text)}
					direction="vertical"
					label="Documento (CNPJ/CPF)"
					value={client.document}
				/>
				<StatBox
					isEditing={isEditing}
					onChange={(text) => handleInputChange("municipalID", text)}
					direction="vertical"
					label="Inscrição Municipal"
					value={client.municipalID || ""}
				/>
				<StatBox
					isEditing={isEditing}
					onChange={(text) => handleInputChange("stateID", text)}
					direction="vertical"
					label="Inscrição Estadual"
					value={client.stateID || ""}
				/>
				<StatBox
					isEditing={isEditing}
					onChange={(text) =>
						handleInputChange("fieldOfActivity", text)
					}
					direction="vertical"
					label="Ramo de Atividade"
					value={client.fieldOfActivity || ""}
				/>
				<StatBox
					isEditing={isEditing}
					onChange={(text) =>
						handleInputChange("financesEmail", text)
					}
					direction="vertical"
					label="Email Financeiro"
					value={client.financesEmail}
				/>
				<StatBox
					isEditing={isEditing}
					onChange={(text) => handleInputChange("alertsEmail", text)}
					direction="vertical"
					label="Email de Alertas"
					value={client.alertsEmail || ""}
				/>
				<StatBox
					isEditing={isEditing}
					onChange={(text) => handleInputChange("phone", text)}
					direction="vertical"
					label="Telefone"
					value={client.phone}
				/>
				<StatBox
					isEditing={isEditing}
					onChange={(text) => handleInputChange("whatsapp", text)}
					direction="vertical"
					label="WhatsApp"
					value={client.whatsapp}
				/>
				<StatBox
					isEditing={isEditing}
					onChange={(text) => handleInputChange("foundingDate", text)}
					direction="vertical"
					label="Data de Fundação"
					value={
						client.foundingDate instanceof Date
							? client.foundingDate.toISOString().split("T")[0]
							: client.foundingDate
								? String(client.foundingDate).split("T")[0]
								: ""
					}
				/>
				<StatBox
					type="select"
					isEditing={isEditing}
					onChange={(value) =>
						handleInputChange("hasIss", value === "true")
					}
					direction="vertical"
					label="Retém ISS?"
					value={client.hasIss ? "true" : "false"}
					options={[
						{ label: "Sim", value: "true" },
						{ label: "Não", value: "false" },
					]}
				/>
			</View>

			{/* Observations */}
			<StatBox
				isEditing={isEditing}
				onChange={(text) => handleInputChange("observations", text)}
				direction="horizontal"
				label="Observações"
				value={client.observations || ""}
			/>

			{/* Status and Date Information */}
			<View
				style={{
					flexDirection: "row",
					gap: 10,
					marginTop: 15,
					justifyContent: "space-between",
				}}
			>
				{/* Header with category and status tags, and close button */}
				<View
					style={{
						flexDirection: "row",
						alignItems: "center",
					}}
				>
					<StatusBox
						isEditing={isEditing}
						value={client.status}
						onChange={(text) => handleInputChange("status", text)}
						options={[
							{ label: "Em Análise", value: "Em Análise" },
							{ label: "Ativo", value: "Ativo" },
							{ label: "Inativo", value: "Inativo" },
						]}
					/>
				</View>

				{/* Date Information */}
				<View style={{ flexDirection: "column", gap: 5 }}>
					<Text style={styles.dateText}>
						Criado em: {formatDisplayDate(client.createdAt)}
					</Text>
					<Text style={styles.dateText}>
						Atualizado em: {formatDisplayDate(client.updatedAt)}
					</Text>
				</View>
			</View>
		</ScrollView>
	);
}

const styles = StyleSheet.create({
	title: {
		...text.title,
		fontSize: 28,
	},
	statsGrid: {
		flexDirection: "row",
		flexWrap: "wrap",
		justifyContent: "space-between",
		marginTop: 20,
		marginBottom: 20,
	},
	dateInfo: {
		marginTop: 20,
		paddingTop: 15,
		borderTopWidth: 1,
		borderTopColor: "#d8dee4",
		alignItems: "center",
	},
	dateText: {
		...text.subtitle,
		color: "#57606a",
		fontSize: 12,
	},
});
