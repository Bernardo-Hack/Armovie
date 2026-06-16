import { Text, View, StyleSheet } from "react-native";
import { page, text, colors } from "@/assets/styles/stylesheets";
import { useAuth } from "@/services/AuthProvider";

export default function HomeScreen() {
	const { user } = useAuth();

	return (
		<View style={page.background}>
			<View style={styles.container}>
				<Text style={text.title}>Bem-vindo(a), {user?.name || "Usuário"}!</Text>
				<Text style={text.body}>Nível de acesso: {user?.role || "N/A"}</Text>

				<View style={styles.card}>
					<Text style={[text.subtitle, { marginBottom: 10 }]}>Painel de Controle Armovie</Text>
					<Text style={[text.body, { lineHeight: 24 }]}>
						Utilize o menu lateral para navegar entre os módulos do sistema.{"\n"}
						Aqui você pode gerenciar seus clientes, acompanhar contratos, controlar máquinas e itens de estoque.
					</Text>
				</View>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		padding: 20,
		gap: 5,
		width: "100%",
		maxWidth: 800,
	},
	card: {
		marginTop: 20,
		backgroundColor: colors.overlayBackground,
		padding: 25,
		borderRadius: 15,
		boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.25)",
	},
});
