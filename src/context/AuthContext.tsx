import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole, AuthState } from '../types/auth';

interface AuthContextType extends AuthState {
  login: (role: UserRole, email?: string, name?: string) => void;
  logout: () => void;
  switchRole: (role: UserRole) => void;
  hasPermission: (requiredRoles: UserRole[]) => boolean;
}

const DEFAULT_USERS: Record<UserRole, User> = {
  ADMIN: {
    id: 'USR-001',
    name: 'Dr. Rajesh Sharma',
    email: 'admin.sharma@terratech.gov.in',
    role: 'ADMIN',
    department: 'Ministry of Infrastructure Development',
    avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80'
  },
  OFFICER: {
    id: 'USR-002',
    name: 'Priya Deshmukh',
    email: 'p.deshmukh@mda.gov.in',
    role: 'OFFICER',
    department: 'District Land Acquisition Officer (Pune)',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80'
  },
  POLICYMAKER: {
    id: 'USR-003',
    name: 'Vikramaditya Verma',
    email: 'v.verma@niti.gov.in',
    role: 'POLICYMAKER',
    department: 'NITI Aayog Infrastructure Cell',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80'
  },
  VIEWER: {
    id: 'USR-004',
    name: 'Ananya Roy',
    email: 'ananya.roy@audit.gov.in',
    role: 'VIEWER',
    department: 'Public Accountability Cell',
    avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=150&q=80'
  }
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>(() => {
    const savedUser = localStorage.getItem('terratech_user');
    const savedToken = localStorage.getItem('terratech_token');
    if (savedUser && savedToken) {
      try {
        return {
          user: JSON.parse(savedUser),
          token: savedToken,
          isAuthenticated: true,
          isLoading: false
        };
      } catch (e) {
        // Fallback
      }
    }
    // Default to ADMIN for seamless demonstration
    return {
      user: DEFAULT_USERS.ADMIN,
      token: 'mock-jwt-token-admin',
      isAuthenticated: true,
      isLoading: false
    };
  });

  const login = (role: UserRole, email?: string, name?: string) => {
    const selectedUser = { ...DEFAULT_USERS[role] };
    if (email) selectedUser.email = email;
    if (name) selectedUser.name = name;
    
    const token = `jwt-token-${role.toLowerCase()}-${Date.now()}`;
    localStorage.setItem('terratech_user', JSON.stringify(selectedUser));
    localStorage.setItem('terratech_token', token);

    setAuthState({
      user: selectedUser,
      token,
      isAuthenticated: true,
      isLoading: false
    });
  };

  const logout = () => {
    localStorage.removeItem('terratech_user');
    localStorage.removeItem('terratech_token');
    setAuthState({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false
    });
  };

  const switchRole = (role: UserRole) => {
    login(role);
  };

  const hasPermission = (requiredRoles: UserRole[]): boolean => {
    if (!authState.user) return false;
    return requiredRoles.includes(authState.user.role);
  };

  return (
    <AuthContext.Provider
      value={{
        ...authState,
        login,
        logout,
        switchRole,
        hasPermission
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
