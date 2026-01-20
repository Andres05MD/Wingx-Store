'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import {
    User,
    onAuthStateChanged,
    signInWithPopup,
    signOut,
    GoogleAuthProvider,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    updateProfile
} from 'firebase/auth';
import { auth, googleProvider } from '@/lib/firebase';
import { toast } from 'sonner';

interface AuthContextType {
    user: User | null;
    loading: boolean;
    signInWithGoogle: () => Promise<void>;
    signInWithEmail: (email: string, password: string) => Promise<void>;
    registerWithEmail: (email: string, password: string, name: string) => Promise<void>;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const signInWithGoogle = async () => {
        try {
            await signInWithPopup(auth, googleProvider);
            toast.success('¡Bienvenido! Has iniciado sesión correctamente.');
        } catch (error: any) {
            console.error('Error signing in with Google', error);
            const errorMessage = error.message || 'Error al iniciar sesión.';
            toast.error(errorMessage);
            throw error;
        }
    };

    const signInWithEmail = async (email: string, password: string) => {
        try {
            await signInWithEmailAndPassword(auth, email, password);
            toast.success('¡Bienvenido de nuevo!');
        } catch (error: any) {
            console.error('Error signing in with email', error);
            let msg = 'Error al iniciar sesión';
            if (error.code === 'auth/invalid-credential') msg = 'Credenciales incorrectas';
            if (error.code === 'auth/user-not-found') msg = 'Usuario no encontrado';
            if (error.code === 'auth/wrong-password') msg = 'Contraseña incorrecta';
            toast.error(msg);
            throw error;
        }
    };

    const registerWithEmail = async (email: string, password: string, name: string) => {
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            await updateProfile(userCredential.user, {
                displayName: name
            });
            toast.success(`¡Cuenta creada! Bienvenido, ${name}.`);
        } catch (error: any) {
            console.error('Error registering with email', error);
            let msg = 'Error al registrarse';
            if (error.code === 'auth/email-already-in-use') msg = 'El correo ya está registrado';
            if (error.code === 'auth/weak-password') msg = 'La contraseña es muy débil';
            toast.error(msg);
            throw error;
        }
    };

    const logout = async () => {
        try {
            await signOut(auth);
            toast.info('Sesión cerrada');
        } catch (error) {
            console.error('Error signing out', error);
            toast.error('Error al cerrar sesión');
        }
    };

    return (
        <AuthContext.Provider value={{ user, loading, signInWithGoogle, signInWithEmail, registerWithEmail, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
