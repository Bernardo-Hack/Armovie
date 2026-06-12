import { View, Text, TextInput, TouchableOpacity, ActivityIndicator } from "react-native";
import { useState } from "react";
import Ionicons from "@expo/vector-icons/Ionicons";
import Toast from "react-native-toast-message";
import { loginForm, text, colors } from "@/assets/styles/stylesheets";

import { LoginCredentials } from "@/services/authService";
import { useAuth } from "@/services/AuthProvider";
import Button from "../../common/Button";

export function LoginForm() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [showPassword, setShowPassword] = useState(false);

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
		<View style={loginForm.container}>

			{/* Email */}
			<View style={{gap : 5}}>
				<Text style={text.body}>E-mail</Text>
				<TextInput
					value={email}
					onChangeText={setEmail}
					style={loginForm.input}
					placeholder="Digite seu e-mail"
					placeholderTextColor="#888"
					keyboardType="email-address"
					autoCapitalize="none"
				/>
			</View>

			{/* Password */}
			<View style={{gap : 5}}>
				<Text style={text.body}>Senha</Text>
				<View style={{ position: "relative" }}>
					<TextInput
						secureTextEntry={!showPassword}
						value={password}
						onChangeText={setPassword}
						style={loginForm.input}
						placeholder="Digite sua senha"
						placeholderTextColor="#888"
					/>
					<Ionicons
						name={showPassword ? "eye-off" : "eye"}
						size={24}
						color="#888"
						style={loginForm.eyeIcon}
						onPress={() => setShowPassword((prev) => !prev)}
					/>
				</View>
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

