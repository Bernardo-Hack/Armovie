import { Modal, View, ScrollView } from "react-native";
import { useState, useEffect } from "react";
import Ionicons from "@expo/vector-icons/Ionicons";

import * as styles from "@/assets/styles/stylesheets";
import Button from "@/components/common/Button";

interface GenericCreateModalProps<T> {
	initialState: T;
	visible: boolean;
	onClose: () => void;
	onSave: (newItem: T) => void;
	renderContent: (
		item: T,
		handleInputChange: (field: keyof T, value: any) => void,
	) => React.ReactNode;
}

export function GenericCreateModal<T extends { id?: any }>({
	initialState,
	visible,
	onClose,
	onSave,
	renderContent,
}: GenericCreateModalProps<T>) {
	const [newItem, setNewItem] = useState<T>(initialState);

	useEffect(() => {
		setNewItem(initialState);
	}, [initialState]);

	const handleInputChange = (field: keyof T, value: any) => {
		setNewItem((prev) => ({ ...prev, [field]: value }));
	};

	const handleSave = () => {
		onSave(newItem);
		visible = false;
	};

	return (
		<Modal
			animationType="fade"
			transparent={true}
			visible={visible}
			onRequestClose={onClose}
		>
			<View style={styles.modalPage.centeredView}>
				<View style={styles.modalPage.modalView}>
					<View style={styles.modalPage.header}>
						<View style={{ flex: 1 }} />
						<Ionicons
							name="close"
							size={24}
							color="#555"
							onPress={onClose}
						/>
					</View>

					<ScrollView
						contentContainerStyle={{
							width: "100%",
							paddingHorizontal: 20,
						}}
					>
						{renderContent(
							newItem,
							handleInputChange,
						)}
					</ScrollView>

					{/* Footer with Save */}
					<View style={styles.modalPage.footer}>
						
							<Button
								color="#4caf50"
								label="Salvar"
								iconName="save-outline"
								iconSize={20}
								onPress={handleSave}
							/>
					</View>
				</View>
			</View>
		</Modal>
	);
}
