from textwrap import dedent
import os
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import uvicorn
import json
import re

from agno.agent import Agent
from agno.models.google import Gemini
from agno.tools.exa import ExaTools


# Hardcode your Google API key here
GOOGLE_API_KEY = "AIzaSyBF9PVcu4XILF-VtjZ5AzxSbdIvpjTisIg" 

app = FastAPI(title="Shelfie API", description="Book Recommendation API")

# Enable CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Request model
class RecommendationRequest(BaseModel):
    prompt: str

# Response model
class BookRecommendation(BaseModel):
    title: str
    author: str
    genre: str
    description: str
    rating: str = "N/A"

class RecommendationResponse(BaseModel):
    books: list[BookRecommendation]
    message: str

# Initialize the Shelfie agent
def create_shelfie_agent():
    if not GOOGLE_API_KEY or GOOGLE_API_KEY == "YOUR_GOOGLE_API_KEY_HERE":
        raise RuntimeError("Please set your GOOGLE_API_KEY in main.py")
    
    gemini_model = Gemini(
        id="gemini-1.5-flash",
        api_key=GOOGLE_API_KEY,
    )
    
    shelfie = Agent(
        name="Shelfie",
        tools=[ExaTools()],
        model=gemini_model,
        description=dedent("""\
            You are Shelfie, a passionate and knowledgeable literary curator with expertise in books worldwide! 📚"""),
        instructions=dedent("""\
            Approach each recommendation with these steps:
            - Analyse reader preferences carefully
            - Search for relevant books using your tools
            - Give detailed book information including title, author, genre, and compelling description
            - Always provide at least 5 book recommendations
            - Format your response as a JSON array with this structure:
            [
                {
                    "title": "Book Title",
                    "author": "Author Name",
                    "genre": "Genre",
                    "description": "Compelling description of the book and why it matches the request",
                    "rating": "Rating/Reviews if available"
                }
            ]
            - Only return the JSON array, no additional text or markdown formatting"""),
        markdown=False,
        add_datetime_to_context=True,
    )
    return shelfie

# Global agent instance
shelfie_agent = None

@app.on_event("startup")
async def startup_event():
    global shelfie_agent
    try:
        shelfie_agent = create_shelfie_agent()
        print("Shelfie agent initialized successfully!")
    except Exception as e:
        print(f"Failed to initialize Shelfie agent: {e}")
        raise

@app.get("/health")
async def health_check():
    return {"status": "healthy", "message": "Shelfie API is running!"}

@app.post("/recommend", response_model=RecommendationResponse)
async def get_recommendations(request: RecommendationRequest):
    global shelfie_agent
    
    if not shelfie_agent:
        raise HTTPException(status_code=500, detail="Shelfie agent not initialized")
    
    if not request.prompt.strip():
        raise HTTPException(status_code=400, detail="Prompt cannot be empty")
    
    try:
        # Get response from the agent
        response = shelfie_agent.run(request.prompt)
        response_text = response.content if hasattr(response, 'content') else str(response)
        
        # Try to extract JSON from the response
        try:
            # Look for JSON array in the response
            json_match = re.search(r'\[.*\]', response_text, re.DOTALL)
            if json_match:
                json_str = json_match.group()
                books_data = json.loads(json_str)
            else:
                # Fallback: try to parse the entire response as JSON
                books_data = json.loads(response_text)
            
            # Validate and convert to our model
            books = []
            for book_data in books_data:
                book = BookRecommendation(
                    title=book_data.get('title', 'Unknown Title'),
                    author=book_data.get('author', 'Unknown Author'),
                    genre=book_data.get('genre', 'Unknown Genre'),
                    description=book_data.get('description', 'No description available'),
                    rating=book_data.get('rating', 'N/A')
                )
                books.append(book)
            
            return RecommendationResponse(
                books=books,
                message=f"Found {len(books)} book recommendations for you!"
            )
            
        except json.JSONDecodeError:
            # If JSON parsing fails, create a fallback response
            raise HTTPException(
                status_code=500, 
                detail="Failed to parse book recommendations. Please try again."
            )
            
    except Exception as e:
        print(f"Error getting recommendations: {e}")
        raise HTTPException(
            status_code=500,
            detail=f"Failed to get recommendations: {str(e)}"
        )

if __name__ == "__main__":
    print("Starting Shelfie API server...")
    print("Make sure to replace YOUR_GOOGLE_API_KEY_HERE with your actual API key!")
    uvicorn.run(app, host="0.0.0.0", port=8000, log_level="info")
