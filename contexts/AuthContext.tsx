import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { createContext, useEffect, useState } from "react";

type AuthContextType = {
    user: string | null;
    login: (email: string, password: string) => Promise<void>;
    register: (email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
}

type AuthStorageType = {
    registeredUsers: { email: string, password: string }[];
    currentUser: { email: string } | null;
}

async function getAuthStorage(): Promise<AuthStorageType> { 
    try {
        const authStorage = await AsyncStorage.getItem('auth');
        console.debug("Retrieved auth storage:", authStorage);
        if (authStorage) { 
            return JSON.parse(authStorage) as AuthStorageType;
        }
    } catch {
        return { registeredUsers: [], currentUser: null };
    }

    return { registeredUsers: [], currentUser: null };
}

export const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const [user, setUser] = useState<string | null>(null);

    async function login(email: string, password: string) {
        const authStorage = await getAuthStorage();
        const user = authStorage.registeredUsers.find(u => u.email === email && u.password === password);
        if (user) {
            authStorage.currentUser = { email: user.email };
            await AsyncStorage.setItem('auth', JSON.stringify(authStorage));
            console.log('User logged in:', user.email);
            setUser(user.email);
        } else {
            throw new Error('Invalid credentials');
        }
    }

    async function register(email: string, password: string) {
        const authStorage = await getAuthStorage();
        authStorage.registeredUsers.push({ email, password });
        await AsyncStorage.setItem('auth', JSON.stringify(authStorage));
    }

    async function logout() {
        console.log('User logging out');
        const authStorage = await getAuthStorage();
        authStorage.currentUser = null;
        await AsyncStorage.setItem('auth', JSON.stringify(authStorage));
        setUser(null);
        router.replace('/(auth)/login');
    }

    useEffect(() => {
        getAuthStorage().then(authStorage => {
            setUser(authStorage.currentUser?.email || null);
            if (authStorage.currentUser) {
                console.info("User is logged in:", authStorage.currentUser.email);
                router.replace('/');
            } else {
                router.replace('/(auth)/login');
            }
        });
    }, [router]);

    return (
        <AuthContext.Provider value={{ user, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    )
}