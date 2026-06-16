import {
	Modal,
	View,
	Text,
	FlatList,
	ActivityIndicator,
	StyleSheet,
} from "react-native";
import { useState, useEffect } from "react";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Toast } from "react-native-toast-message/lib/src/Toast";

import { text, colors } from "@/assets/styles/stylesheets";
import Button from "@/components/common/Button";
import { Person } from "@/assets/types/Person";
import { addressService, Address } from "@/services/addressService";
import { StatBox } from "@/components/common/Statbox";

interface Props {
	person: Person | null;
	visible: boolean;
	onClose: () => void;
}

export function PersonAddressModal({ person, visible, onClose }: Props) {
	const [addresses, setAddresses] = useState<Address[]>([]);
	const [loading, setLoading] = useState(true);
	const [newAddress, setNewAddress] = useState({
		street: "",
		number: "",
		zip_code: "",
		city: "",
		state: "",
		complement: "",
	});

	const fetchAddresses = async () => {
		if (!person) return;
		setLoading(true);
		try {
			const fetchedAddresses = await addressService.getAddressesByPersonId(person.id);
			setAddresses(fetchedAddresses);
		} catch (error: any) {
			if (error.message.includes("404") || error.message.includes("Not Found")) {
				setAddresses([]);
			} else {
				Toast.show({ type: "error", text1: "Erro ao buscar endereços", text2: error.message });
			}
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		if (visible) fetchAddresses();
	}, [visible, person]);

	const handleSaveAddress = async () => {
		try {
			if (!person || !newAddress.street || !newAddress.number || !newAddress.zip_code || !newAddress.city || !newAddress.state) {
				Toast.show({
					type: "error",
					text1: "Dados incompletos",
					text2: "Preencha todos os campos obrigatórios.",
				});
				return;
			}

			const addressToCreate = {
				personId: person.id,
				street: newAddress.street,
				number: Number(newAddress.number),
				zip_code: newAddress.zip_code,
				city: newAddress.city,
				state: newAddress.state,
				complement: newAddress.complement || undefined,
			};

			await addressService.createAddress(addressToCreate);
			Toast.show({ type: "success", text1: "Endereço salvo com sucesso!" });

			setNewAddress({ street: "", number: "", zip_code: "", city: "", state: "", complement: "" });
			fetchAddresses();
		} catch (error: any) {
			Toast.show({ type: "error", text1: "Erro ao criar endereço", text2: error.message });
		}
	};

	const handleDeleteAddress = async (id: string) => {
		try {
			await addressService.deleteAddress(id);
			Toast.show({ type: "success", text1: "Endereço excluído!" });
			fetchAddresses();
		} catch (error: any) {
			Toast.show({ type: "error", text1: "Erro ao excluir endereço", text2: error.message });
		}
	};

	const handleInputChange = (field: string, value: any) => {
		setNewAddress((prev) => ({ ...prev, [field]: value }));
	};

	function renderAddressItem({ item }: { item: Address }) {
		return (
			<View style={[styles.container, { flexDirection: "row", alignItems: "center" }]}>
				<View style={{ flex: 1 }}>
					<Text style={styles.description}>
						{item.street}, {item.number} {item.complement ? `- ${item.complement}` : ""}
					</Text>
					<Text style={styles.meta}>
						{item.city} - {item.state} | CEP: {item.zip_code}
					</Text>
				</View>
				<Button
					iconName="trash"
					iconSize={24}
					onPress={() => handleDeleteAddress(item.id)}
					color="#f44336"
					labelColor="#fff"
				/>
			</View>
		);
	}

	return (
		<Modal animationType="fade" transparent={true} visible={visible} onRequestClose={onClose}>
			<View style={styles.centeredView}>
				<View style={styles.modalView}>
					{/* Header */}
					<View style={styles.header}>
						<Text style={styles.title}>
							Endereços - {person?.fullName}
						</Text>
						<View style={{ flex: 1 }} />
						<Ionicons name="close" size={24} color="#555" onPress={onClose} />
					</View>

					{/* Address List */}
					<View style={{ flex: 1, width: "100%", paddingHorizontal: 5, paddingVertical: 10 }}>
						{loading ? (
							<ActivityIndicator size="large" color={colors.primary} />
						) : (
							<FlatList
								data={addresses}
								renderItem={renderAddressItem}
								keyExtractor={(item) => item.id}
								ListEmptyComponent={<Text style={{ textAlign: "center", marginTop: 20 }}>Nenhum endereço cadastrado.</Text>}
							/>
						)}
					</View>

					{/* Form to add new Address */}
					<View style={{ width: "100%", marginTop: 10 }}>
						<Text style={[styles.title, { textAlign: "center" }]}>
							Adicionar Novo Endereço
						</Text>

						<View style={[styles.statsGrid]}>
							<StatBox
								isEditing={true}
								onChange={(text) => handleInputChange("zip_code", text)}
								direction="vertical"
								label="CEP"
								value={newAddress.zip_code}
							/>
							<StatBox
								isEditing={true}
								onChange={(text) => handleInputChange("street", text)}
								direction="vertical"
								label="Rua"
								value={newAddress.street}
							/>
							<StatBox
								isEditing={true}
								onChange={(text) => handleInputChange("number", text)}
								direction="vertical"
								label="Número"
								keyboardType="numeric"
								value={newAddress.number}
							/>
							<StatBox
								isEditing={true}
								onChange={(text) => handleInputChange("complement", text)}
								direction="vertical"
								label="Complemento"
								value={newAddress.complement}
							/>
							<StatBox
								isEditing={true}
								onChange={(text) => handleInputChange("city", text)}
								direction="vertical"
								label="Cidade"
								value={newAddress.city}
							/>
							<StatBox
								isEditing={true}
								onChange={(text) => handleInputChange("state", text)}
								direction="vertical"
								label="Estado"
								value={newAddress.state}
							/>
						</View>

						<Button color="#4caf50" label="Salvar Endereço" iconName="add-circle" iconSize={20} onPress={handleSaveAddress} />
					</View>
				</View>
			</View>
		</Modal>
	);
}

const styles = StyleSheet.create({
	centeredView: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0, 0, 0, 0.4)" },
	modalView: { maxWidth: "75%", backgroundColor: colors.background, borderRadius: 15, padding: 20, boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.25)", elevation: 5 },
	container: { padding: 15, backgroundColor: colors.overlayBackground, borderRadius: 8, marginBottom: 10, borderBottomWidth: 1, borderBottomColor: colors.textSecondary, flexDirection: "column", gap: 10 },
	description: { ...text.rowText, textAlign: "left", fontWeight: "normal" },
	meta: { ...text.subtitle, fontSize: 12 },
	header: { flexDirection: "row", justifyContent: "space-between", marginBottom: 10 },
	title: { ...text.title, fontSize: 28 },
	statsGrid: { flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between", marginTop: 20, marginBottom: 20 },
});
