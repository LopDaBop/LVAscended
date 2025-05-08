import { create } from "zustand";
import { persist } from "zustand/middleware";
import { User, AttributeType, Attribute, SubAttribute } from "../types";

// Mock data for initial users
const initialAttributes = (): Attribute[] => [
  {
    type: "knowledge",
    name: "Knowledge",
    level: 1,
    xpCurrent: 0,
    xpRequired: 100,
    color: "#4F86F7",
    icon: "book",
    subAttributes: [
      {
        name: "academic",
        level: 1,
        description: "Academic knowledge and formal education",
        xpCurrent: 0,
        xpRequired: 100,
      },
      {
        name: "practical",
        level: 1,
        description: "Practical skills and applied knowledge",
        xpCurrent: 0,
        xpRequired: 100,
      },
      {
        name: "world",
        level: 1,
        description: "Understanding of the world and current events",
        xpCurrent: 0,
        xpRequired: 100,
      },
    ],
  },
  {
    type: "intelligence",
    name: "Intelligence",
    level: 1,
    xpCurrent: 0,
    xpRequired: 100,
    color: "#A64AC9",
    icon: "brain",
    subAttributes: [
      {
        name: "creativity",
        level: 1,
        description: "Creative thinking and problem solving",
        xpCurrent: 0,
        xpRequired: 100,
      },
      {
        name: "social",
        level: 1,
        description: "Social intelligence and emotional understanding",
        xpCurrent: 0,
        xpRequired: 100,
      },
      {
        name: "analytical",
        level: 1,
        description: "Analytical thinking and logical reasoning",
        xpCurrent: 0,
        xpRequired: 100,
      },
      {
        name: "foresight",
        level: 1,
        description: "Anticipation and strategic planning",
        xpCurrent: 0,
        xpRequired: 100,
      },
      {
        name: "influence",
        level: 1,
        description: "Ability to influence and persuade others",
        xpCurrent: 0,
        xpRequired: 100,
      },
    ],
  },
  {
    type: "strength",
    name: "Strength",
    level: 1,
    xpCurrent: 0,
    xpRequired: 100,
    color: "#F45B69",
    icon: "dumbbell",
    subAttributes: [
      {
        name: "power",
        level: 1,
        description: "Raw physical strength",
        xpCurrent: 0,
        xpRequired: 100,
      },
      {
        name: "endurance",
        level: 1,
        description: "Physical stamina and endurance",
        xpCurrent: 0,
        xpRequired: 100,
      },
      {
        name: "agility",
        level: 1,
        description: "Speed, flexibility and coordination",
        xpCurrent: 0,
        xpRequired: 100,
      },
      {
        name: "durability",
        level: 1,
        description: "Resistance to injury and quick recovery",
        xpCurrent: 0,
        xpRequired: 100,
      },
    ],
  },
  {
    type: "health",
    name: "Health",
    level: 1,
    xpCurrent: 0,
    xpRequired: 100,
    color: "#17B978",
    icon: "heart",
    subAttributes: [
      {
        name: "physical",
        level: 1,
        description: "Physical health and wellbeing",
        xpCurrent: 0,
        xpRequired: 100,
      },
      {
        name: "mental",
        level: 1,
        description: "Mental health and emotional stability",
        xpCurrent: 0,
        xpRequired: 100,
      },
      {
        name: "nutrition",
        level: 1,
        description: "Diet and nutritional habits",
        xpCurrent: 0,
        xpRequired: 100,
      },
      {
        name: "sleep",
        level: 1,
        description: "Quality and quantity of sleep",
        xpCurrent: 0,
        xpRequired: 100,
      },
      {
        name: "balance",
        level: 1,
        description: "Work-life balance and stress management",
        xpCurrent: 0,
        xpRequired: 100,
      },
    ],
  },
];

