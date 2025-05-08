
import { Attribute, SubAttribute } from "../types";

// Calculate XP required for next level
export const calculateXpRequired = (currentLevel: number): number => {
  // Base XP required for level 1 is 100
  const baseXp = 100;
  // Each level increases by 50% from the previous level
  return Math.floor(baseXp * Math.pow(1.5, currentLevel - 1));
};

// Calculate overall level based on attribute levels
export const calculateOverallLevel = (attributes: Attribute[]): number => {
  if (!attributes.length) return 1;
  
  // Calculate the total of all attribute levels
  const totalLevel = attributes.reduce((sum, attr) => sum + attr.level, 0);
  
  // The overall level is the average of all attribute levels, rounded down
  return Math.floor(totalLevel / attributes.length);
};

// Calculate attribute level based on sub-attribute levels
export const calculateAttributeLevel = (subAttributes: SubAttribute[]): number => {
  if (!subAttributes.length) return 1;
  
  // Calculate the total of all sub-attribute levels
  const totalLevel = subAttributes.reduce((sum, subAttr) => sum + subAttr.level, 0);
  
  // The attribute level is the average of all sub-attribute levels, rounded down
  return Math.floor(totalLevel / subAttributes.length);
};

// Calculate percentage progress to next level
export const calculateLevelProgress = (xpCurrent: number, xpRequired: number): number => {
  return Math.min(100, Math.floor((xpCurrent / xpRequired) * 100));
};

// Calculate level from assessment score
export const calculateInitialLevel = (score: number): number => {
  // score will be between 1-5
  // We want to map this to levels 1-3
  return Math.max(1, Math.min(3, Math.ceil(score / 2)));
};
