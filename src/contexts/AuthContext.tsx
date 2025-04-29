import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, Patient, Doctor, Admin } from '../types';
import { mockUsers, mockPatients, mockDoctors, mockAdmins } from '../utils/mockData';

type AuthUser = (Patient | Doctor | Admin) | null;

interface AuthContextType {
  user: AuthUser;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<AuthUser>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check for saved session
    const savedUser = localStorage.getItem('healthcareUser');
    if (savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        setUser(parsedUser);
      } catch (err) {
        localStorage.removeItem('healthcareUser');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    
    // Simulate API call
    return new Promise<boolean>((resolve) => {
      setTimeout(() => {
        // Find user by email (password check is omitted for demo)
        const foundUser = mockUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
        
        if (foundUser) {
          // Get full user details based on role
          let userDetails: AuthUser = null;
          
          if (foundUser.role === 'patient') {
            userDetails = mockPatients.find(p => p.id === foundUser.id) || null;
          } else if (foundUser.role === 'doctor') {
            userDetails = mockDoctors.find(d => d.id === foundUser.id) || null;
          } else if (foundUser.role === 'admin') {
            userDetails = mockAdmins.find(a => a.id === foundUser.id) || null;
          }
          
          if (userDetails) {
            setUser(userDetails);
            localStorage.setItem('healthcareUser', JSON.stringify(userDetails));
            setIsLoading(false);
            resolve(true);
          } else {
            setError('User details not found');
            setIsLoading(false);
            resolve(false);
          }
        } else {
          setError('Invalid email or password');
          setIsLoading(false);
          resolve(false);
        }
      }, 1000); // Simulate network delay
    });
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('healthcareUser');
  };

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated: !!user,
      isLoading,
      login,
      logout,
      error
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};