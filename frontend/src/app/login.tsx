import { View, Text, Platform, Image } from "react-native";
import * as styles from "@/assets/styles/stylesheets";
import { LoginForm } from "@/components/pages/login/LoginForm";

export default function LoginScreen() {
	if (Platform.OS === "web") {
		return desktopLogin();
	} else {
		return mobileLogin();
	}
}

export function mobileLogin() {
	return (
		<>
			<View style={styles.page.background}>
				<View
					style={{
						gap: 15,
						alignItems: "center",
						justifyContent: "center",
					}}
				>
					<Image
						source={require("@/assets/images/logo.png")}
						style={styles.loginPage.logo}
					/>
				</View>

				{/* Login Form */}
				<View
					style={{
						alignItems: "center",
						width: "90%",
						maxWidth: 400,
						justifyContent: "flex-start",
					}}
				>
					<LoginForm />
				</View>
			</View>
		</>
	);
}

export function desktopLogin() {
	return (
		<View style={[styles.page.background, { flexDirection: "row" }]}>
			
			{/* Left Panel */}
			<View style={styles.loginPage.panel}>
				{/* Logo and subtitle */}
				<View style={{ alignItems: "center" }}>
					<Image
						source={require("@/assets/images/logo.png")}
						style={styles.loginPage.logo}
					/>
				</View>

				{/* Description */}
				<Text style={styles.text.subtitle}>
					Uma Loja que através do Ar e da Pele, proporciona
					equilíbrio, harmonia e movimento a vida de cada cliente
					nosso. Armovie é Bem Estar.
				</Text>
			</View>

			{/* Right Panel */}
			<View
				style={{
					alignItems: "center",
					width: "90%",
					maxWidth: 450,
					justifyContent: "flex-start",
				}}
			>
				<LoginForm />
			</View>
		</View>
	);
}
