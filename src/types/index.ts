
export type AttributeType = "knowledge" | "intelligence" | "strength" | "health";

export interface SubAttribute {
  name: string;
  level: number;
  description: string;
  xpCurrent: number;
  xpRequired: number;
}

export interface Attribute {
  type: AttributeType;
  name: string;
  level: number;
  xpCurrent: number;
  xpRequired: number;
  color: string;
  icon: string;
  subAttributes: SubAttribute[];
}

export interface User {
  id: string;
  username: string;
  email: string;
  displayName: string;
  profileImage: string | null;
  bio: string;
  level: number;
  joinDate: Date;
  lastActive: Date;
  streakDays: number;
  attributes: Attribute[];
  friends: string[];
  isOnline: boolean;
}

export interface Activity {
  id: string;
  userId: string;
  attributeType: AttributeType;
  subAttributeName?: string;
  description: string;
  xpGained: number;
  timestamp: Date;
}

export interface AssessmentQuestion {
  id: string;
  attributeType: AttributeType;
  question: string;
  options: {
    text: string;
    value: number;
  }[];
}

export interface QuestLogEntry {
  id: string;
  userId: string;
  title: string;
  description: string;
  completed: boolean;
  attributeType: AttributeType;
  xpReward: number;
  deadline?: Date;
  completedDate?: Date;
  recurring?: boolean;
  recurringPeriod?: "daily" | "weekly" | "monthly";
}

export interface StudySession {
  id: string;
  userId: string;
  duration: number; // in minutes
  subject: string;
  xpGained: number;
  timestamp: Date;
}

export interface ExerciseSession {
  id: string;
  userId: string;
  type: string;
  duration: number; // in minutes
  intensity: "light" | "moderate" | "intense";
  xpGained: number;
  timestamp: Date;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: Date;
  read: boolean;
}
