
import React, { createContext, useState, useContext, useEffect } from "react";
import { toast } from "@/components/ui/sonner";

// Types
export type UserRole = "member" | "manager";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

interface AuthContextProps {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  forgotPassword: (email: string) => Promise<void>;
}

// Mock user data
const mockUsers = [
  {
    id: "1",
    name: "Jean Dupont",
    email: "jean@example.com",
    password: "password123",
    role: "manager" as UserRole,
  },
  {
    id: "2",
    name: "Marie Martin",
    email: "marie@example.com",
    password: "password123",
    role: "member" as UserRole,
  }
];

// Create context
const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    // Check if user is stored in localStorage (simulating persistence)
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    
    // Simulate API request delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Find user with matching email
    const foundUser = mockUsers.find(u => u.email === email);
    
    if (!foundUser || foundUser.password !== password) {
      setIsLoading(false);
      throw new Error("Email ou mot de passe invalide");
    }
    
    // Create user object without password
    const { password: _, ...userWithoutPassword } = foundUser;
    
    // Store user in localStorage
    localStorage.setItem("user", JSON.stringify(userWithoutPassword));
    
    setUser(userWithoutPassword);
    setIsLoading(false);
    toast.success(`Bienvenue, ${userWithoutPassword.name}!`);
  };

  const register = async (name: string, email: string, password: string) => {
    setIsLoading(true);
    
    // Simulate API request delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Check if email already exists
    const userExists = mockUsers.some(u => u.email === email);
    if (userExists) {
      setIsLoading(false);
      throw new Error("Cet email est déjà enregistré");
    }
    
    // Create new user
    const newUser = {
      id: `${mockUsers.length + 1}`,
      name,
      email,
      role: "member" as UserRole,
    };
    
    // Store user in localStorage
    localStorage.setItem("user", JSON.stringify(newUser));
    
    setUser(newUser);
    setIsLoading(false);
    toast.success("Compte créé avec succès!");
  };

  const logout = () => {
    localStorage.removeItem("user");
    setUser(null);
    toast.success("Vous avez été déconnecté");
  };

  const forgotPassword = async (email: string) => {
    setIsLoading(true);
    
    // Simulate API request delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const userExists = mockUsers.some(u => u.email === email);
    
    if (!userExists) {
      setIsLoading(false);
      throw new Error("Aucun compte trouvé avec cet email");
    }
    
    setIsLoading(false);
    toast.success("Si un compte existe avec cet email, vous recevrez un lien pour réinitialiser votre mot de passe.");
  };

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        isLoading, 
        isAuthenticated: !!user,
        login, 
        register, 
        logout,
        forgotPassword 
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
