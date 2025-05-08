
import { useState, useEffect } from "react";
import { User, AttributeType } from "../types";

interface LevelDisplayProps {
  user: User;
  size?: "sm" | "md" | "lg";
  showAttributes?: boolean;
  recentlyGainedXp?: {
    attributeType: AttributeType;
    amount: number;
    timestamp: Date;
  };
}

const LevelDisplay = ({ 
  user, 
  size = "md", 
  showAttributes = true,
  recentlyGainedXp
}: LevelDisplayProps) => {
  const [showLevelUp, setShowLevelUp] = useState(false);
  
  // Check for level up animation
  useEffect(() => {
    if (recentlyGainedXp) {
      setShowLevelUp(true);
      const timer = setTimeout(() => {
        setShowLevelUp(false);
      }, 2000);
      
      return () => clearTimeout(timer);
    }
  }, [recentlyGainedXp]);
  
  // Get level circle size based on size prop
  const getLevelSize = () => {
    switch (size) {
      case "sm": return "w-12 h-12 text-sm";
      case "lg": return "w-36 h-36 text-4xl";
      case "md":
      default: return "w-24 h-24 text-xl";
    }
  };
  
  // Get attribute pill size based on size prop
  const getAttributeSize = () => {
    switch (size) {
      case "sm": return "h-4 text-[10px]";
      case "lg": return "h-8 text-base";
      case "md":
      default: return "h-6 text-xs";
    }
  };

  return (
    <div className="flex flex-col items-center">
      {/* Level Circle */}
      <div className={`relative ${getLevelSize()} rounded-full bg-secondary flex items-center justify-center border-2 border-white/30 ${showLevelUp ? 'animate-level-up' : 'animate-pulse-glow'}`}>
        <span className="font-bold">LVL {user.level}</span>
        
        {/* Level up indicator */}
        {showLevelUp && (
          <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-primary text-white px-2 py-1 rounded text-sm font-bold whitespace-nowrap animate-fade-in">
            Level up!
          </div>
        )}
      </div>
      
      {/* Attributes Pills (only if showAttributes is true) */}
      {showAttributes && (
        <div className="mt-3 flex flex-wrap justify-center gap-2">
          {user.attributes.map((attr) => (
            <div 
              key={attr.type}
              className={`${getAttributeSize()} px-2 rounded-full flex items-center justify-center`}
              style={{ backgroundColor: attr.color + "40", color: attr.color }}
            >
              <span className="font-medium">{attr.name} {attr.level}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default LevelDisplay;
