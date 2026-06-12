import { Text, View, TextInput, ScrollView } from "react-native";
import { Machine } from "@/assets/types/Machine";
import * as styles from "@/assets/styles/stylesheets";
import { StatBox, StatusBox } from "@/components/common/Statbox";
import { formatDisplayDate } from "@/utils/utils";

interface Props {
	machine: Machine;
	isEditing: boolean;
	handleInputChange: (field: keyof Machine, value: any) => void;
	contracts: { id: string; name: string }[];
	fragrances: { id: string; name: string }[];
}

export function MachineModalContent({
	machine,
	isEditing,
	handleInputChange,
	contracts,
	fragrances,
}: Props) {
	return (
		<ScrollView style={{ width: "100%" }} contentContainerStyle={{ width: "100%" }}>
			{/* Name */}
			{isEditing ? (
				<View style={{ marginBottom: 20 }}>
					<TextInput
						style={[
							styles.modalPage.title,
							{
								borderBottomWidth: 1,
								borderColor: "#ddd",
								paddingBottom: 0,
							},
						]}
						value={machine.name}
						onChangeText={(text) => handleInputChange("name", text)}
					/>
				</View>
			) : (
				<View style={{ marginBottom: 20 }}>
					<Text style={[styles.modalPage.title, { marginBottom: 0 }]}>
						{machine.name}
					</Text>
				</View>
			)}

			<View style={styles.modalPage.statsGrid}>
				{/* Model */}
				<StatBox
					isEditing={isEditing}
					onChange={(text) => handleInputChange("model", text)}
					direction="vertical"
					label="modelo"
					value={machine.model}
				/>

				{/* Price */}
				<StatBox
					isEditing={isEditing}
					onChange={(text) => handleInputChange("price", text)}
					isNumeric={true}
					direction="vertical"
					label="preço"
					value={machine.price}
					valueColor={"#4caf50"}
					unit="R$"
					prefix="R$ "
				/>

				{/* Contract */}
				<StatBox
					type="select"
					isEditing={isEditing}
					onChange={(text) => handleInputChange("contractId", text)}
					direction="vertical"
					label="contrato"
					value={machine.contractId || ""}
					options={[
						{ label: "Sem contrato / Estoque", value: "" },
						...contracts.map((c) => ({
							label: c.name,
							value: c.id,
						})),
					]}
				/>

				{/* Fragrance */}
				<StatBox
					type="select"
					isEditing={isEditing}
					onChange={(text) => handleInputChange("fragranceId", text)}
					direction="vertical"
					label="fragrância"
					value={machine.fragranceId || ""}
					options={[
						{ label: "Nenhuma fragrância", value: "" },
						...fragrances.map((c) => ({
							label: c.name,
							value: c.id,
						})),
					]}
				/>
			</View>

			{/* Description */}
			<StatBox
				isEditing={isEditing}
				onChange={(text) => handleInputChange("observations", text)}
				direction="horizontal"
				isMultiline
				label="descrição"
				value={machine.observations || ""}
			/>

			{/* isPaid */}
			<StatBox
				type="select"
				isEditing={isEditing}
				onChange={(value) =>
					handleInputChange("isPaid", value === "true")
				}
				direction="horizontal"
				label="está paga?"
				value={machine.isPaid ? "true" : "false"}
				options={[
					{ label: "Sim", value: "true" },
					{ label: "Não", value: "false" },
				]}
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
				{/* Status */}
				<View
					style={{
						flexDirection: "row",
						alignItems: "flex-start",
						alignSelf: "center",
						flex: 1,
					}}
				>
				<StatusBox
					isEditing={isEditing}
					value={machine.status}
					onChange={(text) => handleInputChange("status", text)}
					options={[
						{ label: "Disponível", value: "Disponível" },
						{ label: "Contratada", value: "Contratada" },
						{ label: "Em Manutenção", value: "Em Manutenção" },
						{ label: "Defeituosa", value: "Defeituosa" },
					]}
				/>
				</View>

				{/* Date Information */}
				<View style={{ alignSelf: "center" }}>
					<Text style={styles.modalPage.dateText}>
						Cadastrada em: {formatDisplayDate(machine.created_at)}
					</Text>
				</View>
			</View>
		</ScrollView>
	);
}
