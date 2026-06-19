import { View, StyleSheet } from "react-native";
import { useState } from "react";
import Toast from "react-native-toast-message";
import { colors, darkTheme } from "@/assets/styles/stylesheets";

import { LoginCredentials } from "@/services/authService";
import { useAuth } from "@/services/AuthProvider";
import Button from "../../common/Button";
import { StatBox } from "@/components/common/Statbox";

export function LoginForm() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [isLoading, setIsLoading] = useState(false);

	const { login } = useAuth();

	const handleSubmit = async () => {
		const loginData: LoginCredentials = { email, password };

		if (!email.trim()) {
			Toast.show({ type: "error", text1: "Informe seu e-mail." });
			return;
		}
		if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
			Toast.show({ type: "error", text1: "Informe um e-mail válido." });
			return;
		}
		if (!password) {
			Toast.show({ type: "error", text1: "Informe sua senha." });
			return;
		}
		setIsLoading(true);
		try {
			await login(loginData);
			Toast.show({ type: "success", text1: "Login realizado com sucesso!" });
		} catch (error) {
			const msg =
				error instanceof Error
					? error.message
					: "Credenciais inválidas.";
			Toast.show({ type: "error", text1: msg });
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<View style={style.container}>
			{/* Email */}
			<StatBox
				isEditing={true}
				value={email}
				onChange={(val) => setEmail(String(val))}
				direction="horizontal"
				label="E-mail"
				placeholder="Digite seu e-mail"
				keyboardType="email-address"
				autoCapitalize="none"
			/>

			{/* Password */}
			<View style={{ justifyContent: "space-between", flexDirection: "row"}}>
				<StatBox
					isEditing={true}
					value={password}
					onChange={(val) => setPassword(String(val))}
					direction="horizontal"
					label="Senha"
					placeholder="Digite sua senha"
					isPassword
				/>
			</View>

			{/* Submit Button */}
			<Button
				color={colors.primary}
				label="Entrar"
				iconName="log-in-outline"
				iconSize={20}
				onPress={handleSubmit}
			/>
		</View>
	);
}

export const style = StyleSheet.create({
	container: {
		backgroundColor: colors.overlayBackground,
		padding: 20,
		gap: 15,
		width: "40%",
		borderRadius: 15,
		boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.25)",
	},
});
