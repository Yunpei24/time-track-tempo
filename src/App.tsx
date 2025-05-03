
import { useState, useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import Tasks from "./pages/Tasks";
import Projects from "./pages/Projects";
import Reports from "./pages/Reports";
import NotFound from "./pages/NotFound";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { TaskProvider } from "./contexts/TaskContext";
import { TimerProvider } from "./contexts/TimerContext";

const queryClient = new QueryClient();

// Protected route component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading } = useAuth();
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-gray-500">Chargement...</div>
      </div>
    );
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/" />;
  }
  
  return <>{children}</>;
};

const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<Index />} />
    <Route 
      path="/dashboard" 
      element={
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
      } 
    />
    <Route 
      path="/tasks" 
      element={
        <ProtectedRoute>
          <Tasks />
        </ProtectedRoute>
      } 
    />
    <Route 
      path="/projects" 
      element={
        <ProtectedRoute>
          <Projects />
        </ProtectedRoute>
      } 
    />
    <Route 
      path="/reports" 
      element={
        <ProtectedRoute>
          <Reports />
        </ProtectedRoute>
      } 
    />
    <Route path="*" element={<NotFound />} />
  </Routes>
);

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <TaskProvider>
            <TimerProvider>
              <Toaster />
              <Sonner />
              <BrowserRouter>
                <AppRoutes />
              </BrowserRouter>
            </TimerProvider>
          </TaskProvider>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
