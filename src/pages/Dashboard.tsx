
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import Navbar from "../components/Navbar";
import LevelDisplay from "../components/LevelDisplay";
import RadarChart from "../components/RadarChart";
import { calculateLevelProgress } from "../utils/levelCalculator";
import LeaderboardCard from "../components/LeaderboardCard";
import { 
  Award, BookOpen, Brain, Dumbbell, Heart, Calendar, Clock, Trophy, 
  ChevronRight, Zap
} from "lucide-react";

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, isLoggedIn, getUsers } = useAuthStore();
  
  // Redirect if not logged in
  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/auth");
    }
  }, [isLoggedIn, navigate]);
  
  if (!user) return null;

  // Get all users for leaderboard
  const users = getUsers();
  
  // Get attribute icons
  const getAttributeIcon = (type: string) => {
    switch (type) {
      case "knowledge":
        return <BookOpen className="h-5 w-5" />;
      case "intelligence":
        return <Brain className="h-5 w-5" />;
      case "strength":
        return <Dumbbell className="h-5 w-5" />;
      case "health":
        return <Heart className="h-5 w-5" />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left Column - User Level & Stats */}
          <div className="md:col-span-1 space-y-6">
            <Card className="glass shadow-lg">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Your Level</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center">
                  <LevelDisplay user={user} size="lg" />
                  
                  <div className="mt-4 text-sm text-center">
                    <p>Keep growing to reach new heights!</p>
                  </div>
                  
                  <Button 
                    onClick={() => navigate("/level-up")} 
                    className="mt-6 w-full"
                  >
                    Level Up
                    <Zap className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            <Card className="glass shadow-lg">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center">
                  <Calendar className="h-5 w-5 mr-2" />
                  Daily Streak
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="text-4xl font-bold mb-2">{user.streakDays}</div>
                  <p className="text-sm text-muted-foreground">days in a row</p>
                </div>
              </CardContent>
            </Card>
            
            <LeaderboardCard 
              users={users}
              title="Leaderboard"
              maxUsers={5}
            />
          </div>
          
          {/* Middle Column - Attribute Chart */}
          <div className="md:col-span-1">
            <Card className="glass shadow-lg h-full">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Attribute Balance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-center items-center h-64">
                  <RadarChart attributes={user.attributes} size="lg" />
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Right Column - Attributes */}
          <div className="md:col-span-1 space-y-6">
            <Card className="glass shadow-lg">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center">
                  <Trophy className="h-5 w-5 mr-2" />
                  Attributes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {user.attributes.map((attr) => (
                    <div key={attr.type} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div 
                            className="w-8 h-8 rounded-full flex items-center justify-center mr-2"
                            style={{ backgroundColor: attr.color + "20" }}
                          >
                            {getAttributeIcon(attr.type)}
                          </div>
                          <span className="font-medium">{attr.name}</span>
                        </div>
                        <div className="flex items-center">
                          <span className="text-sm font-medium">Lvl {attr.level}</span>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            className="ml-2 p-0 h-7 w-7"
                            onClick={() => navigate("/level-up", { state: { activeTab: attr.type } })}
                          >
                            <ChevronRight className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Progress 
                          value={calculateLevelProgress(attr.xpCurrent, attr.xpRequired)} 
                          className="h-2"
                          style={{ 
                            backgroundColor: attr.color + "20",
                            "--progress-background": attr.color
                          } as any}
                        />
                        <span className="text-xs w-16 text-right">
                          {attr.xpCurrent}/{attr.xpRequired} XP
                        </span>
                      </div>
                      
                      <div className="flex flex-wrap gap-1">
                        {attr.subAttributes.map((subAttr) => (
                          <div 
                            key={subAttr.name}
                            className="px-2 py-0.5 text-xs rounded-full"
                            style={{ backgroundColor: attr.color + "20", color: attr.color }}
                          >
                            {subAttr.name} {subAttr.level}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
