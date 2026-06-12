import { Text, Modal, View, ScrollView } from "react-native";
import { useState, useEffect } from "react";
import Ionicons from "@expo/vector-icons/Ionicons";

import * as styles from "@/assets/styles/stylesheets";
import Button from "@/components/common/Button";

interface GenericEditModalProps<T> {
	item: T;
	visible: boolean;
	onClose: () => void;
	onSave: (updatedItem: T) => void;
	onDelete?: () => void;
	renderContent: (
		item: T,
		isEditing: boolean,
		handleInputChange: (field: keyof T, value: any) => void,
	) => React.ReactNode;
}

export function GenericEditModal<T extends { id: any }>({
	item,
	visible,
	onClose,
	onSave,
	onDelete,
	renderContent,
}: GenericEditModalProps<T>) {
	const [isEditing, setIsEditing] = useState(false);
	const [editableItem, setEditableItem] = useState<T>(item);

	useEffect(() => {
		setEditableItem(item);
		setIsEditing(false);
	}, [item]);

	const handleInputChange = (field: keyof T, value: any) => {
		setEditableItem((prev) => ({ ...prev, [field]: value }));
	};

	const handleSave = () => {
		onSave(editableItem);
		setIsEditing(false);
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
					{/* Header with Id and Close button */}
					<View style={styles.modalPage.header}>
						<Text
							style={[
								styles.modalPage.subtitle,
								{ marginBottom: 0 },
							]}
						>
							{`ID: ${item.id}`}
						</Text>
						<View style={{ flex: 1 }} />
						<Ionicons
							name="close"
							size={20}
							color="#555"
							onPress={onClose}
						/>
					</View>

					{/* Content area with dynamic form fields */}
					<ScrollView
						contentContainerStyle={{
							width: "100%",
							paddingHorizontal: 20,
						}}
					>
						{renderContent(
							editableItem,
							isEditing,
							handleInputChange,
						)}
					</ScrollView>

					{/* Footer with Edit/Save and Delete buttons */}
					<View style={styles.modalPage.footer}>
						<Button
							color="#f00"
							label="Excluir"
							iconName="trash-outline"
							iconSize={20}
							onPress={onDelete}
						/>

						<View style={{ flex: 1 }} />
						{isEditing ? (
							<Button
								color="#4caf50"
								label="Salvar"
								iconName="save-outline"
								iconSize={20}
								onPress={handleSave}
							/>
						) : (
							<Button
								color="#007bff"
								label="Editar"
								iconName="pencil-outline"
								iconSize={20}
								onPress={() => setIsEditing(true)}
							/>
						)}
					</View>
				</View>
			</View>
		</Modal>
	);
}
