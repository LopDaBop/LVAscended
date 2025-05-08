
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Navbar from "../components/Navbar";
import StudyTimer from "../components/StudyTimer";
import ActivityLogger from "../components/ActivityLogger";
import { BookOpen, Brain, Dumbbell, Heart } from "lucide-react";
import { AttributeType } from "../types";

interface LocationState {
  activeTab?: AttributeType;
}

const LevelUp = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isLoggedIn } = useAuthStore();
  
  // Get active tab from location state, if available
  const locationState = location.state as LocationState | undefined;
  const defaultTab = locationState?.activeTab || "knowledge";
  
  const [activeTab, setActiveTab] = useState<AttributeType>(defaultTab);
  
  // Redirect if not logged in
  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/auth");
    }
  }, [isLoggedIn, navigate]);
  
  if (!user) return null;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Level Up</h1>
          <p className="text-muted-foreground mt-2">Complete activities to gain XP and level up your attributes.</p>
        </div>
        
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as AttributeType)} className="space-y-8">
          <TabsList className="grid grid-cols-4 max-w-3xl">
            <TabsTrigger 
              value="knowledge" 
              className="data-[state=active]:bg-knowledge/20 data-[state=active]:text-knowledge"
            >
              <BookOpen className="h-5 w-5 mr-2" />
              Knowledge
            </TabsTrigger>
            <TabsTrigger 
              value="intelligence"
              className="data-[state=active]:bg-intelligence/20 data-[state=active]:text-intelligence"
            >
              <Brain className="h-5 w-5 mr-2" />
              Intelligence
            </TabsTrigger>
            <TabsTrigger 
              value="strength"
              className="data-[state=active]:bg-strength/20 data-[state=active]:text-strength"
            >
              <Dumbbell className="h-5 w-5 mr-2" />
              Strength
            </TabsTrigger>
            <TabsTrigger 
              value="health"
              className="data-[state=active]:bg-health/20 data-[state=active]:text-health"
            >
              <Heart className="h-5 w-5 mr-2" />
              Health
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="knowledge" className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <StudyTimer />
              
              <Card className="glass shadow-lg">
                <CardHeader>
                  <CardTitle className="text-knowledge text-xl">Knowledge Activities</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="mb-6 text-muted-foreground">
                    Track your learning activities to gain Knowledge XP:
                  </p>
                  <ActivityLogger attributeType="knowledge" />
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="intelligence" className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card className="glass shadow-lg">
                <CardHeader>
                  <CardTitle className="text-intelligence text-xl">Intelligence Builder</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="mb-4 text-muted-foreground">
                    Intelligence is built through mental challenges, problem solving,
                    social interactions, and creative pursuits.
                  </p>
                  <ActivityLogger attributeType="intelligence" />
                </CardContent>
              </Card>
              
              <Card className="glass shadow-lg">
                <CardHeader>
                  <CardTitle className="text-intelligence text-xl">Intelligence Activities</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="mb-4 text-muted-foreground">
                    Track your mental activities to gain Intelligence XP:
                  </p>
                  <ul className="space-y-2 mb-6 text-sm">
                    <li className="flex items-center">
                      <div className="w-2 h-2 rounded-full bg-intelligence mr-2"></div>
                      Problem-solving exercises and puzzles
                    </li>
                    <li className="flex items-center">
                      <div className="w-2 h-2 rounded-full bg-intelligence mr-2"></div>
                      Social interactions and networking
                    </li>
                    <li className="flex items-center">
                      <div className="w-2 h-2 rounded-full bg-intelligence mr-2"></div>
                      Creative projects and artistic pursuits
                    </li>
                    <li className="flex items-center">
                      <div className="w-2 h-2 rounded-full bg-intelligence mr-2"></div>
                      Strategic thinking and planning
                    </li>
                    <li className="flex items-center">
                      <div className="w-2 h-2 rounded-full bg-intelligence mr-2"></div>
                      Leadership and influence activities
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="strength" className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card className="glass shadow-lg">
                <CardHeader>
                  <CardTitle className="text-strength text-xl">Strength Builder</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="mb-4 text-muted-foreground">
                    Track your physical training and exercise activities to build Strength XP.
                  </p>
                  <ActivityLogger attributeType="strength" />
                </CardContent>
              </Card>
              
              <Card className="glass shadow-lg">
                <CardHeader>
                  <CardTitle className="text-strength text-xl">Strength Activities</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="mb-4 text-muted-foreground">
                    Track your physical activities to gain Strength XP:
                  </p>
                  <ul className="space-y-2 mb-6 text-sm">
                    <li className="flex items-center">
                      <div className="w-2 h-2 rounded-full bg-strength mr-2"></div>
                      Weight training and resistance exercises
                    </li>
                    <li className="flex items-center">
                      <div className="w-2 h-2 rounded-full bg-strength mr-2"></div>
                      Cardio activities (running, swimming, cycling)
                    </li>
                    <li className="flex items-center">
                      <div className="w-2 h-2 rounded-full bg-strength mr-2"></div>
                      Sports and athletic competitions
                    </li>
                    <li className="flex items-center">
                      <div className="w-2 h-2 rounded-full bg-strength mr-2"></div>
                      Flexibility and mobility training
                    </li>
                    <li className="flex items-center">
                      <div className="w-2 h-2 rounded-full bg-strength mr-2"></div>
                      Physical challenges and endurance activities
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="health" className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card className="glass shadow-lg">
                <CardHeader>
                  <CardTitle className="text-health text-xl">Health Builder</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="mb-4 text-muted-foreground">
                    Track your health, wellness, and self-care activities to build Health XP.
                  </p>
                  <ActivityLogger attributeType="health" />
                </CardContent>
              </Card>
              
              <Card className="glass shadow-lg">
                <CardHeader>
                  <CardTitle className="text-health text-xl">Health Activities</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="mb-4 text-muted-foreground">
                    Track your wellness activities to gain Health XP:
                  </p>
                  <ul className="space-y-2 mb-6 text-sm">
                    <li className="flex items-center">
                      <div className="w-2 h-2 rounded-full bg-health mr-2"></div>
                      Preparing healthy meals and nutrition tracking
                    </li>
                    <li className="flex items-center">
                      <div className="w-2 h-2 rounded-full bg-health mr-2"></div>
                      Meditation and mindfulness practices
                    </li>
                    <li className="flex items-center">
                      <div className="w-2 h-2 rounded-full bg-health mr-2"></div>
                      Quality sleep and rest periods
                    </li>
                    <li className="flex items-center">
                      <div className="w-2 h-2 rounded-full bg-health mr-2"></div>
                      Stress management and relaxation techniques
                    </li>
                    <li className="flex items-center">
                      <div className="w-2 h-2 rounded-full bg-health mr-2"></div>
                      Work-life balance activities
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default LevelUp;
