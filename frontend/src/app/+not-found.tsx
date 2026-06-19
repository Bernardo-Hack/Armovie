import { View, Text } from "react-native";
import { Stack, router } from "expo-router";
import Button from "@/components/common/Button";
import * as styles from "@/assets/styles/stylesheets";

export default function NotFoundScreen() {
	return (
		<View style={styles.page.background}>
			<Stack.Screen options={{ title: "Erro: 404 - Not Found" }} />

			<View
				style={{
					flex: 1,
					justifyContent: "center",
					alignItems: "center",
					gap: 20,
					paddingHorizontal: 20,
					paddingVertical: 50,
				}}
			>
				<Text style={styles.text.title}>Erro ao carregar a página</Text>
				<Text style={styles.text.body}>A página que você está procurando não existe.</Text>
				<Button
					label="Voltar"
					color="#777"
					iconName="help"
					iconSize={24}
					onPress={() => router.push("/private")}
				/>
			</View>
		</View>
	);
}
