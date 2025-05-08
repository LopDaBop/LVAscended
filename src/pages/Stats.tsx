
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import Navbar from "../components/Navbar";
import RadarChart from "../components/RadarChart";
import { calculateLevelProgress } from "../utils/levelCalculator";
import { Activity } from "../types";
import { 
  Award, Calendar, Activity as ActivityIcon, Target,
  BookOpen, Brain, Dumbbell, Heart, TrendingUp, Clock, History
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Stats = () => {
  const navigate = useNavigate();
  const { user, isLoggedIn } = useAuthStore();
  const [activeTab, setActiveTab] = useState("overview");
  
  // Mock activities history (This would come from a real database in a production app)
  const [activityHistory, setActivityHistory] = useState<Activity[]>([]);
  
  // Redirect if not logged in
  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/auth");
    }
  }, [isLoggedIn, navigate]);

  // Mock function to generate some sample activities for demo purposes
  // In a real app, this would be loaded from a database
  useEffect(() => {
    if (user) {
      // This is mock data - in a real app, you would fetch this from your backend
      const mockActivities: Activity[] = [
        {
          id: "1",
          userId: user.id,
          attributeType: "knowledge",
          description: "Studied React for 1 hour",
          xpGained: 50,
          timestamp: new Date(Date.now() - 86400000) // 1 day ago
        },
        {
          id: "2",
          userId: user.id,
          attributeType: "intelligence",
          subAttributeName: "creativity",
          description: "Solved a complex puzzle",
          xpGained: 30,
          timestamp: new Date(Date.now() - 172800000) // 2 days ago
        },
        {
          id: "3",
          userId: user.id,
          attributeType: "strength",
          subAttributeName: "endurance",
          description: "30 minute run",
          xpGained: 40,
          timestamp: new Date(Date.now() - 259200000) // 3 days ago
        }
      ];
      
      setActivityHistory(mockActivities);
    }
  }, [user]);

  if (!user) return null;
  
  // Calculate the dominant attribute (highest level)
  const dominantAttribute = [...user.attributes].sort((a, b) => b.level - a.level)[0];
  
  // Calculate how many days the user has been active since joining
  const daysActive = Math.floor(
    (new Date().getTime() - new Date(user.joinDate).getTime()) / (1000 * 60 * 60 * 24)
  );

  // Helper function to format date
  const formatDate = (date: Date): string => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Your Stats</h1>
          <p className="text-muted-foreground mt-2">Track your progress and see detailed statistics.</p>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          <TabsList>
            <TabsTrigger value="overview">
              <ActivityIcon className="h-4 w-4 mr-2" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="history">
              <History className="h-4 w-4 mr-2" />
              Activity History
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <Card className="glass shadow-lg">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center">
                    <Award className="h-4 w-4 mr-2" />
                    Current Level
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-bold">{user.level}</div>
                  <p className="text-sm text-muted-foreground mt-2">Overall level</p>
                </CardContent>
              </Card>
              
              <Card className="glass shadow-lg">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center">
                    <Calendar className="h-4 w-4 mr-2" />
                    Streak
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-bold">{user.streakDays}</div>
                  <p className="text-sm text-muted-foreground mt-2">days in a row</p>
                </CardContent>
              </Card>
              
              <Card className="glass shadow-lg">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center">
                    <ActivityIcon className="h-4 w-4 mr-2" />
                    Dominant Attribute
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div 
                    className="text-4xl font-bold"
                    style={{ color: dominantAttribute.color }}
                  >
                    {dominantAttribute.name}
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">Level {dominantAttribute.level}</p>
                </CardContent>
              </Card>
              
              <Card className="glass shadow-lg">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center">
                    <Target className="h-4 w-4 mr-2" />
                    Days Active
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-bold">
                    {daysActive}
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">since joining</p>
                </CardContent>
              </Card>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
              {activityHistory.length > 0 ? (
                <Card className="glass shadow-lg lg:col-span-2">
                  <CardHeader className="pb-2">
                    <CardTitle className="flex items-center">
                      <ActivityIcon className="h-5 w-5 mr-2" />
                      Weekly Activity
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-80">
                      <div className="flex h-full items-center justify-center">
                        <p className="text-muted-foreground">
                          Not enough activity data to generate a meaningful chart.
                          Start tracking your activities to see your progress here!
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card className="glass shadow-lg lg:col-span-2">
                  <CardHeader className="pb-2">
                    <CardTitle className="flex items-center">
                      <ActivityIcon className="h-5 w-5 mr-2" />
                      Weekly Activity
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-80 flex items-center justify-center text-center">
                      <div>
                        <p className="text-muted-foreground mb-2">
                          No activity data recorded yet.
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Start tracking your activities on the Level Up page to see your progress here!
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
              
              <Card className="glass shadow-lg">
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center">
                    <TrendingUp className="h-5 w-5 mr-2" />
                    Attribute Balance
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex items-center justify-center">
                  <div className="h-64 w-full">
                    <RadarChart attributes={user.attributes} size="md" />
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
              <Card className="glass shadow-lg">
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center">
                    <TrendingUp className="h-5 w-5 mr-2" />
                    Level Progress
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-72 flex items-center justify-center text-center">
                    <div>
                      <p className="text-muted-foreground mb-2">
                        Not enough data to show level progression.
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Continue leveling up to see your progress here!
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="glass shadow-lg lg:col-span-2">
                <CardHeader className="pb-2">
                  <CardTitle>Attribute Details</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {user.attributes.map((attr) => (
                      <div key={attr.type} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            {attr.type === "knowledge" && <BookOpen className="h-5 w-5 mr-2" style={{ color: attr.color }} />}
                            {attr.type === "intelligence" && <Brain className="h-5 w-5 mr-2" style={{ color: attr.color }} />}
                            {attr.type === "strength" && <Dumbbell className="h-5 w-5 mr-2" style={{ color: attr.color }} />}
                            {attr.type === "health" && <Heart className="h-5 w-5 mr-2" style={{ color: attr.color }} />}
                            <span className="font-medium">{attr.name}</span>
                          </div>
                          <div className="text-sm">
                            Level {attr.level}
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Progress 
                            value={calculateLevelProgress(attr.xpCurrent, attr.xpRequired)} 
                            className="h-2"
                            style={{ 
                              backgroundColor: attr.color +  "20",
                              "--progress-background": attr.color
                            } as any}
                          />
                          <span className="text-xs w-16 text-right">
                            {attr.xpCurrent}/{attr.xpRequired} XP
                          </span>
                        </div>
                        
                        <div className="space-y-3">
                          {attr.subAttributes.map((subAttr) => (
                            <div key={subAttr.name} className="pl-6">
                              <div className="flex items-center justify-between text-sm">
                                <div className="flex items-center">
                                  <div className="w-2 h-2 rounded-full mr-2" style={{ backgroundColor: attr.color }}></div>
                                  <span className="capitalize">{subAttr.name}</span>
                                </div>
                                <span className="text-xs">Lvl {subAttr.level}</span>
                              </div>
                              <div className="flex items-center gap-2 mt-1">
                                <Progress 
                                  value={calculateLevelProgress(subAttr.xpCurrent, subAttr.xpRequired)} 
                                  className="h-1.5"
                                  style={{ 
                                    backgroundColor: attr.color +  "20",
                                    "--progress-background": attr.color
                                  } as any}
                                />
                                <span className="text-xs w-16 text-right">
                                  {subAttr.xpCurrent}/{subAttr.xpRequired}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="history">
            <Card className="glass shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <History className="h-5 w-5 mr-2" />
                  Activity History
                </CardTitle>
              </CardHeader>
              <CardContent>
                {activityHistory.length > 0 ? (
                  <div className="space-y-4">
                    {activityHistory.map((activity) => {
                      const attribute = user.attributes.find(attr => attr.type === activity.attributeType);
                      return (
                        <div 
                          key={activity.id} 
                          className="flex items-start justify-between p-4 rounded-lg border border-border/40 bg-card/30"
                        >
                          <div className="flex items-start gap-3">
                            <div 
                              className="p-2 rounded-full" 
                              style={{ backgroundColor: attribute?.color + '20' }}
                            >
                              {activity.attributeType === "knowledge" && <BookOpen className="h-5 w-5" style={{ color: attribute?.color }} />}
                              {activity.attributeType === "intelligence" && <Brain className="h-5 w-5" style={{ color: attribute?.color }} />}
                              {activity.attributeType === "strength" && <Dumbbell className="h-5 w-5" style={{ color: attribute?.color }} />}
                              {activity.attributeType === "health" && <Heart className="h-5 w-5" style={{ color: attribute?.color }} />}
                            </div>
                            <div>
                              <h4 className="font-medium">{activity.description}</h4>
                              <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
                                <span className="flex items-center">
                                  <Clock className="h-3 w-3 mr-1" />
                                  {formatDate(activity.timestamp)}
                                </span>
                                <span className="flex items-center">
                                  <ActivityIcon className="h-3 w-3 mr-1" />
                                  {activity.attributeType}
                                  {activity.subAttributeName && ` > ${activity.subAttributeName}`}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="text-sm font-medium">
                            +{activity.xpGained} XP
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="py-12 text-center">
                    <ActivityIcon className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
                    <h3 className="text-lg font-medium mb-2">No activities yet</h3>
                    <p className="text-muted-foreground max-w-md mx-auto">
                      Track your activities on the Level Up page to see your activity history here.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Stats;
