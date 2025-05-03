
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/components/ui/sonner";
import { SettingsIcon, UserIcon, BellIcon } from "lucide-react";

const Settings: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [userSettings, setUserSettings] = useState({
    name: user?.name || "",
    email: user?.email || "",
    notifications: {
      email: true,
      push: true,
      taskReminders: true,
      weeklyReport: true,
    },
    theme: "light"
  });

  if (!user) {
    navigate("/");
    return null;
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserSettings({
      ...userSettings,
      [name]: value
    });
  };

  const handleNotificationChange = (key: string) => {
    setUserSettings({
      ...userSettings,
      notifications: {
        ...userSettings.notifications,
        [key]: !userSettings.notifications[key as keyof typeof userSettings.notifications]
      }
    });
  };

  const handleThemeChange = (theme: string) => {
    setUserSettings({
      ...userSettings,
      theme
    });
  };

  const handleSaveProfile = () => {
    toast.success("Profil mis à jour avec succès");
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar onNewTask={() => {}} />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header title="Paramètres" />
        
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
              <SettingsIcon className="h-6 w-6 mr-2" />
              Paramètres
            </h1>
            
            <Tabs defaultValue="profile" className="space-y-6">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="profile">Profil</TabsTrigger>
                <TabsTrigger value="notifications">Notifications</TabsTrigger>
                <TabsTrigger value="appearance">Apparence</TabsTrigger>
              </TabsList>
              
              <TabsContent value="profile">
                <Card className="shadow-soft">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <UserIcon className="h-5 w-5 mr-2" />
                      Information du profil
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Nom complet</Label>
                        <Input 
                          id="name" 
                          name="name" 
                          value={userSettings.name} 
                          onChange={handleInputChange} 
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input 
                          id="email" 
                          name="email" 
                          value={userSettings.email} 
                          onChange={handleInputChange} 
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="role">Rôle</Label>
                        <Input 
                          id="role" 
                          value={user.role} 
                          disabled 
                        />
                      </div>
                    </div>
                    
                    <Button onClick={handleSaveProfile}>
                      Enregistrer les modifications
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="notifications">
                <Card className="shadow-soft">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <BellIcon className="h-5 w-5 mr-2" />
                      Préférences de notification
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Notifications par email</p>
                          <p className="text-sm text-muted-foreground">Recevoir des notifications par email</p>
                        </div>
                        <Switch 
                          checked={userSettings.notifications.email}
                          onCheckedChange={() => handleNotificationChange('email')}
                        />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Notifications push</p>
                          <p className="text-sm text-muted-foreground">Recevoir des notifications dans le navigateur</p>
                        </div>
                        <Switch 
                          checked={userSettings.notifications.push}
                          onCheckedChange={() => handleNotificationChange('push')}
                        />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Rappels de tâches</p>
                          <p className="text-sm text-muted-foreground">Être notifié des échéances à venir</p>
                        </div>
                        <Switch 
                          checked={userSettings.notifications.taskReminders}
                          onCheckedChange={() => handleNotificationChange('taskReminders')}
                        />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Rapport hebdomadaire</p>
                          <p className="text-sm text-muted-foreground">Recevoir un résumé hebdomadaire de vos activités</p>
                        </div>
                        <Switch 
                          checked={userSettings.notifications.weeklyReport}
                          onCheckedChange={() => handleNotificationChange('weeklyReport')}
                        />
                      </div>
                    </div>
                    
                    <Button onClick={() => toast.success("Préférences de notification mises à jour")}>
                      Enregistrer les préférences
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="appearance">
                <Card className="shadow-soft">
                  <CardHeader>
                    <CardTitle>Thème et apparence</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-3 gap-4">
                      <div 
                        className={`p-4 border rounded-lg cursor-pointer transition-all ${
                          userSettings.theme === 'light' 
                            ? 'border-primary bg-primary/5' 
                            : 'border-muted hover:border-muted-foreground'
                        }`}
                        onClick={() => handleThemeChange('light')}
                      >
                        <div className="h-20 bg-white border rounded-md mb-2"></div>
                        <p className="font-medium text-center">Clair</p>
                      </div>
                      
                      <div 
                        className={`p-4 border rounded-lg cursor-pointer transition-all ${
                          userSettings.theme === 'dark' 
                            ? 'border-primary bg-primary/5' 
                            : 'border-muted hover:border-muted-foreground'
                        }`}
                        onClick={() => handleThemeChange('dark')}
                      >
                        <div className="h-20 bg-gray-800 border rounded-md mb-2"></div>
                        <p className="font-medium text-center">Sombre</p>
                      </div>
                      
                      <div 
                        className={`p-4 border rounded-lg cursor-pointer transition-all ${
                          userSettings.theme === 'system' 
                            ? 'border-primary bg-primary/5' 
                            : 'border-muted hover:border-muted-foreground'
                        }`}
                        onClick={() => handleThemeChange('system')}
                      >
                        <div className="h-20 bg-gradient-to-r from-white to-gray-800 border rounded-md mb-2"></div>
                        <p className="font-medium text-center">Système</p>
                      </div>
                    </div>
                    
                    <Button onClick={() => toast.success("Thème mis à jour")}>
                      Appliquer
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Settings;
