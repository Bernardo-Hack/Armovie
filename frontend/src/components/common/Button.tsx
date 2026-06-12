import { Pressable, Text } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";

import { button } from "@/assets/styles/stylesheets";

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
	const iconColor = labelColor || button.label.color;

	return (
		<Pressable
			style={[
				button.primary,
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
				<Text style={[button.label, { color: labelColor }]}>
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
