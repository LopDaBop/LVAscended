
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "@/components/ui/use-toast";
import { Award } from "lucide-react";

const Auth = () => {
  const navigate = useNavigate();
  const { login, register, isLoggedIn, hasCompletedAssessment } = useAuthStore();
  
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (isLoginMode) {
        // Handle login
        const success = await login(email, password);
        if (success) {
          toast({
            title: "Welcome back!",
            description: "You've successfully logged in.",
          });
          navigate(hasCompletedAssessment ? "/dashboard" : "/assessment");
        } else {
          toast({
            title: "Login failed",
            description: "Invalid email or password.",
            variant: "destructive",
          });
        }
      } else {
        // Handle registration
        // Validate passwords match
        if (password !== confirmPassword) {
          toast({
            title: "Registration failed",
            description: "Passwords do not match.",
            variant: "destructive",
          });
          return;
        }
        
        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
          toast({
            title: "Registration failed",
            description: "Please enter a valid email address.",
            variant: "destructive",
          });
          return;
        }
        
        // Validate username and password length
        if (username.length < 3) {
          toast({
            title: "Registration failed",
            description: "Username must be at least 3 characters.",
            variant: "destructive",
          });
          return;
        }
        
        if (password.length < 6) {
          toast({
            title: "Registration failed",
            description: "Password must be at least 6 characters.",
            variant: "destructive",
          });
          return;
        }
        
        const success = await register(username, email, password);
        if (success) {
          toast({
            title: "Welcome to LevelAtop!",
            description: "Your account has been created successfully.",
          });
          navigate("/assessment");
        } else {
          toast({
            title: "Registration failed",
            description: "Username or email already exists.",
            variant: "destructive",
          });
        }
      }
    } catch (error) {
      toast({
        title: "An error occurred",
        description: "Please try again later.",
        variant: "destructive",
      });
    }
  };
  
  // If already logged in, redirect to dashboard or assessment
  if (isLoggedIn) {
    navigate(hasCompletedAssessment ? "/dashboard" : "/assessment");
    return null;
  }

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-primary/20 p-4 rounded-full">
              <Award className="h-12 w-12 text-primary" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gradient">LevelAtop</h1>
          <p className="mt-2 text-muted-foreground">
            Transform your real life experiences into growth
          </p>
        </div>
        
        <Card className="glass shadow-xl">
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="text-center mb-6">
                <h2 className="text-xl font-bold">
                  {isLoginMode ? "Sign In" : "Create Account"}
                </h2>
              </div>
              
              {!isLoginMode && (
                <div>
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    placeholder="Username"
                    className="mt-1"
                  />
                </div>
              )}
              
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="your@email.com"
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="********"
                  className="mt-1"
                />
              </div>
              
              {!isLoginMode && (
                <div>
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    placeholder="********"
                    className="mt-1"
                  />
                </div>
              )}
              
              <Button type="submit" className="w-full">
                {isLoginMode ? "Sign In" : "Create Account"}
              </Button>
              
              <div className="text-center">
                <button
                  type="button"
                  onClick={() => setIsLoginMode(!isLoginMode)}
                  className="text-primary hover:underline text-sm"
                >
                  {isLoginMode
                    ? "Don't have an account? Sign Up"
                    : "Already have an account? Sign In"}
                </button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Auth;
