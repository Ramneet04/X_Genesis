
export const CATEGORY_THRESHOLDS: Record<string, number> = {
  Resume: 0.95,        
  Skill: 0.95,         
  OpenSource: 0.90,    
  Project: 0.82,       
  Hackathon: 0.80,     
  Internship: 0.80,    
  Certificate: 0.72,   
  ResearchPaper: 0.30, 
};


export function getThreshold(category: string): number {
  return CATEGORY_THRESHOLDS[category] ?? 0.82;
}