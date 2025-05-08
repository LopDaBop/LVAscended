
import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Award, BookOpen, Brain, Dumbbell, Heart, ChevronRight, Users, BarChart, Trophy } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();
  const { isLoggedIn, hasCompletedAssessment } = useAuthStore();

  // If already logged in, redirect to dashboard or assessment
  useEffect(() => {
    if (isLoggedIn) {
      navigate(hasCompletedAssessment ? "/dashboard" : "/assessment");
    }
  }, [isLoggedIn, hasCompletedAssessment, navigate]);

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-radial from-primary/20 via-background to-background"></div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 relative z-10">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="bg-primary/20 p-4 rounded-full animate-pulse-glow">
                <Award className="h-16 w-16 text-primary" />
              </div>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-gradient mb-6">
              LevelAtop
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto">
              Transform your real-life experiences into growth. Track, visualize, and level up your knowledge, intelligence, strength, and health.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild>
                <Link to="/auth">
                  Get Started
                  <ChevronRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <a href="#features">
                  Learn More
                </a>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div id="features" className="py-20 bg-secondary/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Core Features</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              LevelAtop helps you track your personal growth across four key attributes, visualize your progress, and connect with like-minded individuals.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="glass shadow-lg transition-all hover:shadow-xl hover:-translate-y-1">
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center">
                  <div className="h-12 w-12 rounded-full bg-knowledge/20 flex items-center justify-center mb-4">
                    <BookOpen className="h-6 w-6 text-knowledge" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Knowledge</h3>
                  <p className="text-muted-foreground">
                    Track your learning journey through academic knowledge, practical skills, and worldly understanding.
                  </p>
                </div>
              </CardContent>
            </Card>
            
            <Card className="glass shadow-lg transition-all hover:shadow-xl hover:-translate-y-1">
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center">
                  <div className="h-12 w-12 rounded-full bg-intelligence/20 flex items-center justify-center mb-4">
                    <Brain className="h-6 w-6 text-intelligence" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Intelligence</h3>
                  <p className="text-muted-foreground">
                    Develop your creative thinking, social intelligence, analytical skills, foresight, and influence.
                  </p>
                </div>
              </CardContent>
            </Card>
            
            <Card className="glass shadow-lg transition-all hover:shadow-xl hover:-translate-y-1">
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center">
                  <div className="h-12 w-12 rounded-full bg-strength/20 flex items-center justify-center mb-4">
                    <Dumbbell className="h-6 w-6 text-strength" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Strength</h3>
                  <p className="text-muted-foreground">
                    Build physical power, endurance, agility, and durability through consistent training and exercise.
                  </p>
                </div>
              </CardContent>
            </Card>
            
            <Card className="glass shadow-lg transition-all hover:shadow-xl hover:-translate-y-1">
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center">
                  <div className="h-12 w-12 rounded-full bg-health/20 flex items-center justify-center mb-4">
                    <Heart className="h-6 w-6 text-health" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Health</h3>
                  <p className="text-muted-foreground">
                    Maintain your physical and mental wellbeing through balanced nutrition, sleep, and stress management.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      
      {/* More Features */}
      <div className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="flex flex-col items-center text-center">
              <div className="h-14 w-14 rounded-full bg-primary/20 flex items-center justify-center mb-4">
                <BarChart className="h-7 w-7 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">Detailed Stats</h3>
              <p className="text-muted-foreground">
                Visualize your progress with comprehensive statistics, charts and graphs that show your growth over time.
              </p>
            </div>
            
            <div className="flex flex-col items-center text-center">
              <div className="h-14 w-14 rounded-full bg-primary/20 flex items-center justify-center mb-4">
                <Users className="h-7 w-7 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">Social Connection</h3>
              <p className="text-muted-foreground">
                Connect with other users, make friends, and view leaderboards to stay motivated and inspired.
              </p>
            </div>
            
            <div className="flex flex-col items-center text-center">
              <div className="h-14 w-14 rounded-full bg-primary/20 flex items-center justify-center mb-4">
                <Trophy className="h-7 w-7 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">Level Up System</h3>
              <p className="text-muted-foreground">
                Gain experience points for real-life activities and watch your attributes and overall level grow.
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* CTA Section */}
      <div className="py-20 bg-primary/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Level Up Your Life?</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
              Join LevelAtop today and start transforming your daily activities into measurable growth. Take the first step toward becoming your best self.
            </p>
            <Button size="lg" asChild>
              <Link to="/auth">
                Create Your Account
                <ChevronRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <footer className="py-12 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center">
              <Award className="h-6 w-6 text-primary mr-2" />
              <span className="text-lg font-bold">LevelAtop</span>
            </div>
            <div className="mt-4 md:mt-0">
              <p className="text-sm text-muted-foreground">
                © {new Date().getFullYear()} LevelAtop. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
