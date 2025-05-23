
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
import Members from "./pages/Members";
import Reports from "./pages/Reports";
import Calendar from "./pages/Calendar";
import TimeTracking from "./pages/TimeTracking";
import Settings from "./pages/Settings";
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
      path="/members" 
      element={
        <ProtectedRoute>
          <Members />
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
    <Route 
      path="/calendar" 
      element={
        <ProtectedRoute>
          <Calendar />
        </ProtectedRoute>
      } 
    />
    <Route 
      path="/time-tracking" 
      element={
        <ProtectedRoute>
          <TimeTracking />
        </ProtectedRoute>
      } 
    />
    <Route 
      path="/settings" 
      element={
        <ProtectedRoute>
          <Settings />
        </ProtectedRoute>
      } 
    />
    <Route path="*" element={<NotFound />} />
  </Routes>
);

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <TooltipProvider>
          <AuthProvider>
            <TaskProvider>
              <TimerProvider>
                <Sonner />
                <Toaster />
                <AppRoutes />
              </TimerProvider>
            </TaskProvider>
          </AuthProvider>
        </TooltipProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
};

export default App;
