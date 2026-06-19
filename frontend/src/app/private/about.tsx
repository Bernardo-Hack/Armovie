import { Text, View } from "react-native";
import * as styles from "@/assets/styles/stylesheets";

export default function Index() {
	return (
		<View style={styles.page.background}>
			<Text style={styles.text.body}>This is the About screen.</Text>
		</View>
	);
}
