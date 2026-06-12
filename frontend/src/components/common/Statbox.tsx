import { View, Text, TextInput, Platform } from "react-native";
import * as styles from "@/assets/styles/stylesheets";
import { Picker } from "@react-native-picker/picker";

interface Props {
	isEditing: boolean;
	onChange?: (value: string | number) => void;
	direction?: "vertical" | "horizontal";
	type?: "text" | "select";
	isNumeric?: boolean;
	isMultiline?: boolean;
	label?: string;
	value: string | number;
	options?: Array<{ label: string; value: string | number }>;
	valueColor?: string;
	unit?: string;
	prefix?: string;
}

export function StatBox({
	isEditing,
	onChange,
	direction = "horizontal",
	type = "text",
	isNumeric = false,
	isMultiline = false,
	label,
	value,
	options,
	valueColor,
	unit,
	prefix,
}: Props) {
	const containerStyle =
		direction === "horizontal"
			? styles.modalPage.statLine
			: styles.modalPage.statBox;

	const selectAlign = direction === "horizontal" ? "flex-end" : "flex-start";

	const textAlignment = direction === "horizontal" ? "right" : "left";

	const handleTextChange = (text: string) => {
		if (onChange) {
			if (isNumeric) {
				onChange(parseFloat(text) || 0);
			} else {
				onChange(text);
			}
		}
	};

	return (
		<View style={containerStyle}>
			{label && (
				<Text style={styles.text.statLabel}>{label.toUpperCase()}</Text>
			)}
			{isEditing && onChange ? (
				type === "select" && options ? (
					<View style={{ flex: 1 }}>
						<Picker
							selectedValue={value}
							onValueChange={onChange}
							style={[
								styles.text.statValue,
								{
									color:
										valueColor ||
										styles.text.statValue.color,
									fontWeight: "bold",
									fontSize: 16,
									width: "auto",
									alignSelf: selectAlign,
									textAlign: textAlignment,
									backgroundColor: "transparent",
								},
							]}
							itemStyle={{ fontWeight: "bold" }}
							mode={Platform.OS === "ios" ? "dropdown" : "dialog"}
						>
							{options.map((opt) => (
								<Picker.Item
									key={opt.value}
									label={opt.label}
									value={opt.value}
								/>
							))}
						</Picker>
					</View>
				) : (
					<View
						style={{ flexDirection: "row", alignItems: "center" }}
					>
						{prefix && (
							<Text style={styles.text.statValue}>{prefix}</Text>
						)}
						<TextInput
							style={[
								styles.text.statValue,
								{
									borderBottomWidth: 1,
									borderColor: "#777",
									paddingHorizontal: 0,
									flex: 1,
									maxWidth: "100%",
								},
							]}
							value={String(value)}
							onChangeText={handleTextChange}
							keyboardType={isNumeric ? "numeric" : "default"}
							multiline={isMultiline}
						/>
					</View>
				)
			) : (
				<Text
					style={[
						styles.text.statValue,
						{
							color: valueColor || styles.text.statValue.color,
							textAlign:
								direction === "horizontal" ? "right" : "left",
						},
					]}
				>
					{prefix}
					{type === "select" && options
						? options.find((opt) => opt.value === value)?.label ||
							value
						: value}{" "}
					{unit}
				</Text>
			)}
		</View>
	);
}

export function StatusBox({
	isEditing,
	value,
	onChange,
	options = [
		{ label: "Em Análise", value: "Em Análise" },
		{ label: "Ativo", value: "Ativo" },
		{ label: "Inativo", value: "Inativo" },
		{ label: "Disponível", value: "Disponível" },
	],
}: {
	isEditing: boolean;
	value: string;
	onChange?: (value: string) => void;
	options?: Array<{ label: string; value: string }>;
}) {
	const getStatusColor = (status: string) => {
		const lowerStatus = status.toLowerCase();
		if (
			lowerStatus.includes("ativo") ||
			lowerStatus.includes("disponível")
		) {
			return { bg: "#e8f5e9", text: "#4caf50" };
		}
		if (
			lowerStatus.includes("inativo") ||
			lowerStatus.includes("defeituosa")
		) {
			return { bg: "#ffebee", text: "#f44336" };
		}
		return { bg: "#fff3e0", text: "#ff9800" };
	};

	const colors = getStatusColor(value);

	return (
		<View style={{ flexDirection: "row", alignItems: "center" }}>
			{isEditing && onChange ? (
				<View
					style={[
						styles.modalPage.tag,
						{
							paddingVertical: 0,
							paddingHorizontal: 0,
							overflow: "hidden",
						},
					]}
				>
					<Picker
						selectedValue={value}
						onValueChange={onChange}
						style={[
							styles.modalPage.tagText,
							{
								backgroundColor: "transparent",
								borderWidth: 0,
								color: "#fff",
								paddingHorizontal: 8,
								minHeight: 28,
								outlineStyle: "none",
							} as any, // Cast to any to accept web outlineStyle
						]}
						mode={Platform.OS === "ios" ? "dropdown" : "dialog"}
					>
						{options.map((opt) => (
							<Picker.Item
								key={opt.value}
								label={opt.label.toUpperCase()}
								value={opt.value}
							/>
						))}
					</Picker>
				</View>
			) : (
				<View
					style={[
						styles.modalPage.tag,
						{
							backgroundColor: colors.bg,
							borderWidth: 0,
						},
					]}
				>
					<Text
						style={[
							styles.modalPage.tagText,
							{ color: colors.text },
						]}
					>
						{value.toUpperCase()}
					</Text>
				</View>
			)}
		</View>
	);
}
