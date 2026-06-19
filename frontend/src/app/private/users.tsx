import { View } from "react-native";
import { Toast } from "react-native-toast-message/lib/src/Toast";
import { useEffect, useState, useMemo } from "react";

import * as styles from "@/assets/styles/stylesheets";
import Header from "@/components/common/Header";
import { GenericList } from "@/components/common/GenericList";
import { GenericCreateModal } from "@/components/common/GenericCreateModal";

import { UserListHeader } from "@/components/pages/users/UserListHeader";
import { UserListRow } from "@/components/pages/users/UserListRow";
import { UserModalContent } from "@/components/pages/users/UserModalContent";

import { User, initialUserState } from "@/assets/types/User";
import { userService } from "@/services/userService";
import { useAuth } from "@/services/AuthProvider";

type SortKey = keyof User | null;
type SortDirection = "asc" | "desc";



export default function UsersTab() {
	const [users, setUsers] = useState<User[]>([]);
	const [sortKey, setSortKey] = useState<SortKey>(null);
	const [sortDirection, setSortDirection] = useState<SortDirection>("asc");
	const [loading, setLoading] = useState(true);
	const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
	const { register } = useAuth();

	const sortedUsers = useMemo(() => {
		if (!sortKey) return users;

		const sorted = [...users].sort((a, b) => {
			const aValue = a[sortKey];
			const bValue = b[sortKey];

			if (aValue == null) return -1;
			if (bValue == null) return 1;

			if (typeof aValue === "string" && typeof bValue === "string") {
				return aValue.localeCompare(bValue);
			}

			if (aValue < bValue) return -1;
			if (aValue > bValue) return 1;
			return 0;
		});

		if (sortDirection === "desc") {
			sorted.reverse();
		}

		return sorted;
	}, [users, sortKey, sortDirection]);

	const fetchAllData = async () => {
		setLoading(true);
		try {
			const usersData = await userService.getAllUsers();
			setUsers(usersData);
		} catch (error: any) {
			if (error.message === "Not Found" || error.message?.includes("404")) {
				Toast.show({
					type: "info",
					text1: "Nenhum usuário encontrado!",
				});
				setUsers([]);
			} else {
				Toast.show({
					type: "error",
					text1: "Erro ao carregar usuários",
					text2: error.message || "Não foi possível buscar os usuários.",
				});
			}
		} finally {
			setLoading(false);
		}
	};

	const handleSort = (key: SortKey) => {
		if (key === null) {
			setSortKey(null);
			setSortDirection("asc");
			return;
		}
		if (sortKey === key) {
			setSortDirection(sortDirection === "asc" ? "desc" : "asc");
		} else {
			setSortKey(key);
			setSortDirection("asc");
		}
	};

	const handleCreateUser = async (newUserData: any) => {
		try {
			if (!newUserData.name || !newUserData.email) {
				Toast.show({ type: "error", text1: "Dados incompletos", text2: "Nome, email e senha são obrigatórios." });
				return;
			}
			newUserData.password = '123456'
			await register(newUserData);
			Toast.show({ type: "success", text1: "Usuário criado com sucesso!" });
			fetchAllData();
			setIsCreateModalVisible(false);
		} catch (error: any) {
			Toast.show({ type: "error", text1: "Erro ao criar usuário", text2: error.message });
		}
	};

	const handleUpdateUser = async (updatedUser: User) => {
		try {
			const { id, createdAt, updatedAt, ...userToUpdate } = updatedUser;
			await userService.updateUser(id, userToUpdate);
			Toast.show({ type: "success", text1: "Usuário atualizado com sucesso!" });
			fetchAllData();
		} catch (error: any) {
			Toast.show({ type: "error", text1: "Erro ao atualizar usuário", text2: error.message });
		}
	};

	const handleDeleteUser = async (id: string) => {
		try {
			await userService.deleteUser(id);
			Toast.show({ type: "success", text1: "Usuário excluído com sucesso!" });
			fetchAllData();
		} catch (error: any) {
			Toast.show({ type: "error", text1: "Erro ao excluir usuário", text2: error.message });
		}
	};

	useEffect(() => {
		fetchAllData();
	}, []);

	return (
		<View style={styles.page.background}>
			<Header pageName="Usuários" subtitle="Gerenciamento de Usuários" fetchItems={fetchAllData} setIsCreateModalVisible={setIsCreateModalVisible} />

			<GenericList
				loading={loading}
				items={sortedUsers}
				itemTypeName="usuário"
				onSort={handleSort}
				sortKey={sortKey}
				sortDirection={sortDirection}
				onSaveItem={handleUpdateUser}
				onDeleteItem={handleDeleteUser}
				HeaderComponent={UserListHeader}
				RowComponent={UserListRow}
				editModalRenderContent={(user, isEditing, handleInputChange) => (
					<UserModalContent user={user as User} isEditing={isEditing} handleInputChange={handleInputChange} />
				)}
			/>

			<GenericCreateModal
				initialState={initialUserState as any}
				visible={isCreateModalVisible}
				onClose={() => setIsCreateModalVisible(false)}
				onSave={handleCreateUser}
				renderContent={(user, handleInputChange) => (
					<UserModalContent user={user as User} isEditing={true} handleInputChange={handleInputChange} isCreating={true} />
				)}
			/>
		</View>
	);
}
