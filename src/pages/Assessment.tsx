
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { assessmentQuestions } from "../utils/mockData";
import { calculateInitialLevel } from "../utils/levelCalculator";
import { AttributeType } from "../types";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "@/components/ui/use-toast";
import { CheckCircle2, Award, ArrowRight } from "lucide-react";

const Assessment = () => {
  const navigate = useNavigate();
  const { user, isLoggedIn, setHasCompletedAssessment, updateUserAttributes } = useAuthStore();
  
  // State for current question index
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [isCompleted, setIsCompleted] = useState(false);
  
  // Group questions by attribute type
  const questionsByAttribute: Record<AttributeType, typeof assessmentQuestions> = {
    knowledge: assessmentQuestions.filter(q => q.attributeType === "knowledge"),
    intelligence: assessmentQuestions.filter(q => q.attributeType === "intelligence"),
    strength: assessmentQuestions.filter(q => q.attributeType === "strength"),
    health: assessmentQuestions.filter(q => q.attributeType === "health"),
  };
  
  // Flatten questions for display
  const flattenedQuestions = [
    ...questionsByAttribute.knowledge,
    ...questionsByAttribute.intelligence,
    ...questionsByAttribute.strength,
    ...questionsByAttribute.health,
  ];
  
  const currentQuestion = flattenedQuestions[currentQuestionIndex];
  
  // Calculate progress
  const progressPercentage = Math.round((currentQuestionIndex / flattenedQuestions.length) * 100);
  
  // Redirect if not logged in
  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/auth");
    }
  }, [isLoggedIn, navigate]);
  
  // Handle option selection
  const handleOptionSelect = (value: number) => {
    // Save answer
    setAnswers({
      ...answers,
      [currentQuestion.id]: value,
    });
    
    // Move to next question or complete assessment
    if (currentQuestionIndex < flattenedQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      completeAssessment();
    }
  };
  
  // Complete assessment and calculate initial levels
  const completeAssessment = () => {
    if (!user) return;
    
    // Calculate average score for each attribute type
    const scores: Record<AttributeType, number> = {
      knowledge: 0,
      intelligence: 0,
      strength: 0,
      health: 0,
    };
    
    // Count questions answered for each attribute
    const counts: Record<AttributeType, number> = {
      knowledge: 0,
      intelligence: 0,
      strength: 0,
      health: 0,
    };
    
    // Calculate total score for each attribute
    Object.entries(answers).forEach(([questionId, value]) => {
      const question = assessmentQuestions.find(q => q.id === questionId);
      if (question) {
        scores[question.attributeType] += value;
        counts[question.attributeType] += 1;
      }
    });
    
    // Calculate average score for each attribute (1-5 scale)
    Object.keys(scores).forEach(attr => {
      const attributeType = attr as AttributeType;
      scores[attributeType] = counts[attributeType] > 0 
        ? scores[attributeType] / counts[attributeType]
        : 1;
    });
    
    // Update user attributes based on assessment scores
    const updatedAttributes = [...user.attributes].map(attr => {
      const score = scores[attr.type];
      const initialLevel = calculateInitialLevel(score);
      
      // Update main attribute level
      const updatedAttr = {
        ...attr,
        level: initialLevel,
        xpCurrent: 0,
        xpRequired: 100 * initialLevel,
      };
      
      // Update sub-attributes with the same initial level
      updatedAttr.subAttributes = attr.subAttributes.map(subAttr => ({
        ...subAttr,
        level: initialLevel,
        xpCurrent: 0,
        xpRequired: 100 * initialLevel,
      }));
      
      return updatedAttr;
    });
    
    // Update user attributes
    updateUserAttributes(updatedAttributes);
    
    // Mark assessment as completed
    setHasCompletedAssessment(true);
    
    // Show completion state
    setIsCompleted(true);
    
    // Show success message
    toast({
      title: "Assessment Completed!",
      description: "Your initial attributes have been set based on your responses.",
    });
  };
  
  // Handle continue to dashboard
  const handleContinue = () => {
    navigate("/dashboard");
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6">
      <div className="max-w-lg w-full space-y-8">
        {!isCompleted ? (
          <>
            <div className="text-center">
              <h1 className="text-2xl font-bold text-gradient">Initial Assessment</h1>
              <p className="mt-2 text-muted-foreground">
                Answer honestly to get an accurate starting point for your attributes.
              </p>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">
                Question {currentQuestionIndex + 1} of {flattenedQuestions.length}
              </span>
              <span className="text-sm font-medium">
                {currentQuestion?.attributeType.charAt(0).toUpperCase() + currentQuestion?.attributeType.slice(1)}
              </span>
            </div>
            
            <Progress value={progressPercentage} />
            
            <Card className="glass shadow-xl">
              <CardContent className="pt-6">
                <div className="mb-6">
                  <h2 className="text-xl font-medium mb-4">{currentQuestion?.question}</h2>
                  <div className="space-y-3">
                    {currentQuestion?.options.map((option) => (
                      <Button
                        key={option.text}
                        onClick={() => handleOptionSelect(option.value)}
                        variant="outline"
                        className="w-full justify-start text-left h-auto py-3 px-4"
                      >
                        {option.text}
                      </Button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </>
        ) : (
          <Card className="glass shadow-xl">
            <CardContent className="pt-6 text-center">
              <div className="flex justify-center mb-4">
                <div className="bg-primary/20 p-4 rounded-full">
                  <CheckCircle2 className="h-12 w-12 text-primary" />
                </div>
              </div>
              <h2 className="text-2xl font-bold mb-2">Assessment Complete!</h2>
              <p className="mb-6 text-muted-foreground">
                Based on your responses, we've set your initial attribute levels.
                You can now start leveling up by completing activities.
              </p>
              
              <div className="flex items-center justify-center mb-6">
                <div className="w-24 h-24 rounded-full bg-secondary flex items-center justify-center border-2 border-white/30 animate-pulse-glow">
                  <Award className="h-12 w-12 text-primary" />
                </div>
              </div>
              
              <div className="flex flex-wrap justify-center gap-2 mb-6">
                {user.attributes.map((attr) => (
                  <div 
                    key={attr.type}
                    className="px-3 py-1 rounded-full flex items-center"
                    style={{ backgroundColor: attr.color + "40", color: attr.color }}
                  >
                    <span className="font-medium">{attr.name}: Level {attr.level}</span>
                  </div>
                ))}
              </div>
              
              <Button onClick={handleContinue} className="w-full">
                Continue to Dashboard
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Assessment;
