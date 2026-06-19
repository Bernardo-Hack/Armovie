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
	isActive?: boolean;
};

export default function Button({
	color,
	label,
	iconName,
	iconSize,
	labelColor,
	onPress,
	isActive = true,
}: Props) {
	// isActive mode: highlight with primary color
	const buttonColor = isActive ? color : "transparent";
	const resolvedLabelColor = isActive ? color : labelColor;

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
				color={labelColor}
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
		paddingHorizontal: 12,
		paddingVertical: 10,
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
