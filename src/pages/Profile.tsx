
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/components/ui/use-toast";
import Navbar from "../components/Navbar";
import LevelDisplay from "../components/LevelDisplay";
import RadarChart from "../components/RadarChart";
import { User, UserCircle, Calendar, Mail, Pencil } from "lucide-react";

const Profile = () => {
  const navigate = useNavigate();
  const { user, isLoggedIn, updateUser } = useAuthStore();
  
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    displayName: "",
    bio: "",
    profileImage: "",
  });
  
  // Redirect if not logged in
  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/auth");
    }
  }, [isLoggedIn, navigate]);
  
  // Initialize form data with user data
  useEffect(() => {
    if (user) {
      setFormData({
        displayName: user.displayName || "",
        bio: user.bio || "",
        profileImage: user.profileImage || "",
      });
    }
  }, [user]);
  
  if (!user) return null;
  
  // Format date
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Handle form input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateUser(formData);
    setIsEditing(false);
    toast({
      title: "Profile Updated",
      description: "Your profile has been updated successfully.",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Your Profile</h1>
          <p className="text-muted-foreground mt-2">View and edit your profile information.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Left Column - Profile Info */}
          <div className="md:col-span-1 space-y-6">
            <Card className="glass shadow-lg">
              <CardContent className="pt-6 flex flex-col items-center">
                <div className="relative">
                  <div className="h-32 w-32 rounded-full bg-secondary flex items-center justify-center overflow-hidden">
                    {user.profileImage ? (
                      <img 
                        src={user.profileImage}
                        alt={user.displayName}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <UserCircle className="h-20 w-20 text-muted-foreground" />
                    )}
                  </div>
                </div>
                
                <div className="mt-4 text-center">
                  <h2 className="text-xl font-bold">{user.displayName || user.username}</h2>
                  <p className="text-muted-foreground">{user.username}</p>
                </div>
                
                <LevelDisplay user={user} size="md" showAttributes={false} />
                
                <div className="mt-6 w-full space-y-4">
                  <div className="flex items-center">
                    <Mail className="h-4 w-4 text-muted-foreground mr-2" />
                    <span className="text-sm">{user.email}</span>
                  </div>
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 text-muted-foreground mr-2" />
                    <span className="text-sm">Joined {formatDate(user.joinDate)}</span>
                  </div>
                </div>
                
                <Button 
                  variant="outline" 
                  className="mt-6 w-full"
                  onClick={() => setIsEditing(true)}
                >
                  <Pencil className="h-4 w-4 mr-2" />
                  Edit Profile
                </Button>
              </CardContent>
            </Card>
            
            <Card className="glass shadow-lg">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Bio</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm">
                  {user.bio || "No bio yet. Click 'Edit Profile' to add one."}
                </p>
              </CardContent>
            </Card>
          </div>
          
          {/* Middle Column - Attributes Chart */}
          <div className="md:col-span-1">
            <Card className="glass shadow-lg h-full">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Your Attributes</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col items-center">
                <div className="h-64 w-full">
                  <RadarChart attributes={user.attributes} />
                </div>
                <Separator className="my-6" />
                <div className="grid grid-cols-2 gap-4 w-full">
                  {user.attributes.map((attr) => (
                    <div
                      key={attr.type}
                      className="text-center p-3 rounded-lg"
                      style={{ backgroundColor: attr.color + "20" }}
                    >
                      <div className="text-xl font-bold" style={{ color: attr.color }}>
                        {attr.level}
                      </div>
                      <div className="text-xs">{attr.name}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Right Column - Edit Form or Stats */}
          <div className="md:col-span-1">
            {isEditing ? (
              <Card className="glass shadow-lg">
                <CardHeader>
                  <CardTitle>Edit Profile</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <Label htmlFor="displayName">Display Name</Label>
                      <Input
                        id="displayName"
                        name="displayName"
                        value={formData.displayName}
                        onChange={handleInputChange}
                        placeholder="Your display name"
                        className="mt-1"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="profileImage">Profile Image URL</Label>
                      <Input
                        id="profileImage"
                        name="profileImage"
                        value={formData.profileImage || ""}
                        onChange={handleInputChange}
                        placeholder="https://example.com/your-image.jpg"
                        className="mt-1"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="bio">Bio</Label>
                      <Textarea
                        id="bio"
                        name="bio"
                        value={formData.bio}
                        onChange={handleInputChange}
                        placeholder="Tell us about yourself"
                        className="mt-1"
                        rows={5}
                      />
                    </div>
                    
                    <div className="flex gap-4">
                      <Button type="submit" className="flex-1">Save Changes</Button>
                      <Button 
                        type="button" 
                        variant="outline" 
                        className="flex-1"
                        onClick={() => setIsEditing(false)}
                      >
                        Cancel
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            ) : (
              <Card className="glass shadow-lg">
                <CardHeader>
                  <CardTitle>Account Stats</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-sm font-medium mb-2">Current Streak</h3>
                      <div className="flex items-center">
                        <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center mr-3">
                          <span className="font-bold text-xl">{user.streakDays}</span>
                        </div>
                        <div>
                          <p className="text-sm">days in a row</p>
                          <p className="text-xs text-muted-foreground">Keep it up!</p>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-medium mb-2">Last Active</h3>
                      <p>{formatDate(user.lastActive)}</p>
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-medium mb-2">Friends</h3>
                      <p>{user.friends.length} friends</p>
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-medium mb-2">Account Status</h3>
                      <div className="flex items-center">
                        <div className={`h-2 w-2 rounded-full ${user.isOnline ? 'bg-green-500' : 'bg-gray-500'} mr-2`}></div>
                        <span>{user.isOnline ? 'Online' : 'Offline'}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
