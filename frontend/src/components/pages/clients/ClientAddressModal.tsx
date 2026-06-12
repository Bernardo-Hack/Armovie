import { Modal, View, Text, FlatList, ActivityIndicator, TouchableOpacity } from "react-native";
import { useState, useEffect } from "react";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Toast } from "react-native-toast-message/lib/src/Toast";

import * as styles from "@/assets/styles/stylesheets";
import Button from "@/components/common/Button";
import { Client } from "@/assets/types/Client";
import { addressService, Address } from "@/services/addressService";
import { StatBox } from "@/components/common/Statbox";

interface Props {
	client: Client | null;
	visible: boolean;
	onClose: () => void;
}

export function ClientAddressModal({ client, visible, onClose }: Props) {
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
		if (!client) return;
		setLoading(true);
		try {
			const fetchedAddresses = await addressService.getAddressesByClientId(client.id);
			setAddresses(fetchedAddresses);
		} catch (error: any) {
			if (error.message.includes("404") || error.message.includes("Not Found")) {
				setAddresses([]);
			} else {
				Toast.show({
					type: "error",
					text1: "Erro ao buscar endereços",
					text2: error.message,
				});
			}
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		if (visible) {
			fetchAddresses();
		}
	}, [visible, client]);

	const handleSaveAddress = async () => {
		try {
			if (!client || !newAddress.street || !newAddress.number || !newAddress.zip_code || !newAddress.city || !newAddress.state) {
				Toast.show({
					type: "error",
					text1: "Dados incompletos",
					text2: "Preencha todos os campos obrigatórios.",
				});
				return;
			}

			const addressToCreate = {
				clientId: client.id,
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

	const renderAddressItem = ({ item }: { item: Address }) => (
		<View style={[styles.logItem.container, { flexDirection: "row", alignItems: "center" }]}>
			<View style={{ flex: 1 }}>
				<Text style={styles.logItem.description}>
					{item.street}, {item.number} {item.complement ? `- ${item.complement}` : ""}
				</Text>
				<Text style={styles.logItem.meta}>
					{item.city} - {item.state} | CEP: {item.zip_code}
				</Text>
			</View>
			<TouchableOpacity onPress={() => handleDeleteAddress(item.id)} style={{ padding: 10 }}>
				<Ionicons name="trash" size={20} color="#f44336" />
			</TouchableOpacity>
		</View>
	);

	return (
		<Modal animationType="fade" transparent={true} visible={visible} onRequestClose={onClose}>
			<View style={styles.modalPage.centeredView}>
				<View style={styles.modalPage.modalView}>
					{/* Header */}
					<View style={styles.modalPage.header}>
						<Text style={styles.modalPage.title}>Endereços - {client?.fantasyName || client?.fullName}</Text>
						<View style={{ flex: 1 }} />
						<Ionicons name="close" size={24} color="#555" onPress={onClose} />
					</View>

					{/* Lista de Endereços */}
					<View style={{ flex: 1, width: "100%", paddingHorizontal: 5, paddingVertical: 10 }}>
						{loading ? (
							<ActivityIndicator size="large" color={styles.colors.primary} />
						) : (
							<FlatList
								data={addresses}
								renderItem={renderAddressItem}
								keyExtractor={(item) => item.id}
								ListEmptyComponent={<Text style={{ textAlign: "center", marginTop: 20 }}>Nenhum endereço cadastrado.</Text>}
							/>
						)}
					</View>

					{/* Formulário para Adicionar Novo Endereço */}
					<View style={{ width: "100%", marginTop: 10 }}>
						<Text style={[styles.modalPage.title, { textAlign: "center" }]}>Adicionar Novo Endereço</Text>

						<View style={[styles.modalPage.statsGrid]}>
							<StatBox isEditing={true} onChange={(text) => handleInputChange("zip_code", text)} direction="vertical" label="CEP" value={newAddress.zip_code} />
							<StatBox isEditing={true} onChange={(text) => handleInputChange("street", text)} direction="vertical" label="Rua" value={newAddress.street} />
							<StatBox isEditing={true} onChange={(text) => handleInputChange("number", text)} direction="vertical" label="Número" isNumeric value={newAddress.number} />
							<StatBox isEditing={true} onChange={(text) => handleInputChange("complement", text)} direction="vertical" label="Complemento" value={newAddress.complement} />
							<StatBox isEditing={true} onChange={(text) => handleInputChange("city", text)} direction="vertical" label="Cidade" value={newAddress.city} />
							<StatBox isEditing={true} onChange={(text) => handleInputChange("state", text)} direction="vertical" label="Estado" value={newAddress.state} />
						</View>

						<Button color="#4caf50" label="Salvar Endereço" iconName="add-circle" iconSize={20} onPress={handleSaveAddress} />
					</View>
				</View>
			</View>
		</Modal>
	);
}
