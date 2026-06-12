import {
	useState,
	ReactNode,
	useEffect,
	useCallback,
	createContext,
	useContext,
} from "react";
import { 
	authService, 
	LoginCredentials, 
	RegisterCredentials 
} from "./authService";
import { User } from "@/assets/types/User";

export interface AuthContextType {
	user: User | null;
	login: (credentials: LoginCredentials) => Promise<void>;
	logout: () => Promise<void>;
	register: (credentials: RegisterCredentials) => Promise<void>;
	getUser: () => Promise<User | null>;
	deleteUser: (userId: string) => Promise<void>;
	isAuthenticated: boolean;
	isLoading: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(
	undefined,
);

export function useAuth() {
	const context = useContext(AuthContext);
	if (context === undefined) {
		throw new Error("useAuth must be inside AuthProvider!");
	}
	return context;
}

export function AuthProvider({ children }: { children: ReactNode }) {
	const [user, setUser] = useState<User | null>(null);
	const [isLoading, setIsLoading] = useState(true);

	const loadUserFromStorage = useCallback(async () => {
		setIsLoading(true);
		try {
			const storedUser = await authService.getLoggedUser();
			if (storedUser) {
				setUser(storedUser);
			}
		} catch (error) {
			console.error("Falha ao carregar usuário do storage:", error);
			await authService.logout();
		} finally {
			setIsLoading(false);
		}
	}, []);

	useEffect(() => {
		loadUserFromStorage();
	}, [loadUserFromStorage]);

	const login = async (credentials: LoginCredentials) => {
		try {
			const data = await authService.login(credentials);
			if (data && data.user) {
				setUser(data.user);
			} else {
				throw new Error(
					"Dados de usuário não retornados após o login.",
				);
			}
		} catch (error) {
			console.error("Erro no login:", error);
			throw error;
		}
	};

	const logout = async () => {
		try {
			await authService.logout();
		} catch (error) {
			console.error("Erro no logout:", error);
		} finally {
			setUser(null); // Garante que o estado do usuário seja limpo na UI
		}
	};

	const register = async (credentials: RegisterCredentials) => {
		try {
			const data = await authService.register(credentials);
			if (data && data.user) {
				setUser(data.user);
			} else {
				throw new Error(
					"Dados de usuário não retornados após o registro.",
				);
			}
		} catch (error) {
			console.error("Erro no registro:", error);
			throw error;
		}
	};

	const getUser = async () => {
		try {
			const userData = await authService.getUser();
			setUser(userData);
			return userData;
		} catch (error) {
			console.error("Erro ao obter dados do usuário:", error);
			throw error;
		}
	};

	const deleteUser = async (userId: string) => {
		try {
			await authService.deleteUser(userId);
			setUser(null);
		} catch (error) {
			console.error("Erro ao excluir usuário:", error);
			throw error;
		}
	};

	// Value given to the context
	const value = {
		user,
		login,
		logout,
		register,
		getUser,
		deleteUser,
		isAuthenticated: !!user,
		isLoading,
	};

	return (
		<AuthContext.Provider value={value}>
			{/* Não renderiza nada até que a verificação inicial do usuário termine */}
			{!isLoading && children}
		</AuthContext.Provider>
	);
}
