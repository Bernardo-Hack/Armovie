import { useEffect } from "react";
import { SplashScreen, Stack, useRouter } from "expo-router";
import { AuthProvider, useAuth } from "@/services/AuthProvider";
import { Toast } from "react-native-toast-message/lib/src/Toast";

SplashScreen.preventAutoHideAsync();

export function RootLayout() {
	const { isAuthenticated, isLoading } = useAuth();
	const router = useRouter();

	useEffect(() => {
		if (!isLoading) {
			SplashScreen.hideAsync();

			if (isAuthenticated) {
				router.replace("/private");
			} else {
				router.replace("/login");
			}
		}
	}, [isAuthenticated, isLoading]);

	if (isLoading) {
		return null;
	}

	return (
		<Stack>
			<Stack.Screen
				name="private"
				options={{
					headerShown: false,
				}}
			/>
			<Stack.Screen
				name="login"
				options={{
					headerShown: false,
					animation: "fade",
				}}
			/>
		</Stack>
	);
}

export default function AppLayout() {

	return (
		<AuthProvider>
			<RootLayout />
			<Toast />
		</AuthProvider>
	);
}