interface AuthState {
  user: User | null;
  users: User[];
  isLoggedIn: boolean;
  hasCompletedAssessment: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (username: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  updateUserAttributes: (attributes: Attribute[]) => void;
  addXp: (attributeType: AttributeType, subAttributeName: string | null, amount: number) => void;
  setHasCompletedAssessment: (value: boolean) => void;
  updateUser: (userData: Partial<User>) => void;
  getUsers: () => User[];
  addFriend: (userId: string) => void;
  removeFriend: (userId: string) => void;
  getUserById: (userId: string) => User | undefined;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      users: [],
      isLoggedIn: false,
      hasCompletedAssessment: false,

      login: async (email, password) => {
        const { users } = get();
        const user = users.find((u) => u.email === email);

        if (user) {
          set({ user, isLoggedIn: true });
          return true;
        }
        return false;
      },

      register: async (username, email, password) => {
        const { users } = get();
        
        // Check if user already exists
        if (users.some((u) => u.email === email || u.username === username)) {
          return false;
        }

        const newUser: User = {
          id: Date.now().toString(),
          username,
          email,
          displayName: username,
          profileImage: null,
          bio: "",
          level: 1,
          joinDate: new Date(),
          lastActive: new Date(),
          streakDays: 1,
          attributes: initialAttributes(),
          friends: [],
          isOnline: true,
        };

        set((state) => ({ 
          users: [...state.users, newUser],
          user: newUser,
          isLoggedIn: true,
          hasCompletedAssessment: false
        }));
        
        return true;
      },

      logout: () => {
        set({ user: null, isLoggedIn: false });
      },

      updateUserAttributes: (attributes) => {
        set((state) => {
          if (!state.user) return state;

          const updatedUser = {
            ...state.user,
            attributes,
          };

          // Calculate new total level
          const totalLevel = Math.floor(
            attributes.reduce((sum, attr) => sum + attr.level, 0) / attributes.length
          );

          updatedUser.level = totalLevel > 0 ? totalLevel : 1;

          // Update user in the users array
          const updatedUsers = state.users.map((u) =>
            u.id === updatedUser.id ? updatedUser : u
          );

          return {
            user: updatedUser,
            users: updatedUsers,
          };
        });
      },

      addXp: (attributeType, subAttributeName, amount) => {
        set((state) => {
          if (!state.user) return state;

          const updatedAttributes = [...state.user.attributes];
          const attrIndex = updatedAttributes.findIndex((a) => a.type === attributeType);

          if (attrIndex === -1) return state;

          const attribute = { ...updatedAttributes[attrIndex] };
          
          // If subAttributeName is provided, update the specific sub-attribute
          if (subAttributeName) {
            const subAttrIndex = attribute.subAttributes.findIndex(
              (sa) => sa.name === subAttributeName
            );
            
            if (subAttrIndex === -1) return state;
            
            const subAttribute = { ...attribute.subAttributes[subAttrIndex] };
            subAttribute.xpCurrent += amount;
            
            // Check for level up
            if (subAttribute.xpCurrent >= subAttribute.xpRequired) {
              subAttribute.level += 1;
              subAttribute.xpCurrent -= subAttribute.xpRequired;
              subAttribute.xpRequired = Math.floor(subAttribute.xpRequired * 1.5);
            }
            
            const updatedSubAttributes = [...attribute.subAttributes];
            updatedSubAttributes[subAttrIndex] = subAttribute;
            attribute.subAttributes = updatedSubAttributes;
            
            // Calculate attribute level as average of sub-attributes
            attribute.level = Math.floor(
              attribute.subAttributes.reduce((sum, sa) => sum + sa.level, 0) / 
              attribute.subAttributes.length
            );
          } 
          // Otherwise, update the main attribute directly
          else {
            attribute.xpCurrent += amount;
            
            // Check for level up
            if (attribute.xpCurrent >= attribute.xpRequired) {
              attribute.level += 1;
              attribute.xpCurrent -= attribute.xpRequired;
              attribute.xpRequired = Math.floor(attribute.xpRequired * 1.5);
            }
          }
          
          updatedAttributes[attrIndex] = attribute;
          
          // Calculate new total level
          const totalLevel = Math.floor(
            updatedAttributes.reduce((sum, attr) => sum + attr.level, 0) / 
            updatedAttributes.length
          );

          const updatedUser = {
            ...state.user,
            attributes: updatedAttributes,
            level: totalLevel > 0 ? totalLevel : 1,
          };

          // Update user in the users array
          const updatedUsers = state.users.map((u) =>
            u.id === updatedUser.id ? updatedUser : u
          );

          return {
            user: updatedUser,
            users: updatedUsers,
          };
        });
      },

      setHasCompletedAssessment: (value) => {
        set({ hasCompletedAssessment: value });
      },

      updateUser: (userData) => {
        set((state) => {
          if (!state.user) return state;

          const updatedUser = {
            ...state.user,
            ...userData,
            lastActive: new Date(),
          };

          // Update user in the users array
          const updatedUsers = state.users.map((u) =>
            u.id === updatedUser.id ? updatedUser : u
          );

          return {
            user: updatedUser,
            users: updatedUsers,
          };
        });
      },

      getUsers: () => {
        return get().users;
      },

      addFriend: (userId) => {
        set((state) => {
          if (!state.user) return state;
          
          // Check if already a friend
          if (state.user.friends.includes(userId)) return state;

          const updatedUser = {
            ...state.user,
            friends: [...state.user.friends, userId],
          };

          // Update user in the users array
          const updatedUsers = state.users.map((u) =>
            u.id === updatedUser.id ? updatedUser : u
          );

          return {
            user: updatedUser,
            users: updatedUsers,
          };
        });
      },

      removeFriend: (userId) => {
        set((state) => {
          if (!state.user) return state;

          const updatedUser = {
            ...state.user,
            friends: state.user.friends.filter((id) => id !== userId),
          };

          // Update user in the users array
          const updatedUsers = state.users.map((u) =>
            u.id === updatedUser.id ? updatedUser : u
          );

          return {
            user: updatedUser,
            users: updatedUsers,
          };
        });
      },

      getUserById: (userId) => {
        return get().users.find((u) => u.id === userId);
      },
    }),
    {
      name: "level-atop-storage",
    }
  )
);
