import { Text, View } from "react-native";
import { page, text } from "../../assets/styles/stylesheets";

export default function HomeScreen() {
	const user = {
		name: "Bernardo Lima Hack",
		role: "Admin",
	};

  return (
		<View style={page.background}>
			<Text style={text.title}>Bem vindo, {user.name}!</Text>
			<Text style={text.body}>Você é um {user.role}.</Text>
		</View>
  );
}
