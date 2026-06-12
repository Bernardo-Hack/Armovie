import { Text, View } from "react-native";
import * as styles from "../../assets/styles/stylesheets";

export default function AdminScreen() {
	return (
		<View style={styles.page.background}>
			<Text style={styles.text.body}>This is the admin screen.</Text>
		</View>
	);
}
