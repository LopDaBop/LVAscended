
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import { useAuthStore } from "../store/authStore";
import { AttributeType } from "../types";

interface ActivityLoggerProps {
  attributeType: AttributeType;
}

const ActivityLogger = ({ attributeType }: ActivityLoggerProps) => {
  const { user, addXp } = useAuthStore();
  const [activity, setActivity] = useState("");
  const [description, setDescription] = useState("");
  const [effort, setEffort] = useState(5);
  const [subAttributeName, setSubAttributeName] = useState<string>("");
  
  // Get the attribute and its sub-attributes
  const attribute = user?.attributes.find((attr) => attr.type === attributeType);
  const subAttributes = attribute?.subAttributes || [];
  
  // Get color based on attribute type
  const getAttributeColor = () => {
    switch (attributeType) {
      case "knowledge": return "text-knowledge";
      case "intelligence": return "text-intelligence";
      case "strength": return "text-strength";
      case "health": return "text-health";
      default: return "text-primary";
    }
  };
  
  // Get attribute display name
  const getAttributeName = () => {
    return attribute?.name || attributeType.charAt(0).toUpperCase() + attributeType.slice(1);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!activity.trim()) {
      toast({
        title: "Error",
        description: "Please enter an activity name",
        variant: "destructive",
      });
      return;
    }
    
    if (!subAttributeName) {
      toast({
        title: "Error",
        description: "Please select a sub-attribute",
        variant: "destructive",
      });
      return;
    }
    
    // Calculate XP based on effort level (1-10 scale)
    const xpGained = effort * 10;
    
    // Add XP to the selected attribute and sub-attribute
    addXp(attributeType, subAttributeName, xpGained);
    
    // Show success toast
    toast({
      title: "Activity Logged!",
      description: `You gained ${xpGained} XP in ${subAttributeName} ${attributeType}`,
    });
    
    // Reset form
    setActivity("");
    setDescription("");
    setEffort(5);
  };

  return (
    <div className="bg-card glass rounded-xl p-6 shadow-lg">
      <h3 className={`text-xl font-bold ${getAttributeColor()} mb-4`}>
        Log {getAttributeName()} Activity
      </h3>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="activity">Activity Name</Label>
          <Input
            id="activity"
            value={activity}
            onChange={(e) => setActivity(e.target.value)}
            placeholder={`What ${attributeType} activity did you do?`}
            className="mt-1"
          />
        </div>
        
        <div>
          <Label htmlFor="subAttribute">Category</Label>
          <Select
            value={subAttributeName}
            onValueChange={setSubAttributeName}
          >
            <SelectTrigger className="mt-1">
              <SelectValue placeholder={`Select ${attributeType} type`} />
            </SelectTrigger>
            <SelectContent>
              {subAttributes.map((subAttr) => (
                <SelectItem key={subAttr.name} value={subAttr.name}>
                  {subAttr.name.charAt(0).toUpperCase() + subAttr.name.slice(1)} - {subAttr.description}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Label htmlFor="description">Description (Optional)</Label>
          <Textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe your activity"
            className="mt-1"
            rows={3}
          />
        </div>
        
        <div>
          <div className="flex justify-between mb-2">
            <Label htmlFor="effort">Effort/Intensity Level</Label>
            <span className="text-md font-semibold">{effort}/10</span>
          </div>
          <Slider
            id="effort"
            min={1}
            max={10}
            step={1}
            value={[effort]}
            onValueChange={(val) => setEffort(val[0])}
            className="my-4"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Easy</span>
            <span>Moderate</span>
            <span>Challenging</span>
          </div>
        </div>
        
        <div className="text-center text-sm text-muted-foreground mb-4">
          <p>This activity will award you {effort * 10} XP</p>
        </div>
        
        <Button type="submit" className="w-full">Log Activity</Button>
      </form>
    </div>
  );
};

export default ActivityLogger;
