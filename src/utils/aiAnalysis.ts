import { Form, StatsSummary } from '../types';

// Mock AI analysis - in a real app, this would call an AI service
export const generateAIInsights = async (form: Form): Promise<string> => {
  // Simulate AI processing delay
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  const totalResponses = form.responses.length;
  const insights = [];
  
  // Analyze response patterns
  if (totalResponses > 0) {
    insights.push(`**Response Overview:** Collected ${totalResponses} anonymous responses, indicating ${totalResponses > 20 ? 'strong' : totalResponses > 10 ? 'moderate' : 'initial'} engagement.`);
    
    // Analyze multiple choice questions
    const mcQuestions = form.questions.filter(q => q.type === 'multiple-choice');
    for (const question of mcQuestions) {
      const responses = form.responses.map(r => r.answers[question.id]).filter(Boolean);
      if (responses.length > 0) {
        const mostCommon = getMostCommonAnswer(responses as string[]);
        if (mostCommon) {
          insights.push(`**${question.question}:** "${mostCommon.answer}" was the most popular choice (${mostCommon.percentage}% of responses), suggesting this is a key preference among your audience.`);
        }
      }
    }
    
    // Analyze text responses
    const textQuestions = form.questions.filter(q => q.type === 'text');
    for (const question of textQuestions) {
      const responses = form.responses.map(r => r.answers[question.id]).filter(Boolean) as string[];
      if (responses.length > 0) {
        const avgLength = responses.reduce((sum, r) => sum + r.length, 0) / responses.length;
        if (avgLength > 50) {
          insights.push(`**${question.question}:** Responses show high engagement with detailed answers (avg. ${Math.round(avgLength)} characters), indicating strong interest in this topic.`);
        }
      }
    }
    
    // Strategic recommendations
    insights.push(`**Recommendations:** ${getStrategicRecommendations(form)}`);
  } else {
    insights.push("No responses were collected. Consider extending the collection period or improving distribution channels.");
  }
  
  return insights.join('\n\n');
};

const getMostCommonAnswer = (responses: string[]): { answer: string; percentage: number } | null => {
  if (responses.length === 0) return null;
  
  const counts: Record<string, number> = {};
  responses.forEach(response => {
    counts[response] = (counts[response] || 0) + 1;
  });
  
  const sortedAnswers = Object.entries(counts).sort((a, b) => b[1] - a[1]);
  const [mostCommon, count] = sortedAnswers[0];
  
  return {
    answer: mostCommon,
    percentage: Math.round((count / responses.length) * 100)
  };
};

const getStrategicRecommendations = (form: Form): string => {
  const totalResponses = form.responses.length;
  const recommendations = [];
  
  if (totalResponses < 10) {
    recommendations.push("Consider broader distribution to increase sample size");
  }
  
  if (totalResponses > 50) {
    recommendations.push("Strong response rate suggests high market interest - consider follow-up research");
  }
  
  const textResponses = form.questions.filter(q => q.type === 'text');
  if (textResponses.length > 0) {
    recommendations.push("Analyze qualitative feedback for deeper insights and feature development opportunities");
  }
  
  return recommendations.length > 0 ? recommendations.join(', ') + '.' : 'Consider follow-up surveys to gather more targeted insights.';
};