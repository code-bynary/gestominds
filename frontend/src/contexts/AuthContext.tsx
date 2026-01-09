import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
    id: string;
    name: string;
    email: string;
}

interface Tenant {
    id: string;
    name: string;
}

interface AuthContextType {
    user: User | null;
    tenant: Tenant | null;
    login: (userData: any) => void;
    logout: () => void;
    isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [tenant, setTenant] = useState<Tenant | null>(null);

    useEffect(() => {
        const savedUser = localStorage.getItem('user');
        const savedTenant = localStorage.getItem('tenant');
        const token = localStorage.getItem('token');

        if (savedUser && savedTenant && token) {
            setUser(JSON.parse(savedUser));
            setTenant(JSON.parse(savedTenant));
        }
    }, []);

    const login = (data: any) => {
        setUser(data.user);
        setTenant(data.tenant);
        localStorage.setItem('token', data.accessToken);
        localStorage.setItem('refreshToken', data.refreshToken);
        localStorage.setItem('user', JSON.stringify(data.user));
        localStorage.setItem('tenant', JSON.stringify(data.tenant));
    };

    const logout = () => {
        setUser(null);
        setTenant(null);
        localStorage.clear();
    };

    return (
        <AuthContext.Provider value={{ user, tenant, login, logout, isAuthenticated: !!user }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth must be used within an AuthProvider');
    return context;
};
