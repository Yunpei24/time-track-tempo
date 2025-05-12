
import React, { createContext, useState, useContext, useEffect } from "react";
import { toast } from "@/components/ui/sonner";
import { supabase } from "@/integrations/supabase/client";

// Types
export type UserRole = "member" | "manager";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  workspaceName?: string; // Add workspace name to user type
}

interface AuthContextProps {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, workspaceName?: string) => Promise<void>;
  logout: () => void;
  forgotPassword: (email: string) => Promise<void>;
}

// Create context
const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Check for active session
  useEffect(() => {
    const checkSession = async () => {
      setIsLoading(true);
      
      try {
        // Check if there's an active session
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) throw error;
        
        if (session) {
          // Get user profile data
          const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();
          
          if (profileError) throw profileError;
          
          // Set user data
          setUser({
            id: profile.id,
            name: profile.name,
            email: profile.email,
            role: profile.role as UserRole,
            workspaceName: profile.workspaceid
          });
        }
      } catch (error) {
        console.error('Error checking session:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    checkSession();
    
    // Listen for auth state changes
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session && (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED')) {
          // Get user profile data
          const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();
          
          if (!profileError && profile) {
            setUser({
              id: profile.id,
              name: profile.name,
              email: profile.email,
              role: profile.role as UserRole,
              workspaceName: profile.workspaceid
            });
          }
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
        }
      }
    );
    
    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      
      if (error) throw error;
      
      // User profile data is fetched in the auth state change listener
      toast.success(`Bienvenue !`);
    } catch (error: any) {
      console.error('Error logging in:', error);
      toast.error(error.message || "Erreur lors de la connexion");
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string, workspaceName?: string) => {
    setIsLoading(true);
    
    try {
      // Register the user
      const { data, error } = await supabase.auth.signUp({ 
        email, 
        password,
        options: {
          data: {
            name,
            role: "manager", // New users are managers of their workspace
            workspaceId: workspaceName || "Mon espace"
          }
        }
      });
      
      if (error) throw error;
      
      toast.success("Compte créé avec succès!");
    } catch (error: any) {
      console.error('Error registering:', error);
      toast.error(error.message || "Erreur lors de la création du compte");
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    
    try {
      const { error } = await supabase.auth.signOut();
      
      if (error) throw error;
      
      setUser(null);
      toast.success("Vous avez été déconnecté");
    } catch (error) {
      console.error('Error logging out:', error);
      toast.error("Erreur lors de la déconnexion");
    } finally {
      setIsLoading(false);
    }
  };

  const forgotPassword = async (email: string) => {
    setIsLoading(true);
    
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      
      if (error) throw error;
      
      toast.success("Si un compte existe avec cet email, vous recevrez un lien pour réinitialiser votre mot de passe.");
    } catch (error) {
      console.error('Error resetting password:', error);
      // Still show success message to prevent email enumeration
      toast.success("Si un compte existe avec cet email, vous recevrez un lien pour réinitialiser votre mot de passe.");
    } finally {
      setIsLoading(false);
    }
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
