import { NativeTabs, Label, Icon } from "expo-router/unstable-native-tabs";
import { Link } from "expo-router";
import { Text, View, StyleSheet, Image } from "react-native";
import { text } from "@/assets/styles/stylesheets";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useAuth } from "@/services/AuthProvider";

export function MobileNavbar() {
	const { user } = useAuth();

	if (!user) {
		return null;
	}

	return (
		<NativeTabs>
			<NativeTabs.Trigger name="index">
				<Label>Home</Label>

				<Icon
					sf={{ default: "house", selected: "house.fill" }}
					androidSrc={{
						default: require("@/assets/icons/home-outline.svg"),
						selected: require("@/assets/icons/home-filled.svg"),
					}}
				/>
			</NativeTabs.Trigger>

			{["Admin", "Seller", "Financeiro"].includes(user.role) && (
				<NativeTabs.Trigger name="clients">
					<Label>Clients</Label>
					<Icon
						sf={{ default: "person", selected: "person.fill" }}
						androidSrc={{
							default: require("@/assets/icons/people-outline.svg"),
							selected: require("@/assets/icons/people-filled.svg"),
						}}
					/>
				</NativeTabs.Trigger>
			)}

			{["Admin", "Technician", "Financeiro"].includes(user.role) && (
				<NativeTabs.Trigger name="items">
					<Label>Items</Label>
					<Icon
						sf={{ default: "folder", selected: "folder.fill" }}
						androidSrc={{
							default: require("@/assets/icons/tags-outline.svg"),
							selected: require("@/assets/icons/tags-filled.svg"),
						}}
					/>
				</NativeTabs.Trigger>
			)}

			{user.role === "Admin" && (
				<NativeTabs.Trigger name="admin">
					<Label>Users</Label>
					<Icon
						sf={{
							default: "key",
							selected: "key.fill",
						}}
						androidSrc={{
							default: require("@/assets/icons/key-outline.svg"),
							selected: require("@/assets/icons/key-filled.svg"),
						}}
					/>
				</NativeTabs.Trigger>
			)}

			<NativeTabs.Trigger name="about">
				<Label>About</Label>
				<Icon
					sf={{
						default: "info.circle",
						selected: "info.circle.fill",
					}}
					androidSrc={{
						default: require("@/assets/icons/info-outline.svg"),
						selected: require("@/assets/icons/info-filled.svg"),
					}}
				/>
			</NativeTabs.Trigger>
		</NativeTabs>
	);
}

export function DesktopNavbar() {
	const { user, logout } = useAuth();

	if (!user) {
		return null;
	}

	return (
		<View
			style={styles.navBar}>

			<View
				style={{
					padding: 20,
					borderRadius: 15,
					width: "100%",
					justifyContent: "center",
					alignItems: "center",
				}}
			>
				<Image
					source={require("@/assets/images/logo.png")}
					style={styles.logo}
				/>
			</View>

			<Text
				style={[
					styles.navText,
					{ marginBottom: 40, fontSize: 18, fontWeight: "bold" },
				]}
			>
				Welcome, {user.name}!
			</Text>

			<View style={{ flexDirection: "column", gap: 20, width: "100%" }}>
				<Link
					href="/private"
					style={[
						styles.navLink,
						{ justifyContent: "flex-start", width: "100%" },
					]}
				>
					<Ionicons name="home" size={18} color="#fff" />
					<Text style={styles.navText}> Home</Text>
				</Link>

				{["Admin", "Seller", "Financeiro"].includes(user.role) && (
					<Link
						href="/private/clients"
						style={[
							styles.navLink,
							{ justifyContent: "flex-start", width: "100%" },
						]}
					>
						<Ionicons name="person" size={18} color="#fff" />
						<Text style={styles.navText}> Clientes</Text>
					</Link>
				)}

				{["Admin", "Seller", "Financeiro"].includes(user.role) && (
					<Link
						href="/private/persons"
						style={[
							styles.navLink,
							{ justifyContent: "flex-start", width: "100%" },
						]}
					>
						<Ionicons name="people" size={18} color="#fff" />
						<Text style={styles.navText}> Pessoas</Text>
					</Link>
				)}

				{["Admin", "Seller", "Financeiro"].includes(user.role) && (
					<Link
						href="/private/contracts"
						style={[
							styles.navLink,
							{ justifyContent: "flex-start", width: "100%" },
						]}
					>
						<Ionicons name="document" size={18} color="#fff" />
						<Text style={styles.navText}> Contratos</Text>
					</Link>
				)}

				{["Admin", "Technician", "Financeiro"].includes(user.role) && (
					<Link
						href="/private/items"
						style={[
							styles.navLink,
							{ justifyContent: "flex-start", width: "100%" },
						]}
					>
						<Ionicons name="folder" size={18} color="#fff" />
						<Text style={styles.navText}> Itens</Text>
					</Link>
				)}

				{["Admin", "Technician"].includes(user.role) && (
					<Link
						href="/private/machines"
						style={[
							styles.navLink,
							{ justifyContent: "flex-start", width: "100%" },
						]}
					>
						<Ionicons name="folder" size={18} color="#fff" />
						<Text style={styles.navText}> Máquinas</Text>
					</Link>
				)}

				{user.role === "Admin" && (
					<Link
						href="/private/users"
						style={[
							styles.navLink,
							{ justifyContent: "flex-start", width: "100%" },
						]}
					>
						<Ionicons name="key" size={18} color="#fff" />
						<Text style={styles.navText}> Users</Text>
					</Link>
				)}

				<Link
					href="/private/about"
					style={[
						styles.navLink,
						{ justifyContent: "flex-start", width: "100%" },
					]}
				>
					<Ionicons name="information" size={18} color="#fff" />
					<Text style={styles.navText}> About</Text>
				</Link>
			</View>
			{/* Empurra o botão de Logout para o final da tela */}
			<View style={{ flex: 1 }} />

			<Text
				style={[styles.navText, { color: "#ffcccc" }]}
				onPress={logout}
			>
				<Ionicons name="log-out" size={18} color="#ffcccc" /> Logout
			</Text>
		</View>
	);
}

const styles = StyleSheet.create({
	navBar: {
		flexDirection: "column",
		justifyContent: "flex-start",
		alignItems: "flex-start",
		backgroundColor: "#2d1b69",
		height: "100%",
		gap: 30,
		width: "16.7%",
		paddingVertical: "3%",
		paddingHorizontal: 20,
	},
	logo: {
		height: 55,
		resizeMode: "contain",
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
