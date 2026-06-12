import { Text, View, TextInput, ScrollView } from "react-native";
import { Contract } from "@/assets/types/Contract";
import * as styles from "@/assets/styles/stylesheets";
import { StatBox, StatusBox } from "@/components/common/Statbox";

interface Option {
	id: string;
	name: string;
}

interface Props {
	contract: Contract;
	isEditing: boolean;
	handleInputChange: (field: keyof Contract, value: any) => void;
	clients: Option[];
	addresses: Option[];
	templates: Option[];
	plans: Option[];
	fragrances: Option[];
}

export function ContractModalContent({
	contract,
	isEditing,
	handleInputChange,
	clients,
	addresses,
	templates,
	plans,
	fragrances,
}: Props) {
	return (
		<ScrollView contentContainerStyle={{ width: "100%" }}>
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
						value={contract.name}
						onChangeText={(text) => handleInputChange("name", text)}
						placeholder="Nome do Contrato"
					/>
				</View>
			) : (
				<View style={{ marginBottom: 20 }}>
					<Text style={[styles.modalPage.title, { marginBottom: 0 }]}>
						{contract.name}
					</Text>
				</View>
			)}

			{/* Cliente */}
			<StatBox
				type="select"
				isEditing={isEditing}
				onChange={(value) => handleInputChange("clientId", value as string)}
				direction="horizontal"
				label="Cliente"
				value={contract.clientId}
				options={[
					{ label: "Selecione um cliente...", value: "" },
					...clients.map((c) => ({ label: c.name, value: c.id }))
				]}
			/>

			{/* All other data */}
			<View style={styles.modalPage.statsGrid}>
				<StatBox
					type="select"
					isEditing={isEditing}
					onChange={(text) => handleInputChange("type", text)}
					direction="vertical"
					label="Tipo de Contrato"
					value={contract.type}
					options={[
						{ label: "Comodato", value: "Comodato" },
						{ label: "Locação", value: "Locação" },
						{ label: "Venda", value: "Venda" }
					]}
				/>
				<StatBox
					type="select"
					isEditing={isEditing}
					onChange={(text) => handleInputChange("planId", text)}
					direction="vertical"
					label="Plano"
					value={contract.planId}
					options={[
						{ label: "Selecione...", value: "" },
						...plans.map((p) => ({ label: p.name, value: p.id }))
					]}
				/>
				<StatBox
					type="select"
					isEditing={isEditing}
					onChange={(text) => handleInputChange("templateId", text)}
					direction="vertical"
					label="Template"
					value={contract.templateId}
					options={[
						{ label: "Selecione...", value: "" },
						...templates.map((t) => ({ label: t.name, value: t.id }))
					]}
				/>
				<StatBox
					type="select"
					isEditing={isEditing}
					onChange={(text) => handleInputChange("addressId", text)}
					direction="vertical"
					label="Endereço"
					value={contract.addressId}
					options={[
						{ label: "Selecione...", value: "" },
						...addresses.map((a) => ({ label: a.name, value: a.id }))
					]}
				/>
				<StatBox
					type="select"
					isEditing={isEditing}
					onChange={(text) => handleInputChange("fragrance", text)}
					direction="vertical"
					label="Fragrância"
					value={contract.fragrance}
					options={[
						{ label: "Selecione...", value: "" },
						...fragrances.map((f) => ({ label: f.name, value: f.id }))
					]}
				/>
				<StatBox
					isEditing={isEditing}
					onChange={(text) => handleInputChange("machines", text)}
					direction="vertical"
					label="Máquinas"
					isNumeric
					value={contract.machines}
				/>
				<StatBox
					isEditing={isEditing}
					onChange={(text) => handleInputChange("duration", text)}
					direction="vertical"
					label="Duração (Dias)"
					isNumeric
					value={contract.duration}
				/>
				<StatBox
					isEditing={isEditing}
					onChange={(text) => handleInputChange("monthlyValue", text)}
					direction="vertical"
					label="Valor Mensal"
					isNumeric
					prefix="R$ "
					value={contract.monthlyValue}
				/>
				<StatBox
					isEditing={isEditing}
					onChange={(text) => handleInputChange("paymentDay", text)}
					direction="vertical"
					label="Dia de Pagamento"
					isNumeric
					value={contract.paymentDay}
				/>
			</View>

			{/* Observations */}
			<StatBox
				isEditing={isEditing}
				onChange={(text) => handleInputChange("observations", text)}
				direction="vertical"
				isMultiline
				label="Observações"
				value={contract.observations || ""}
			/>

			{/* Status */}
			<View style={{ marginTop: 15 }}>
				<StatusBox
					isEditing={isEditing}
					value={contract.status}
					onChange={(text) => handleInputChange("status", text)}
				/>
			</View>
		</ScrollView>
	);
}
