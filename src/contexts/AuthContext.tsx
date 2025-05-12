
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
  workspaceName?: string;
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
  const [session, setSession] = useState<any>(null);

  // Check for active session
  useEffect(() => {
    const checkSession = async () => {
      setIsLoading(true);
      
      try {
        console.log("Vérification de la session...");
        
        // Get existing session first
        const { data: { session: existingSession }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error("Erreur lors de la récupération de la session:", sessionError);
          setIsLoading(false);
          return;
        }
        
        if (existingSession) {
          console.log("Session existante trouvée:", existingSession.user?.id);
          setSession(existingSession);
          
          // Récupérer les données du profil
          const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', existingSession.user.id)
            .single();
          
          if (profileError) {
            console.error("Erreur lors de la récupération du profil:", profileError);
          } else if (profile) {
            console.log("Profil récupéré:", profile);
            setUser({
              id: profile.id,
              name: profile.name,
              email: profile.email,
              role: profile.role as UserRole,
              workspaceName: profile.workspaceid
            });
          }
        }
        
        // Set up auth state change listener
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
          async (event, currentSession) => {
            console.log("Changement d'état d'authentification:", event, currentSession?.user?.id);
            setSession(currentSession);
            
            if (currentSession?.user) {
              // Récupérer le profil utilisateur
              const { data: profile, error: profileError } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', currentSession.user.id)
                .single();
              
              if (profileError) {
                console.error("Erreur lors de la récupération du profil:", profileError);
                setUser(null);
              } else if (profile) {
                console.log("Profil mis à jour:", profile);
                setUser({
                  id: profile.id,
                  name: profile.name,
                  email: profile.email,
                  role: profile.role as UserRole,
                  workspaceName: profile.workspaceid
                });
              }
            } else {
              setUser(null);
            }
          }
        );
        
        return () => {
          subscription.unsubscribe();
        };
      } catch (error) {
        console.error('Erreur lors de la vérification de la session:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    checkSession();
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    
    try {
      console.log("Tentative de connexion avec:", email);
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      
      if (error) {
        console.error("Erreur de connexion:", error);
        throw error;
      }
      
      console.log("Connexion réussie:", data);
      toast.success(`Bienvenue !`);
      return data;
    } catch (error: any) {
      console.error('Erreur lors de la connexion:', error);
      toast.error(error.message || "Erreur lors de la connexion");
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string, workspaceName?: string) => {
    setIsLoading(true);
    
    try {
      console.log("Tentative d'inscription avec:", email, name, workspaceName);
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
      
      console.log("Inscription réussie:", data);
      toast.success("Compte créé avec succès! Veuillez vérifier votre email pour confirmer votre compte.");
      return data;
    } catch (error: any) {
      console.error('Erreur lors de l\'inscription:', error);
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
      console.error('Erreur lors de la déconnexion:', error);
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
      console.error('Erreur lors de la réinitialisation du mot de passe:', error);
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
