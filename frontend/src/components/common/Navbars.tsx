import { NativeTabs, Label, Icon } from "expo-router/unstable-native-tabs";
import { useRouter } from "expo-router";
import { View, StyleSheet, Image } from "react-native";
import { useState } from "react";
import { useAuth } from "@/services/AuthProvider";
import Button from "@/components/common/Button";
import { SettingsModal } from "@/components/pages/settings/SettingsModal";

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
	const router = useRouter();
	const [isSettingsModalVisible, setIsSettingsModalVisible] = useState(false);

	if (!user) {
		return null;
	}

	return (
		<View style={styles.navBar}>
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
					source={require("@/assets/images/logo-dark.png")}
					style={styles.logo}
				/>
			</View>

			<View
				style={{
					flexDirection: "column",
					gap: 10,
					width: "100%",
					alignItems: "flex-start",
				}}
			>
				<Button
					label="Home"
					iconName="home"
					iconSize={18}
					labelColor="#fff"
					onPress={() => router.push("/private")}
				/>

				{["Admin", "Seller", "Financeiro"].includes(user.role) && (
					<Button
						label="Clientes"
						iconName="person"
						iconSize={18}
						labelColor="#fff"
						onPress={() => router.push("/private/clients")}
					/>
				)}

				{["Admin", "Seller", "Financeiro"].includes(user.role) && (
					<Button
						label="Contratos"
						iconName="document"
						iconSize={18}
						labelColor="#fff"
						onPress={() => router.push("/private/contracts")}
					/>
				)}

				{["Admin", "Technician"].includes(user.role) && (
					<Button
						label="Máquinas"
						iconName="hammer"
						iconSize={18}
						labelColor="#fff"
						onPress={() => router.push("/private/machines")}
					/>
				)}

				{["Admin", "Technician"].includes(user.role) && (
					<Button
						label="Fragrâncias"
						iconName="flask"
						iconSize={18}
						labelColor="#fff"
						onPress={() => router.push("/private/fragrances")}
					/>
				)}

				{user.role === "Admin" && (
					<Button
						label="Users"
						iconName="key"
						iconSize={18}
						labelColor="#fff"
						onPress={() => router.push("/private/users")}
					/>
				)}

				{user.role === "Admin" && (
					<Button
						label="Configurações"
						iconName="settings"
						iconSize={18}
						labelColor="#fff"
						onPress={() => setIsSettingsModalVisible(true)}
					/>
				)}

				<Button
					label="About"
					iconName="information"
					iconSize={18}
					labelColor="#fff"
					onPress={() => router.push("/private/about")}
				/>
			</View>
			{/* Empurra o botão de Logout para o final da tela */}
			<View style={{ flex: 1 }} />

			<Button
				label="Logout"
				iconName="log-out"
				iconSize={18}
				labelColor="#ffcccc"
				onPress={logout}
			/>

			<SettingsModal 
				visible={isSettingsModalVisible} 
				onClose={() => setIsSettingsModalVisible(false)} 
			/>
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
