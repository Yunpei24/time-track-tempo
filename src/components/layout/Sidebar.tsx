
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
        "sidebar h-screen flex flex-col text-sidebar-foreground transition-all duration-300 ease-in-out",
        collapsed ? "collapsed w-20" : "w-64",
        "bg-gradient-to-b from-blue-50 to-indigo-50 border-r border-blue-100"
      )}
    >
      {/* Sidebar Header */}
      <div className="p-4 flex items-center justify-between border-b border-blue-100">
        <div className="flex items-center">
          <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
            <ClockIcon className="h-4 w-4 text-white" />
          </div>
          {!collapsed && (
            <span className="ml-3 font-bold text-lg text-blue-700">TimeTrek</span>
          )}
        </div>
        <button
          onClick={toggleSidebar}
          className="text-blue-600/70 hover:text-blue-700"
        >
          <PanelLeftIcon
            className={cn("h-5 w-5", collapsed && "rotate-180")}
          />
        </button>
      </div>

      {/* User Info */}
      <div className="p-4 border-b border-blue-100">
        <div className="flex items-center">
          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
            <span className="text-blue-600 font-bold">
              {user?.name.split(" ").map((n) => n[0]).join("")}
            </span>
          </div>
          {!collapsed && (
            <div className="ml-3">
              <div className="font-medium text-blue-800">{user?.name}</div>
              <div className="text-xs text-blue-600/70 capitalize">
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
            <div className="text-xs uppercase text-blue-700/50 px-3 mb-2">
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
                    ? "bg-blue-100/80 text-blue-800"
                    : "hover:bg-blue-100/50 text-blue-700/70 hover:text-blue-800"
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
                    ? "bg-blue-100/80 text-blue-800"
                    : "hover:bg-blue-100/50 text-blue-700/70 hover:text-blue-800"
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
                    ? "bg-blue-100/80 text-blue-800"
                    : "hover:bg-blue-100/50 text-blue-700/70 hover:text-blue-800"
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
                      ? "bg-blue-100/80 text-blue-800"
                      : "hover:bg-blue-100/50 text-blue-700/70 hover:text-blue-800"
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
                    ? "bg-blue-100/80 text-blue-800"
                    : "hover:bg-blue-100/50 text-blue-700/70 hover:text-blue-800"
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
            <div className="text-xs uppercase text-blue-700/50 px-3 mb-2">
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
                    ? "bg-blue-100/80 text-blue-800"
                    : "hover:bg-blue-100/50 text-blue-700/70 hover:text-blue-800"
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
                    ? "bg-blue-100/80 text-blue-800"
                    : "hover:bg-blue-100/50 text-blue-700/70 hover:text-blue-800"
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
                    ? "bg-blue-100/80 text-blue-800"
                    : "hover:bg-blue-100/50 text-blue-700/70 hover:text-blue-800"
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
                className="w-full flex items-center px-3 py-2 rounded-lg transition-colors hover:bg-red-100/30 text-blue-700/70 hover:text-red-600"
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
      <div className="p-4 border-t border-blue-100">
        <Button
          onClick={onNewTask}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white"
        >
          <PlusIcon className="h-5 w-5" />
          {!collapsed && <span className="nav-text ml-2">Nouvelle tâche</span>}
        </Button>
      </div>
    </div>
  );
};

export default Sidebar;
