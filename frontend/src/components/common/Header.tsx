import { View, Text, StyleSheet } from "react-native";
import { colors, text } from "@/assets/styles/stylesheets";
import Button from "./Button";

interface Props {
	pageName: string;
	subtitle: string;
	secondButtonLabel?: string;
	secondButtonIcon?: string;
	thirdButtonLabel?: string;
	thirdButtonIcon?: string;
	fetchItems?: () => void;
	setIsCreateModalVisible?: (visible: boolean) => void;
	setIsFirstModalVisible?: (visible: boolean) => void;
	setIsSecondModalVisible?: (visible: boolean) => void;
}

export default function Header({
	pageName,
	subtitle,
	secondButtonLabel,
	secondButtonIcon,
	thirdButtonLabel,
	thirdButtonIcon,
	fetchItems,
	setIsCreateModalVisible,
	setIsFirstModalVisible,
	setIsSecondModalVisible,
}: Props) {
	return (
		<View style={styles.header}>
			<View>
				<Text style={text.title}>{pageName}</Text>
				<Text style={text.subtitle}>{subtitle}</Text>
			</View>

			<View
				style={{
					flexDirection: "row",
					gap: 10,
					justifyContent: "center",
				}}
			>
				{fetchItems && (
					<Button
						labelColor={colors.textSecondary}
						iconName="refresh"
						iconSize={20}
						onPress={fetchItems}
					/>
				)}
				{setIsCreateModalVisible && (
					<Button
						color={colors.primary}
						label={`Adicionar ${pageName || "Item"}`}
						iconName="bag-add-outline"
						iconSize={20}
						onPress={() => setIsCreateModalVisible(true)}
					/>
				)}
				{setIsFirstModalVisible && secondButtonLabel && (
					<Button
						color={colors.primary}
						label={secondButtonLabel}
						iconName={secondButtonIcon || "add"}
						iconSize={20}
						onPress={() => setIsFirstModalVisible(true)}
					/>
				)}

				{setIsSecondModalVisible && thirdButtonLabel && (
					<Button
						color={colors.primary}
						label={thirdButtonLabel}
						iconName={thirdButtonIcon || "add"}
						iconSize={20}
						onPress={() => setIsSecondModalVisible(true)}
					/>
				)}
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	header: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		paddingHorizontal: "5%",
		paddingVertical: "2%",
		width: "100%",
		backgroundColor: colors.overlayBackground,
		borderRadius: 10,
		elevation: 1,
		boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.25)",
	},
});
