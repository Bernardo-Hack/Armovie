import { Text, Modal, View, ScrollView, StyleSheet } from "react-native";
import { useState, useEffect } from "react";
import Ionicons from "@expo/vector-icons/Ionicons";

import { colors } from "@/assets/styles/stylesheets";
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
			<View style={styles.centeredView}>
				<View style={styles.modalView}>
					{/* Header with Id and Close button */}
					<View style={styles.header}>
						<Text style={ styles.subtitle } >
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
					<View style={styles.footer}>
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

export const styles = StyleSheet.create({
	centeredView: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: "rgba(0, 0, 0, 0.4)",
	},
	modalView: {
		maxWidth: "75%",
		backgroundColor: colors.background,
		borderRadius: 15,
		padding: 20,
		boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.25)",
		elevation: 5,
	},
	header: {
		flexDirection: "row",
		justifyContent: "space-between",
		marginBottom: 10,
	},
	subtitle: {
		color: colors.textSecondary,
		fontSize: 14,
		marginBottom: 0,
	},
	footer: {
		flexDirection: "row",
		justifyContent: "space-between",
		marginTop: 20,
		alignItems: "flex-end",
	},
});
