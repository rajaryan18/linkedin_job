import json
from typing import Dict, Any, Optional
from .LLMClient import LLMClient, MockLLMClient

class AIProvider:
    """
    AIProvider interface for analyzing resumes against job descriptions.
    Uses the Strategy Pattern for LLM clients.
    """

    def __init__(self, llm_client: Optional[LLMClient] = None):
        """
        Initializes AIProvider with a specific LLM client strategy.
        Defaults to MockLLMClient if none provided.
        """
        self.llm_client = llm_client if llm_client else MockLLMClient()

    def _get_prompt(self, resume_text: str, jd_text: str) -> str:
        """
        Crafts the prompt for the LLM.
        """
        return f"""
        You are an expert career coach and recruiter. Analyze the following resume against the job description (JD).
        
        Resume:
        {resume_text}
        
        Job Description:
        {jd_text}
        
        Please provide the following information in a valid JSON format:
        1. "additions": What specific technical skills or experiences are missing from the resume that are required by the JD?
        2. "general_suggestions": General advice in natural language on how to improve the resume (e.g., formatting, tone, structure).
        3. "match_rating": A rating from 0 to 5 of how well the candidate matches the JD (0 = no match, 5 = perfect match).
        4. "keywords": A list of key terms (skills, tools, certifications) that should be added to the resume to pass ATS filters for this JD.
        
        Return ONLY the JSON object.
        """

    def analyze_resume(self, resume_text: str, jd_text: str) -> Dict[str, Any]:
        """
        Analyzes the resume and returns a dictionary with the results.
        """
        prompt = self._get_prompt(resume_text, jd_text)
        
        try:
            response_text = self.llm_client.generate_content(prompt)
            # Ensure we extract JSON from the response text (handling potential markdown blocks)
            clean_content = response_text.replace("```json", "").replace("```", "").strip()
            return json.loads(clean_content)
        except Exception as e:
            print(f"Error during AI analysis: {e}")
            return {
                "error": str(e),
                "additions": "N/A",
                "general_suggestions": "Could not generate suggestions due to an error.",
                "match_rating": 0,
                "keywords": []
            }

if __name__ == "__main__":
    # Example usage with default Mock strategy
    provider = AIProvider()
    resume = "I am a Software Engineer with 3 years of experience in Python and Flask."
    jd = "Looking for a Senior Software Engineer with 5+ years of experience in Python, Docker, and Kubernetes."
    
    result = provider.analyze_resume(resume, jd)
    print(json.dumps(result, indent=4))
