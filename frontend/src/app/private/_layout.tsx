import { Platform, View } from "react-native";
import { Slot } from "expo-router";
import { use, useState } from "react";

import { DesktopNavbar, MobileNavbar } from "@/components/common/Navbars";

import { User } from "@/assets/types/User";
import { authService } from "@/services/authService";

export default function TabLayout() {
	const [userData, setUserData] = useState<User | null>(null);

	useState(() => {
		authService.getLoggedUser()
			.then((data) => setUserData(data))
			.catch((error) => {
				console.error("Error fetching user data:", error);
				setUserData(null);
			});
	},);

	if (Platform.OS === "web") {
		return (
			<View style={{ flex: 1, flexDirection: "row"}}>
				<DesktopNavbar/>
				<Slot />
			</View>
		);
	} else {
		return <MobileNavbar/>;
	}
}
