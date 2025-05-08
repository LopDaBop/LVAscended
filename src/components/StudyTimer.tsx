
import { useState, useEffect } from "react";
import { useAuthStore } from "../store/authStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { toast } from "@/components/ui/use-toast";
import { Play, Pause, RotateCcw } from "lucide-react";

const StudyTimer = () => {
  const { user, addXp } = useAuthStore();

  // Timer states
  const [minutes, setMinutes] = useState(25);
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [subject, setSubject] = useState("");
  const [selectedSubAttribute, setSelectedSubAttribute] = useState("academic");

  // XP calculation
  const calculateXp = (mins: number) => Math.floor(mins * 2);

  // Format time for display
  const formatTime = (mins: number, secs: number) => {
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Toggle timer
  const toggleTimer = () => {
    setIsActive(!isActive);
  };

  // Reset timer
  const resetTimer = () => {
    setIsActive(false);
    setMinutes(25);
    setSeconds(0);
  };

  // Set timer duration
  const setDuration = (mins: number) => {
    if (!isActive) {
      setMinutes(mins);
      setSeconds(0);
    }
  };

  // Timer effect
  useEffect(() => {
    let interval: any = null;
    
    if (isActive) {
      interval = setInterval(() => {
        if (seconds === 0) {
          if (minutes === 0) {
            // Timer complete
            clearInterval(interval);
            setIsActive(false);
            
            // Award XP
            const xpGained = calculateXp(minutes);
            addXp("knowledge", selectedSubAttribute, xpGained);
            toast({
              title: "Study Session Complete! 🎉",
              description: `You gained ${xpGained} XP in ${selectedSubAttribute} knowledge.`,
            });
          } else {
            setMinutes(minutes - 1);
            setSeconds(59);
          }
        } else {
          setSeconds(seconds - 1);
        }
      }, 1000);
    } else {
      clearInterval(interval);
    }
    
    return () => clearInterval(interval);
  }, [isActive, minutes, seconds, addXp, selectedSubAttribute]);

  // Get knowledge sub-attributes
  const knowledgeAttribute = user?.attributes.find((attr) => attr.type === "knowledge");
  const subAttributes = knowledgeAttribute?.subAttributes || [];

  return (
    <div className="bg-card glass rounded-xl p-6 shadow-lg">
      <h3 className="text-xl font-bold text-knowledge mb-4">Study Timer</h3>
      
      <div className="flex flex-col space-y-6">
        {/* Timer Display */}
        <div className="text-5xl font-bold text-center py-4">
          {formatTime(minutes, seconds)}
        </div>
        
        {/* Controls */}
        <div className="flex justify-center space-x-4">
          <Button 
            onClick={toggleTimer} 
            className="w-24"
            variant={isActive ? "destructive" : "default"}
          >
            {isActive ? <Pause className="mr-2" /> : <Play className="mr-2" />}
            {isActive ? "Pause" : "Start"}
          </Button>
          <Button onClick={resetTimer} variant="outline">
            <RotateCcw className="mr-2" />
            Reset
          </Button>
        </div>
        
        {/* Duration Selector */}
        <div className="mt-4">
          <Label className="text-sm text-muted-foreground mb-2">Duration (minutes)</Label>
          <Slider
            defaultValue={[25]}
            min={5}
            max={60}
            step={5}
            value={[minutes]}
            onValueChange={(value) => setDuration(value[0])}
            disabled={isActive}
            className="my-4"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>5 min</span>
            <span>60 min</span>
          </div>
        </div>
        
        {/* Quick Presets */}
        <div className="flex flex-wrap gap-2 justify-center">
          {[5, 15, 25, 30, 45, 60].map((preset) => (
            <Button
              key={preset}
              variant="outline"
              size="sm"
              onClick={() => setDuration(preset)}
              disabled={isActive}
              className="w-14"
            >
              {preset}
            </Button>
          ))}
        </div>
        
        {/* Study Details */}
        {!isActive && (
          <div className="space-y-4 mt-4">
            <div>
              <Label htmlFor="subject">Study Subject</Label>
              <Input
                id="subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="What are you studying?"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="subAttribute">Knowledge Type</Label>
              <Select
                value={selectedSubAttribute}
                onValueChange={setSelectedSubAttribute}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select knowledge type" />
                </SelectTrigger>
                <SelectContent>
                  {subAttributes.map((subAttr) => (
                    <SelectItem key={subAttr.name} value={subAttr.name}>
                      {subAttr.name.charAt(0).toUpperCase() + subAttr.name.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        )}
        
        {/* XP Info */}
        <div className="text-center text-sm text-muted-foreground">
          <p>Completing this session will award you {calculateXp(minutes)} XP</p>
        </div>
      </div>
    </div>
  );
};

export default StudyTimer;
