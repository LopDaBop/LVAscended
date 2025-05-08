
import { useAuthStore } from "../store/authStore";
import { User } from "../types";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { UserPlus, UserMinus, UserCheck, Award, User as UserIcon } from "lucide-react";

interface LeaderboardCardProps {
  users: User[];
  title: string;
  maxUsers?: number;
  showAddFriend?: boolean;
}

const LeaderboardCard = ({ 
  users, 
  title, 
  maxUsers = 10,
  showAddFriend = true 
}: LeaderboardCardProps) => {
  const { user, addFriend, removeFriend } = useAuthStore();
  
  // Sort users by level (highest first)
  const sortedUsers = [...users]
    .sort((a, b) => b.level - a.level)
    .slice(0, maxUsers);

  const isCurrentUser = (id: string) => user?.id === id;
  const isFriend = (id: string) => user?.friends.includes(id) || false;

  const handleFriendAction = (userId: string) => {
    if (isFriend(userId)) {
      removeFriend(userId);
    } else {
      addFriend(userId);
    }
  };

  return (
    <div className="bg-card glass rounded-xl p-6 shadow-lg">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold flex items-center">
          <Award className="mr-2 text-primary" />
          {title}
        </h3>
      </div>
      
      <div className="space-y-4">
        {sortedUsers.length > 0 ? (
          sortedUsers.map((leaderboardUser, index) => (
            <div 
              key={leaderboardUser.id}
              className={`flex items-center p-3 rounded-lg ${
                isCurrentUser(leaderboardUser.id) 
                  ? "bg-primary/20 border border-primary/30" 
                  : "hover:bg-white/5"
              }`}
            >
              <div className="flex-shrink-0 w-8 text-center font-bold text-lg text-muted-foreground">
                {index + 1}
              </div>
              
              <div className="flex-shrink-0 h-10 w-10 rounded-full bg-secondary flex items-center justify-center overflow-hidden">
                {leaderboardUser.profileImage ? (
                  <img 
                    src={leaderboardUser.profileImage} 
                    alt={leaderboardUser.username} 
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <UserIcon className="h-6 w-6 text-muted-foreground" />
                )}
              </div>
              
              <div className="ml-3 flex-grow">
                <Link to={`/profile/${leaderboardUser.id}`} className="font-medium hover:underline">
                  {leaderboardUser.displayName || leaderboardUser.username}
                </Link>
                <p className="text-xs text-muted-foreground">
                  Level {leaderboardUser.level}
                </p>
              </div>
              
              {showAddFriend && !isCurrentUser(leaderboardUser.id) && (
                <Button
                  onClick={() => handleFriendAction(leaderboardUser.id)}
                  variant="ghost"
                  size="sm"
                  className="ml-2"
                >
                  {isFriend(leaderboardUser.id) ? (
                    <UserCheck className="h-4 w-4 text-accent" />
                  ) : (
                    <UserPlus className="h-4 w-4" />
                  )}
                </Button>
              )}
            </div>
          ))
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            <p>No users found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LeaderboardCard;
