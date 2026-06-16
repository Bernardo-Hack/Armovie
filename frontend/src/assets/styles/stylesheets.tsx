import { StyleSheet } from "react-native";

export const colors = {
	primary: "#ef790c",
	secondary: "#2d1b69",

	background: "hsl(0, 0%, 95%)",
	overlayBackground: "hsl(0, 0%, 75%)",

	textPrimary: "hsl(0, 0%, 15%)",
	textSecondary: "hsl(0, 0%, 25%)",

	accent: "#ef790c",
};

export const lightTheme = {
	primary: "#ef790c",
	secondary: "#2d1b69",

	background: "hsl(0, 0%, 90%)",
	overlayBackground: "hsl(0, 0%, 67%)",

	textPrimary: "hsl(0, 0%, 20%)",
	textSecondary: "hsl(0, 0%, 30%)",

	accent: "#ef790c",
};

export const darkTheme = {
	primary: "#ef790c",
	secondary: "#2d1b69",

	background: "hsl(0, 0%, 20%)",
	overlayBackground: "hsl(0, 0%, 30%)",

	textPrimary: "hsl(0, 0%, 100%)",
	textSecondary: "hsl(0, 0%, 50%)",

	accent: "#ef790c",
};

export const text = StyleSheet.create({
	title: {
		color: colors.textPrimary,
		fontFamily: "Futura",
		fontWeight: "bold",
		fontSize: 32,
	},
	subtitle: {
		color: colors.textSecondary,
		fontFamily: "Futura",
		fontSize: 16,
	},
	body: {
		color: colors.textPrimary,
		fontFamily: "Futura",
		fontSize: 24,
	},
	headerText: {
		color: colors.textSecondary,
		fontFamily: "Futura",
		fontWeight: "bold",
		fontSize: 12,
		textAlign: "center" as const,
	},
	rowText: {
		color: colors.textPrimary,
		fontSize: 16,
		fontFamily: "Futura",
		textAlign: "center" as const,
	},
	inputLabel: {
		color: colors.textPrimary,
		fontSize: 16,
		fontFamily: "Futura",
		marginBottom: 5,
	},
	input: {
		color: colors.textSecondary,
		fontSize: 14,
		fontFamily: "Futura",
		backgroundColor: colors.overlayBackground,
		marginBottom: 5,
	},
	statLabel: {
		color: colors.textSecondary,
		fontSize: 12,
		fontFamily: "Futura",
		fontStyle: "italic",
	},
	statValue: {
		color: colors.textPrimary,
		fontSize: 16,
		fontFamily: "Futura",
		fontWeight: "bold",
	},
	tag: {
		backgroundColor: colors.overlayBackground,
		borderRadius: 5,
		paddingHorizontal: 8,
		paddingVertical: 4,
	},
	tagText: {
		color: "#fff",
		fontSize: 10,
		fontWeight: "bold",
	},
});

export const page = StyleSheet.create({
	background: {
		flex: 1,
		backgroundColor: colors.background,
		alignItems: "center",
		justifyContent: "space-evenly",
		paddingHorizontal: 20,
		paddingVertical: 50,
		gap: 30,
	},
	row: {
		flexDirection: "row",
		justifyContent: "center",
		alignSelf: "center",
		alignItems: "center",
		minWidth: "100%",
		paddingVertical: 20,
		borderBottomWidth: 1,
		borderBottomColor: "#444",
	},
	columns: {
		flex: 1,
		justifyContent: "flex-start",
		alignItems: "center",
		paddingHorizontal: 15,
		maxWidth: "25%",
	},
});

export const navbar = StyleSheet.create({
	navBar: {
		flexDirection: "row",
		justifyContent: "space-around",
		alignItems: "center",
		backgroundColor: colors.secondary,
		height: "8%",
		padding: 15,
		gap: "15%",
	},
	navLink: {
		flexDirection: "row",
		justifyContent: "center",
		alignItems: "center",
		gap: 15,
	},
	navText: {
		color: "#fff",
		fontSize: 18,
		textDecorationLine: "none",
	},
});
