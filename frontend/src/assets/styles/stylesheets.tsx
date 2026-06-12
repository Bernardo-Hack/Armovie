import { StyleSheet } from "react-native";

export const colors = {
	primary: "#ef790c",
	secondary: "#2d1b69",

	background: "#25292e",
	lighterBackground: "#3a3f44",

	textPrimary: "#fff",
	textSecondary: "#888",

	accent: "#007bff",
};

export const text = StyleSheet.create({
	title: {
		color: colors.textPrimary,
		fontFamily: "Futura",
		fontWeight: "bold",
		fontSize: 35,
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
	headerTextStyle: {
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
		backgroundColor: colors.lighterBackground,
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
		backgroundColor: colors.lighterBackground,
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

export const logItem = StyleSheet.create({
	container: {
		padding: 15,
		backgroundColor: "#2c3136",
		borderRadius: 8,
		marginBottom: 10,
		borderBottomWidth: 1,
		borderBottomColor: "#3a3f44",
		flexDirection: "column",
		gap: 10,
	},
	description: {
		...text.rowText,
		textAlign: "left",
		fontWeight: "normal",
	},
	footer: {
		borderTopWidth: 1,
		borderTopColor: "#3a3f44",
		paddingTop: 10,
		flexDirection: "row",
		justifyContent: "space-between",
	},
	meta: {
		...text.subtitle,
		fontSize: 12,
	},
});

export const logForm = StyleSheet.create({
	container: {
		width: "100%",
		padding: 20,
		borderTopWidth: 1,
		borderTopColor: "#3a3f44",
		gap: 10,
	},
	title: {
		...text.headerTextStyle,
		textAlign: "left",
		fontSize: 14,
		marginBottom: 5,
	},
	input: {
		borderWidth: 1,
		borderColor: "#474f58",
		borderRadius: 10,
		paddingVertical: 8,
		paddingHorizontal: 12,
		fontSize: 14,
		color: "#fff",
		backgroundColor: "#25292e",
	},
});

export const button = StyleSheet.create({
	primary: {
		borderRadius: 10,
		borderWidth: 12,
		borderColor: colors.primary,
		backgroundColor: colors.primary,
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		gap: 8,
	},
	label: {
		color: "#25292e",
		fontSize: 16,
		fontFamily: text.body.fontFamily,
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
	header: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		paddingHorizontal: "5%",
		paddingVertical: "2%",
		width: "80%",
		backgroundColor: colors.lighterBackground,
		borderRadius: 15,
		elevation: 1,
		boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.25)",
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

export const loginPage = StyleSheet.create({
	panel: {
		backgroundColor: "#30363c",
		padding: 40,
		gap: 15,
		maxWidth: "45%",
		justifyContent: "center",
		alignItems: "center",
		borderColor: "#3c424a",
		borderWidth: 1,
		borderRadius: 15,
	},
	logo: {
		height: 80,
		resizeMode: "contain",
		marginBottom: 10,
	},
	logoText: {
		fontFamily: "Noto Sans",
		fontWeight: "bold",
		fontStyle: "italic",
		color: "#f5e6d3",
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

export const modalPage = StyleSheet.create({
	centeredView: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: "rgba(0, 0, 0, 0.4)",
	},
	modalView: {
		maxWidth: "75%",
		backgroundColor: "#1e1e1e",
		borderRadius: 15,
		padding: 20,
		boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.25)",
		elevation: 5,
	},
	closeButton: {
		position: "absolute",
		top: 15,
		right: 15,
		zIndex: 1,
	},
	header: {
		flexDirection: "row",
		justifyContent: "space-between",
		marginBottom: 10,
	},
	tag: {
		backgroundColor: "#444",
		borderRadius: 5,
		paddingHorizontal: 8,
		paddingVertical: 4,
	},
	tagText: {
		color: "#fff",
		fontSize: 10,
		fontWeight: "bold",
	},
	title: {
		...text.title,
		fontSize: 28,
	},
	subtitle: {
		color: "#aaa",
		fontSize: 14,
		marginBottom: 20,
	},
	statsGrid: {
		flexDirection: "row",
		flexWrap: "wrap",
		justifyContent: "space-between",
		marginTop: 20,
		marginBottom: 20,
	},
	statBox: {
		width: "35%",
		marginBottom: 15,
		flexDirection: "column",
		alignSelf: "center",
	},
	statLine: {
		width: "100%",
		marginBottom: 15,
		flexDirection: "row",
		alignSelf: "center",
		alignItems: "center",
		alignContent: "center",
		justifyContent: "space-between",
	},
	footer: {
		flexDirection: "row",
		justifyContent: "space-between",
		marginTop: 20,
		alignItems: "flex-end",
	},
	editButton: {
		flexDirection: "row",
		alignItems: "center",
		gap: 8,
		backgroundColor: "#007bff",
		paddingVertical: 10,
		paddingHorizontal: 20,
		borderRadius: 10,
	},
	editButtonText: {
		color: "#fff",
		fontSize: 16,
		fontWeight: "bold",
	},
	detailRow: {
		color: colors.textPrimary,
		flexDirection: "row",
		justifyContent: "space-between",
		width: "100%",
		paddingVertical: 8,
		borderBottomWidth: 1,
		borderBottomColor: "#444",
	},
	detailLabel: {
		...text.rowText,
		fontWeight: "bold",
		color: "#ccc",
	},
	detailValue: {
		...text.rowText,
		flexShrink: 1,
		textAlign: "right",
		color: "#fff",
	},
	dateInfo: {
		marginTop: 20,
		paddingTop: 15,
		borderTopWidth: 1,
		borderTopColor: "#d8dee4",
		alignItems: "center",
	},
	dateText: {
		...text.subtitle,
		color: "#57606a",
		fontSize: 12,
	},
	textInput: {
		borderWidth: 1,
		borderColor: "#ddd",
		borderRadius: 8,
		paddingVertical: 10,
		paddingHorizontal: 15,
		fontSize: 16,
		color: "#333",
		width: "100%",
		backgroundColor: "#f9f9f9",
	},
});

export const loginForm = StyleSheet.create({
	container: {
		backgroundColor: "#30363c",
		padding: 20,
		gap: 15,
		width: "90%",
		borderColor: "#3c424a",
		borderWidth: 1,
		borderRadius: 15,
		maxWidth: 400,
	},
	input: {
		borderWidth: 1,
		borderColor: "#474f58",
		borderRadius: 15,
		padding: 12,
		fontSize: 16,
		color: "#fff",
		backgroundColor: "#25292e",
	},
	eyeIcon: {
		position: "absolute",
		right: 15,
		top: 10,
	},
	button: {
		marginTop: 20,
		padding: 15,
		backgroundColor: "#007bff",
		borderRadius: 15,
		alignItems: "center",
		justifyContent: "center",
	},
	buttonText: {
		color: "#fff",
		fontSize: 16,
		fontWeight: "bold",
	},
});
