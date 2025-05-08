
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/components/ui/use-toast";
import Navbar from "../components/Navbar";
import LeaderboardCard from "../components/LeaderboardCard";
import LevelDisplay from "../components/LevelDisplay";
import { Search, UserCircle, UserPlus, UserMinus, UserCheck, MessageSquare, Users, Trophy } from "lucide-react";

const Social = () => {
  const navigate = useNavigate();
  const { user, isLoggedIn, getUsers, getUserById, addFriend, removeFriend } = useAuthStore();
  
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState("leaderboard");
  
  // Redirect if not logged in
  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/auth");
    }
  }, [isLoggedIn, navigate]);
  
  // Get all users and filter out the current user
  const allUsers = getUsers().filter((u) => u.id !== user?.id);
  
  // Get user's friends
  const friends = user ? allUsers.filter((u) => user.friends.includes(u.id)) : [];
  
  // Handle search
  const handleSearch = () => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }
    
    const query = searchQuery.toLowerCase();
    const results = allUsers.filter(
      (u) =>
        u.username.toLowerCase().includes(query) ||
        (u.displayName && u.displayName.toLowerCase().includes(query))
    );
    
    setSearchResults(results);
  };
  
  // Check if a user is a friend
  const isFriend = (userId: string) => {
    return user?.friends.includes(userId) || false;
  };
  
  // Handle friend action (add/remove)
  const handleFriendAction = (userId: string) => {
    if (isFriend(userId)) {
      removeFriend(userId);
      toast({
        title: "Friend Removed",
        description: "User has been removed from your friends.",
      });
    } else {
      addFriend(userId);
      toast({
        title: "Friend Added",
        description: "User has been added to your friends.",
      });
    }
  };
  
  // View profile
  const viewProfile = (userId: string) => {
    // In a real app, this would navigate to the user's profile page
    toast({
      title: "Profile View",
      description: "This would navigate to the user's profile in a complete app.",
    });
  };
  
  // Send message
  const sendMessage = (userId: string) => {
    // In a real app, this would open a chat with the user
    toast({
      title: "Message",
      description: "This would open a chat with the user in a complete app.",
    });
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Social</h1>
          <p className="text-muted-foreground mt-2">Connect with other users, view leaderboards, and find friends.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Left Column - Search & Friends */}
          <div className="md:col-span-1 space-y-6">
            <Card className="glass shadow-lg">
              <CardHeader>
                <CardTitle>Find Users</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex space-x-2">
                  <Input
                    placeholder="Search by username"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                  />
                  <Button onClick={handleSearch}>
                    <Search className="h-4 w-4" />
                  </Button>
                </div>
                
                <div className="mt-4 space-y-4">
                  {searchResults.length > 0 ? (
                    searchResults.map((result) => (
                      <div
                        key={result.id}
                        className="flex items-center justify-between p-3 rounded-lg hover:bg-white/5"
                      >
                        <div className="flex items-center">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={result.profileImage || ""} />
                            <AvatarFallback>
                              <UserCircle className="h-6 w-6" />
                            </AvatarFallback>
                          </Avatar>
                          <div className="ml-3">
                            <p className="font-medium">{result.displayName || result.username}</p>
                            <p className="text-xs text-muted-foreground">Level {result.level}</p>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleFriendAction(result.id)}
                          >
                            {isFriend(result.id) ? (
                              <UserCheck className="h-4 w-4" />
                            ) : (
                              <UserPlus className="h-4 w-4" />
                            )}
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => viewProfile(result.id)}
                          >
                            <UserCircle className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))
                  ) : searchQuery ? (
                    <p className="text-center py-4 text-muted-foreground">No users found</p>
                  ) : null}
                </div>
              </CardContent>
            </Card>
            
            <Card className="glass shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="h-5 w-5 mr-2" />
                  Friends ({friends.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                {friends.length > 0 ? (
                  <div className="space-y-4">
                    {friends.map((friend) => (
                      <div
                        key={friend.id}
                        className="flex items-center justify-between p-3 rounded-lg hover:bg-white/5"
                      >
                        <div className="flex items-center">
                          <div className="relative">
                            <Avatar className="h-10 w-10">
                              <AvatarImage src={friend.profileImage || ""} />
                              <AvatarFallback>
                                <UserCircle className="h-6 w-6" />
                              </AvatarFallback>
                            </Avatar>
                            {friend.isOnline && (
                              <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-green-500 ring-1 ring-white"></span>
                            )}
                          </div>
                          <div className="ml-3">
                            <p className="font-medium">{friend.displayName || friend.username}</p>
                            <p className="text-xs text-muted-foreground">Level {friend.level}</p>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => sendMessage(friend.id)}
                          >
                            <MessageSquare className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleFriendAction(friend.id)}
                          >
                            <UserMinus className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <p>You haven't added any friends yet.</p>
                    <p className="mt-2">Search for users to add them as friends.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
          
          {/* Middle & Right Column - Leaderboards */}
          <div className="md:col-span-2">
            <Card className="glass shadow-lg">
              <CardHeader className="pb-2">
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center">
                      <Trophy className="h-5 w-5 mr-2" />
                      Leaderboards
                    </CardTitle>
                    <TabsList>
                      <TabsTrigger value="leaderboard">Global</TabsTrigger>
                      <TabsTrigger value="friends">Friends</TabsTrigger>
                    </TabsList>
                  </div>
                </Tabs>
              </CardHeader>
              <CardContent>
                <TabsContent value="leaderboard" className="pt-4">
                  <LeaderboardCard
                    users={allUsers}
                    title="Global Leaderboard"
                    maxUsers={10}
                  />
                </TabsContent>
                <TabsContent value="friends" className="pt-4">
                  <LeaderboardCard
                    users={friends}
                    title="Friends Leaderboard"
                    maxUsers={10}
                    showAddFriend={false}
                  />
                </TabsContent>
              </CardContent>
            </Card>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
              <Card className="glass shadow-lg">
                <CardHeader>
                  <CardTitle>Intelligence Leaders</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {allUsers
                      .sort((a, b) => {
                        const aIntelligence = a.attributes.find((attr) => attr.type === "intelligence")?.level || 0;
                        const bIntelligence = b.attributes.find((attr) => attr.type === "intelligence")?.level || 0;
                        return bIntelligence - aIntelligence;
                      })
                      .slice(0, 5)
                      .map((u) => (
                        <div key={u.id} className="flex items-center justify-between">
                          <div className="flex items-center">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={u.profileImage || ""} />
                              <AvatarFallback>
                                <UserCircle className="h-4 w-4" />
                              </AvatarFallback>
                            </Avatar>
                            <span className="ml-2 font-medium">{u.displayName || u.username}</span>
                          </div>
                          <div className="px-2 py-1 rounded-full bg-intelligence/20 text-intelligence text-xs">
                            Level {u.attributes.find((attr) => attr.type === "intelligence")?.level || 0}
                          </div>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>
              
              <Card className="glass shadow-lg">
                <CardHeader>
                  <CardTitle>Knowledge Leaders</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {allUsers
                      .sort((a, b) => {
                        const aKnowledge = a.attributes.find((attr) => attr.type === "knowledge")?.level || 0;
                        const bKnowledge = b.attributes.find((attr) => attr.type === "knowledge")?.level || 0;
                        return bKnowledge - aKnowledge;
                      })
                      .slice(0, 5)
                      .map((u) => (
                        <div key={u.id} className="flex items-center justify-between">
                          <div className="flex items-center">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={u.profileImage || ""} />
                              <AvatarFallback>
                                <UserCircle className="h-4 w-4" />
                              </AvatarFallback>
                            </Avatar>
                            <span className="ml-2 font-medium">{u.displayName || u.username}</span>
                          </div>
                          <div className="px-2 py-1 rounded-full bg-knowledge/20 text-knowledge text-xs">
                            Level {u.attributes.find((attr) => attr.type === "knowledge")?.level || 0}
                          </div>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>
              
              <Card className="glass shadow-lg">
                <CardHeader>
                  <CardTitle>Strength Leaders</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {allUsers
                      .sort((a, b) => {
                        const aStrength = a.attributes.find((attr) => attr.type === "strength")?.level || 0;
                        const bStrength = b.attributes.find((attr) => attr.type === "strength")?.level || 0;
                        return bStrength - aStrength;
                      })
                      .slice(0, 5)
                      .map((u) => (
                        <div key={u.id} className="flex items-center justify-between">
                          <div className="flex items-center">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={u.profileImage || ""} />
                              <AvatarFallback>
                                <UserCircle className="h-4 w-4" />
                              </AvatarFallback>
                            </Avatar>
                            <span className="ml-2 font-medium">{u.displayName || u.username}</span>
                          </div>
                          <div className="px-2 py-1 rounded-full bg-strength/20 text-strength text-xs">
                            Level {u.attributes.find((attr) => attr.type === "strength")?.level || 0}
                          </div>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>
              
              <Card className="glass shadow-lg">
                <CardHeader>
                  <CardTitle>Health Leaders</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {allUsers
                      .sort((a, b) => {
                        const aHealth = a.attributes.find((attr) => attr.type === "health")?.level || 0;
                        const bHealth = b.attributes.find((attr) => attr.type === "health")?.level || 0;
                        return bHealth - aHealth;
                      })
                      .slice(0, 5)
                      .map((u) => (
                        <div key={u.id} className="flex items-center justify-between">
                          <div className="flex items-center">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={u.profileImage || ""} />
                              <AvatarFallback>
                                <UserCircle className="h-4 w-4" />
                              </AvatarFallback>
                            </Avatar>
                            <span className="ml-2 font-medium">{u.displayName || u.username}</span>
                          </div>
                          <div className="px-2 py-1 rounded-full bg-health/20 text-health text-xs">
                            Level {u.attributes.find((attr) => attr.type === "health")?.level || 0}
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
    </div>
  );
};

export default Social;
