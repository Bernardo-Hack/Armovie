import { View, Text } from "react-native";
import * as styles from "@/assets/styles/stylesheets";
import Button from "./Button";

interface Props {
	pageName: string;
	subtitle: string;
	extraButtonLabel?: string;
	extraButtonIcon?: string;
	fetchItems: () => void;
	setIsCreateModalVisible: (visible: boolean) => void;
	setIsExtraModalVisible?: (visible: boolean) => void;
}

export default function Header({
	pageName,
	subtitle,
	extraButtonLabel,
	extraButtonIcon,
	fetchItems,
	setIsCreateModalVisible,
	setIsExtraModalVisible,
}: Props) {
	return (
		<View style={styles.page.header}>
			<View>
				<Text style={styles.text.title}>{pageName}</Text>
				<Text style={styles.text.subtitle}>{subtitle}</Text>
			</View>

			<View
				style={{
					flexDirection: "row",
					gap: 10,
					justifyContent: "center",
				}}
			>
				<Button
					labelColor="#6b7280"
					iconName="refresh"
					iconSize={20}
					onPress={fetchItems}
				/>
				<Button
					color={styles.colors.primary}
					label={`Adicionar ${pageName || "Item"}`}
					iconName="bag-add-outline"
					iconSize={20}
					onPress={() => setIsCreateModalVisible(true)}
				/>
				{setIsExtraModalVisible && extraButtonLabel && (
					<Button
						color={styles.colors.primary}
						label={extraButtonLabel}
						iconName={extraButtonIcon || "add"}
						iconSize={20}
						onPress={() => setIsExtraModalVisible(true)}
					/>
				)}
			</View>
		</View>
	);
}
