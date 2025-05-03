
import React from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarIcon } from "lucide-react";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";

const Calendar: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [date, setDate] = React.useState<Date | undefined>(new Date());

  if (!user) {
    navigate("/");
    return null;
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar onNewTask={() => {}} />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header title="Calendrier" />
        
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-2xl font-bold text-gray-800 mb-6">
              Calendrier
            </h1>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <Card className="shadow-soft">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <CalendarIcon className="h-5 w-5 mr-2" />
                      Planification
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-center p-4">
                      <CalendarComponent
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                        className="rounded-md border"
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <div>
                <Card className="shadow-soft h-full">
                  <CardHeader>
                    <CardTitle>Événements du jour</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {date ? (
                      <div className="space-y-4">
                        <p className="text-muted-foreground text-sm">
                          {date.toLocaleDateString('fr-FR', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </p>
                        <div className="py-4 text-center text-muted-foreground">
                          Aucun événement prévu pour cette journée
                        </div>
                      </div>
                    ) : (
                      <p>Sélectionnez une date pour voir les événements</p>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Calendar;
