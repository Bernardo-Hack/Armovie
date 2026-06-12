import { NativeTabs, Label, Icon } from "expo-router/unstable-native-tabs";
import { Link } from "expo-router";
import { Text, View } from "react-native";
import { navbar } from "@/assets/styles/stylesheets";
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

			{user.role === "Administrador" && (
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
			style={[
				navbar.navBar,
				{
					flexDirection: "column",
					width: "16.7%",
					height: "100%",
					justifyContent: "flex-start",
					alignItems: "flex-start",
					paddingTop: 40,
					paddingHorizontal: 20,
				},
			]}
		>
			<Text
				style={[
					navbar.navText,
					{ marginBottom: 40, fontSize: 18, fontWeight: "bold" },
				]}
			>
				Welcome, {user.name}!
			</Text>

			<View style={{ flexDirection: "column", gap: 20, width: "100%" }}>
				<Link
					href="/private"
					style={[
						navbar.navLink,
						{ justifyContent: "flex-start", width: "100%" },
					]}
				>
					<Ionicons name="home" size={18} color="#fff" />
					<Text style={navbar.navText}> Home</Text>
				</Link>

				<Link
					href="/private/clients"
					style={[
						navbar.navLink,
						{ justifyContent: "flex-start", width: "100%" },
					]}
				>
					<Ionicons name="person" size={18} color="#fff" />
					<Text style={navbar.navText}> Clients</Text>
				</Link>

				<Link
					href="/private/contracts"
					style={[
						navbar.navLink,
						{ justifyContent: "flex-start", width: "100%" },
					]}
				>
					<Ionicons name="document" size={18} color="#fff" />
					<Text style={navbar.navText}> Contratos</Text>
				</Link>

				<Link
					href="/private/items"
					style={[
						navbar.navLink,
						{ justifyContent: "flex-start", width: "100%" },
					]}
				>
					<Ionicons name="folder" size={18} color="#fff" />
					<Text style={navbar.navText}> Items</Text>
				</Link>

				<Link
					href="/private/machines"
					style={[
						navbar.navLink,
						{ justifyContent: "flex-start", width: "100%" },
					]}
				>
					<Ionicons name="folder" size={18} color="#fff" />
					<Text style={navbar.navText}> Máquinas</Text>
				</Link>

				{user.role === "Administrador" && (
					<Link
						href="/private/users"
						style={[
							navbar.navLink,
							{ justifyContent: "flex-start", width: "100%" },
						]}
					>
						<Ionicons name="key" size={18} color="#fff" />
						<Text style={navbar.navText}> Users</Text>
					</Link>
				)}

				<Link
					href="/private/about"
					style={[
						navbar.navLink,
						{ justifyContent: "flex-start", width: "100%" },
					]}
				>
					<Ionicons name="information" size={18} color="#fff" />
					<Text style={navbar.navText}> About</Text>
				</Link>
			</View>
			{/* Empurra o botão de Logout para o final da tela */}
			<View style={{ flex: 1 }} />

			<Text
				style={[navbar.navText, { marginBottom: 30, color: "#ffcccc" }]}
				onPress={logout}
			>
				<Ionicons name="log-out" size={18} color="#ffcccc" /> Logout
			</Text>
		</View>
	);
}
