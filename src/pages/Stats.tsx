import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import Navbar from "../components/Navbar";
import { ResponsiveBar } from "@nivo/bar";
import { ResponsiveLine } from "@nivo/line";
import RadarChart from "../components/RadarChart";
import { calculateLevelProgress } from "../utils/levelCalculator";
import { 
  BarChart3, LineChart, Activity, Calendar, Award, Target,
  BookOpen, Brain, Dumbbell, Heart, TrendingUp
} from "lucide-react";

const Stats = () => {
  const navigate = useNavigate();
  const { user, isLoggedIn } = useAuthStore();
  
  // Redirect if not logged in
  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/auth");
    }
  }, [isLoggedIn, navigate]);

  if (!user) return null;
  
  // Calculate the dominant attribute (highest level)
  const dominantAttribute = [...user.attributes].sort((a, b) => b.level - a.level)[0];

  // Generate mock data for charts
  const generateMockActivityData = () => {
    const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    return days.map(day => {
      return {
        day,
        knowledge: Math.floor(Math.random() * 100),
        knowledgeColor: "#4F86F7",
        intelligence: Math.floor(Math.random() * 100),
        intelligenceColor: "#A64AC9",
        strength: Math.floor(Math.random() * 100),
        strengthColor: "#F45B69",
        health: Math.floor(Math.random() * 100),
        healthColor: "#17B978",
      };
    });
  };

  const generateMockLevelProgressData = () => {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
    
    return [
      {
        id: "level",
        color: "#ffffff",
        data: months.map((month, i) => ({
          x: month,
          y: user.level - Math.floor((months.length - i) / 2),
        })),
      },
    ];
  };

  // Mock data for charts
  const activityData = generateMockActivityData();
  const levelProgressData = generateMockLevelProgressData();

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Your Stats</h1>
          <p className="text-muted-foreground mt-2">Track your progress and see detailed statistics.</p>
        </div>
        
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
                <Activity className="h-4 w-4 mr-2" />
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
                {Math.floor((new Date().getTime() - new Date(user.joinDate).getTime()) / (1000 * 60 * 60 * 24))}
              </div>
              <p className="text-sm text-muted-foreground mt-2">since joining</p>
            </CardContent>
          </Card>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          <Card className="glass shadow-lg lg:col-span-2">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center">
                <BarChart3 className="h-5 w-5 mr-2" />
                Weekly Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveBar
                  data={activityData}
                  keys={["knowledge", "intelligence", "strength", "health"]}
                  indexBy="day"
                  margin={{ top: 50, right: 130, bottom: 50, left: 60 }}
                  padding={0.3}
                  valueScale={{ type: "linear" }}
                  colors={["#4F86F7", "#A64AC9", "#F45B69", "#17B978"]}
                  borderColor={{ from: "color", modifiers: [["darker", 1.6]] }}
                  axisTop={null}
                  axisRight={null}
                  axisBottom={{
                    tickSize: 5,
                    tickPadding: 5,
                    tickRotation: 0,
                    legend: "Day",
                    legendPosition: "middle",
                    legendOffset: 32,
                  }}
                  axisLeft={{
                    tickSize: 5,
                    tickPadding: 5,
                    tickRotation: 0,
                    legend: "XP Gained",
                    legendPosition: "middle",
                    legendOffset: -40,
                  }}
                  labelSkipWidth={12}
                  labelSkipHeight={12}
                  labelTextColor={{ from: "color", modifiers: [["darker", 1.6]] }}
                  legends={[
                    {
                      dataFrom: "keys",
                      anchor: "bottom-right",
                      direction: "column",
                      justify: false,
                      translateX: 120,
                      translateY: 0,
                      itemsSpacing: 2,
                      itemWidth: 100,
                      itemHeight: 20,
                      itemDirection: "left-to-right",
                      itemOpacity: 0.85,
                      symbolSize: 20,
                    },
                  ]}
                  animate={true}
                  theme={{
                    text: {
                      fill: "#FFFFFF",
                      fontSize: 11,
                    },
                    axis: {
                      domain: {
                        line: {
                          stroke: "#777777",
                          strokeWidth: 1,
                        },
                      },
                      ticks: {
                        line: {
                          stroke: "#777777",
                          strokeWidth: 1,
                        },
                        text: {
                          fill: "#FFFFFF",
                        },
                      },
                    },
                    grid: {
                      line: {
                        stroke: "#333333",
                        strokeWidth: 1,
                      },
                    },
                  }}
                />
              </div>
            </CardContent>
          </Card>
          
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
                <LineChart className="h-5 w-5 mr-2" />
                Level Progress
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-72">
                <ResponsiveLine
                  data={levelProgressData}
                  margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
                  xScale={{ type: "point" }}
                  yScale={{ type: "linear", min: "auto", max: "auto", stacked: false, reverse: false }}
                  curve="natural"
                  axisTop={null}
                  axisRight={null}
                  axisBottom={{
                    tickSize: 5,
                    tickPadding: 5,
                    tickRotation: 0,
                    legend: "Month",
                    legendOffset: 36,
                    legendPosition: "middle",
                  }}
                  axisLeft={{
                    tickSize: 5,
                    tickPadding: 5,
                    tickRotation: 0,
                    legend: "Level",
                    legendOffset: -40,
                    legendPosition: "middle",
                  }}
                  colors={{ scheme: "category10" }}
                  pointSize={10}
                  pointColor={{ theme: "background" }}
                  pointBorderWidth={2}
                  pointBorderColor={{ from: "serieColor" }}
                  pointLabelYOffset={-12}
                  useMesh={true}
                  legends={[
                    {
                      anchor: "bottom-right",
                      direction: "column",
                      justify: false,
                      translateX: 100,
                      translateY: 0,
                      itemsSpacing: 0,
                      itemDirection: "left-to-right",
                      itemWidth: 80,
                      itemHeight: 20,
                      itemOpacity: 0.75,
                      symbolSize: 12,
                      symbolShape: "circle",
                    },
                  ]}
                  theme={{
                    text: {
                      fill: "#FFFFFF",
                      fontSize: 11,
                    },
                    axis: {
                      domain: {
                        line: {
                          stroke: "#777777",
                          strokeWidth: 1,
                        },
                      },
                      ticks: {
                        line: {
                          stroke: "#777777",
                          strokeWidth: 1,
                        },
                        text: {
                          fill: "#FFFFFF",
                        },
                      },
                    },
                    grid: {
                      line: {
                        stroke: "#333333",
                        strokeWidth: 1,
                      },
                    },
                  }}
                />
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
      </div>
    </div>
  );
};

export default Stats;
