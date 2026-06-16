import { View, Text, Platform, Image, StyleSheet } from "react-native";
import { text, colors, darkTheme } from "@/assets/styles/stylesheets";
import { LoginForm } from "@/components/pages/login/LoginForm";

export default function LoginScreen() {
	if (Platform.OS === "web") {
		return desktopLogin();
	} else {
		return mobileLogin();
	}
}

export function mobileLogin() {
	return (null);
}

export function desktopLogin() {
	return (
		<View style={style.background}>
			{/* Left Panel */}
			<View
				style={[
					style.panel,
					{ 
						maxWidth: "60%", 
						height: "100%", 
						padding: 100,
						justifyContent: "center",
						alignItems: "center",
						gap: 20,
						borderRadius: 0
					},
				]}
			>
				{/* Logo */}
				<View
					style={{
						backgroundColor: darkTheme.background,
						padding: 20,
						borderRadius: 15,
						width: "100%",
						justifyContent: "center",
						alignItems: "center",
					}}
				>
					<Image
						source={require("@/assets/images/logo.png")}
						style={style.logo}
					/>
				</View>

				{/* Description */}
				<Text style={[text.subtitle]}>
					Uma Loja que através do Ar e da Pele, proporciona
					equilíbrio, harmonia e movimento a vida de cada cliente
					nosso. Armovie é Bem Estar.
				</Text>
			</View>

			{/* Right Panel */}
			<View style={{ 
				width: "40%", 
				padding: 100
			}}>
				<LoginForm />
			</View>
		</View>
	);
}

export const style = StyleSheet.create({
	background: {
		flex: 1,
		flexDirection: "row",
		backgroundColor: colors.background,
		alignItems: "center",
		justifyContent: "space-evenly",
		padding: 0,
	},
	panel: {
		backgroundColor: colors.overlayBackground,
		gap: 15,
		maxWidth: "40%",
		justifyContent: "center",
		alignItems: "center",
		borderRadius: 15,
		boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.25)",
	},
	logo: {
		height: 100,
		resizeMode: "contain",
	},
	logoText: {
		fontFamily: "Noto Sans",
		fontWeight: "bold",
		fontStyle: "italic",
		color: "#ead5ca",
		fontSize: 35,
		letterSpacing: -0.5,
	},
	featureItem: {
		flexDirection: "row",
		alignItems: "center",
		gap: 12,
	},
	featureIconContainer: {
		width: 32,
		height: 32,
		borderRadius: 16,
		backgroundColor: "rgba(245,230,211,0.1)",
		alignItems: "center",
		justifyContent: "center",
	},
	featureText: {
		color: "rgba(245,230,211,0.6)",
		fontSize: 14,
	},
});
