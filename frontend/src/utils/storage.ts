import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";

const storageUtil = {
	setItem: async (k: string, v: string) => {
		if (Platform.OS === "web") {
			// web
			localStorage.setItem(k, v);
		} else {
			// mobile
			await SecureStore.setItemAsync(k, v.toString());
		}
	},
	getItem: async (k: string) => {
		if (Platform.OS === "web") {
			// web
			return localStorage.getItem(k);
		} else {
			// mobile
			return await SecureStore.getItemAsync(k);
		}
	},
	deleteItem: async (k: string) => {
		if (Platform.OS === "web") {
			// web
			localStorage.removeItem(k);
		} else {
			// mobile
			await SecureStore.deleteItemAsync(k);
		}
	}
};
export default storageUtil;
