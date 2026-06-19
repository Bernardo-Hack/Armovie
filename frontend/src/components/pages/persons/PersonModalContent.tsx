import { Text, View, TextInput, ScrollView, StyleSheet } from "react-native";
import { Person } from "@/assets/types/ms-client/Person";
import { text } from "@/assets/styles/stylesheets";
import { StatBox, StatusBox } from "@/components/common/Statbox";
import { formatDisplayDate } from "@/utils/utils";

interface Props {
	person: Person;
	isEditing: boolean;
	handleInputChange: (field: keyof Person, value: any) => void;
	clients: { id: string; name: string }[];
}

export function PersonModalContent({
	person,
	isEditing,
	handleInputChange,
	clients,
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
						value={person.fullName}
						onChangeText={(text) =>
							handleInputChange("fullName", text)
						}
						placeholder="Nome Completo"
					/>
				</View>
			) : (
				<View style={{ marginBottom: 20 }}>
					<Text style={[styles.title, { marginBottom: 0 }]}>
						{person.fullName}
					</Text>
				</View>
			)}

			{/* Client */}
			<StatBox
				type="select"
				isEditing={isEditing}
				onChange={(value) =>
					handleInputChange("clientId", value as string)
				}
				direction="horizontal"
				label="Cliente Vinculado"
				value={person.clientId}
				options={[
					{ label: "Selecione um cliente...", value: "" },
					...clients.map((c) => ({ label: c.name, value: c.id })),
				]}
			/>

			{/* Almost all data */}
			<View style={styles.statsGrid}>
				<StatBox
					isEditing={isEditing}
					onChange={(text) => handleInputChange("document", text)}
					direction="vertical"
					label="CPF/RG"
					value={person.document}
				/>
				<StatBox
					isEditing={isEditing}
					onChange={(text) => handleInputChange("birthday", text)}
					direction="vertical"
					label="Data de Nascimento"
					value={
						person.birthday instanceof Date
							? person.birthday.toISOString().split("T")[0]
							: person.birthday
								? String(person.birthday).split("T")[0]
								: ""
					}
				/>
				<StatBox
					isEditing={isEditing}
					onChange={(text) => handleInputChange("civilState", text)}
					direction="vertical"
					label="Estado Civil"
					value={person.civilState}
				/>
				<StatBox
					isEditing={isEditing}
					onChange={(text) => handleInputChange("nationality", text)}
					direction="vertical"
					label="Nacionalidade"
					value={person.nationality}
				/>
				<StatBox
					isEditing={isEditing}
					onChange={(text) => handleInputChange("email", text)}
					direction="vertical"
					label="Email"
					value={person.email}
				/>
				<StatBox
					isEditing={isEditing}
					onChange={(value) =>
						handleInputChange("doesSign", value === "true")
					}
					direction="vertical"
					type="select"
					label="Assina?"
					value={person.doesSign ? "true" : "false"}
					options={[
						{ label: "Sim", value: "true" },
						{ label: "Não", value: "false" },
					]}
				/>
				<StatBox
					isEditing={isEditing}
					onChange={(value) =>
						handleInputChange("doesRepresent", value === "true")
					}
					direction="vertical"
					type="select"
					label="É o representante?"
					value={person.doesRepresent ? "true" : "false"}
					options={[
						{ label: "Sim", value: "true" },
						{ label: "Não", value: "false" },
					]}
				/>
				<StatBox
					isEditing={isEditing}
					onChange={(text) => handleInputChange("role", text)}
					direction="vertical"
					label="Posição"
					value={person.role}
				/>
			</View>

			{/* Observations */}
			<StatBox
				isEditing={isEditing}
				onChange={(text) => handleInputChange("observations", text)}
				direction="horizontal"
				label="Observações"
				value={person.observations || ""}
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
				{/* Date Information */}
				<View style={{ flexDirection: "column", gap: 5 }}>
					<Text style={styles.dateText}>
						Criado em: {formatDisplayDate(person.createdAt)}
					</Text>
					<Text style={styles.dateText}>
						Atualizado em: {formatDisplayDate(person.updatedAt)}
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
	dateText: {
		...text.subtitle,
		color: "#57606a",
		fontSize: 12,
	},
});
