import { Pressable, Text, StyleSheet } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";

import { colors } from "@/assets/styles/stylesheets";

type Props = {
	color?: string;
	label?: string;
	labelColor?: string;
	iconName: string;
	iconSize: number;
	onPress?: () => void;
};

export default function Button({
	color,
	label,
	iconName,
	iconSize,
	labelColor,
	onPress,
}: Props) {
	const buttonColor = color || "transparent";
	const iconColor = labelColor || styles.buttonLabel.color;

	return (
		<Pressable
			style={[
				styles.primary,
				{
					backgroundColor: buttonColor,
					borderColor: buttonColor,
				},
			]}
			onPress={onPress}
		>
			<Ionicons
				name={chooseIcon(iconName)}
				size={iconSize}
				color={iconColor}
			/>

			{label && (
				<Text style={[styles.buttonLabel, { color: labelColor }]}>
					{label}
				</Text>
			)}
		</Pressable>
	);
}

function chooseIcon(
	category: string,
): React.ComponentProps<typeof Ionicons>["name"] {
	if (!(Ionicons.getRawGlyphMap() as Record<string, number>)[category])
		return "help";
	else return category as React.ComponentProps<typeof Ionicons>["name"];
}

export const styles = StyleSheet.create({
	primary: {
		borderRadius: 10,
		borderWidth: 12,
		borderColor: colors.primary,
		backgroundColor: colors.primary,
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		gap: 8,
	},
	buttonLabel: {
		color: colors.textPrimary,
		fontFamily: "Futura",
		fontSize: 16,
	},
});
