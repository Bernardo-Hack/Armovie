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
			<View style={style.panel}>
				<Image
					source={require("@/assets/images/logo-light.png")}
					style={style.logo}
				/>
			</View>

			<LoginForm />
		</View>
	);
}

export const style = StyleSheet.create({
	background: {
		flex: 1,
		flexDirection: "column",
		backgroundColor: colors.background,
		alignItems: "center",
		justifyContent: "space-evenly",
		padding: 0,
	},
	panel: {
		backgroundColor: colors.overlayBackground,
		gap: 15,
		width: "40%",
		height: '30%',
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
