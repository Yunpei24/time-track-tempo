
import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  CalendarIcon,
  ClockIcon,
  HomeIcon,
  InboxIcon,
  PanelLeftIcon,
  ProjectorIcon,
  SettingsIcon,
  UsersIcon,
  ChartBarIcon,
  LogOutIcon,
  PlusIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";

interface SidebarProps {
  onNewTask: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onNewTask }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <div
      className={cn(
        "sidebar bg-sidebar h-screen flex flex-col text-sidebar-foreground",
        collapsed ? "collapsed w-20" : "w-64"
      )}
    >
      {/* Sidebar Header */}
      <div className="p-4 flex items-center justify-between border-b border-sidebar-border">
        <div className="flex items-center">
          <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
            <ClockIcon className="h-4 w-4 text-white" />
          </div>
          {!collapsed && (
            <span className="ml-3 font-bold text-lg">TimeTrek</span>
          )}
        </div>
        <button
          onClick={toggleSidebar}
          className="text-sidebar-foreground/70 hover:text-sidebar-foreground"
        >
          <PanelLeftIcon
            className={cn("h-5 w-5", collapsed && "rotate-180")}
          />
        </button>
      </div>

      {/* User Info */}
      <div className="p-4 border-b border-sidebar-border">
        <div className="flex items-center">
          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
            <span className="text-blue-600 font-bold">
              {user?.name.split(" ").map((n) => n[0]).join("")}
            </span>
          </div>
          {!collapsed && (
            <div className="ml-3">
              <div className="font-medium">{user?.name}</div>
              <div className="text-xs text-sidebar-foreground/70 capitalize">
                {user?.role}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4">
        <div className="px-3 mb-4">
          {!collapsed && (
            <div className="text-xs uppercase text-sidebar-foreground/50 px-3 mb-2">
              Navigation
            </div>
          )}
          <ul className="space-y-1">
            <li>
              <Link
                to="/dashboard"
                className={cn(
                  "flex items-center px-3 py-2 rounded-lg transition-colors",
                  isActive("/dashboard")
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : "hover:bg-sidebar-accent/50 text-sidebar-foreground/70 hover:text-sidebar-accent-foreground"
                )}
              >
                <HomeIcon className="h-5 w-5" />
                {!collapsed && <span className="nav-text ml-3">Dashboard</span>}
              </Link>
            </li>
            <li>
              <Link
                to="/tasks"
                className={cn(
                  "flex items-center px-3 py-2 rounded-lg transition-colors",
                  isActive("/tasks")
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : "hover:bg-sidebar-accent/50 text-sidebar-foreground/70 hover:text-sidebar-accent-foreground"
                )}
              >
                <InboxIcon className="h-5 w-5" />
                {!collapsed && <span className="nav-text ml-3">Tâches</span>}
              </Link>
            </li>
            <li>
              <Link
                to="/projects"
                className={cn(
                  "flex items-center px-3 py-2 rounded-lg transition-colors",
                  isActive("/projects")
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : "hover:bg-sidebar-accent/50 text-sidebar-foreground/70 hover:text-sidebar-accent-foreground"
                )}
              >
                <ProjectorIcon className="h-5 w-5" />
                {!collapsed && <span className="nav-text ml-3">Projets</span>}
              </Link>
            </li>
            {user?.role === "manager" && (
              <li>
                <Link
                  to="/team"
                  className={cn(
                    "flex items-center px-3 py-2 rounded-lg transition-colors",
                    isActive("/team")
                      ? "bg-sidebar-accent text-sidebar-accent-foreground"
                      : "hover:bg-sidebar-accent/50 text-sidebar-foreground/70 hover:text-sidebar-accent-foreground"
                  )}
                >
                  <UsersIcon className="h-5 w-5" />
                  {!collapsed && <span className="nav-text ml-3">Équipe</span>}
                </Link>
              </li>
            )}
            <li>
              <Link
                to="/reports"
                className={cn(
                  "flex items-center px-3 py-2 rounded-lg transition-colors",
                  isActive("/reports")
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : "hover:bg-sidebar-accent/50 text-sidebar-foreground/70 hover:text-sidebar-accent-foreground"
                )}
              >
                <ChartBarIcon className="h-5 w-5" />
                {!collapsed && <span className="nav-text ml-3">Rapports</span>}
              </Link>
            </li>
          </ul>
        </div>

        <div className="px-3 mb-4">
          {!collapsed && (
            <div className="text-xs uppercase text-sidebar-foreground/50 px-3 mb-2">
              Personnel
            </div>
          )}
          <ul className="space-y-1">
            <li>
              <Link
                to="/calendar"
                className={cn(
                  "flex items-center px-3 py-2 rounded-lg transition-colors",
                  isActive("/calendar")
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : "hover:bg-sidebar-accent/50 text-sidebar-foreground/70 hover:text-sidebar-accent-foreground"
                )}
              >
                <CalendarIcon className="h-5 w-5" />
                {!collapsed && <span className="nav-text ml-3">Calendrier</span>}
              </Link>
            </li>
            <li>
              <Link
                to="/time-tracking"
                className={cn(
                  "flex items-center px-3 py-2 rounded-lg transition-colors",
                  isActive("/time-tracking")
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : "hover:bg-sidebar-accent/50 text-sidebar-foreground/70 hover:text-sidebar-accent-foreground"
                )}
              >
                <ClockIcon className="h-5 w-5" />
                {!collapsed && <span className="nav-text ml-3">Chrono</span>}
              </Link>
            </li>
            <li>
              <Link
                to="/settings"
                className={cn(
                  "flex items-center px-3 py-2 rounded-lg transition-colors",
                  isActive("/settings")
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : "hover:bg-sidebar-accent/50 text-sidebar-foreground/70 hover:text-sidebar-accent-foreground"
                )}
              >
                <SettingsIcon className="h-5 w-5" />
                {!collapsed && (
                  <span className="nav-text ml-3">Paramètres</span>
                )}
              </Link>
            </li>
            <li>
              <button
                onClick={logout}
                className="w-full flex items-center px-3 py-2 rounded-lg transition-colors hover:bg-sidebar-accent/50 text-sidebar-foreground/70 hover:text-sidebar-accent-foreground"
              >
                <LogOutIcon className="h-5 w-5" />
                {!collapsed && (
                  <span className="nav-text ml-3">Déconnexion</span>
                )}
              </button>
            </li>
          </ul>
        </div>
      </nav>

      {/* New Task Button */}
      <div className="p-4 border-t border-sidebar-border">
        <Button
          onClick={onNewTask}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white"
        >
          <PlusIcon className="h-5 w-5" />
          {!collapsed && <span className="nav-text ml-2">Nouvelle tâche</span>}
        </Button>
      </div>
    </div>
  );
};

export default Sidebar;
