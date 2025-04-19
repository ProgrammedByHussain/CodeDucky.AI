import os
from flask import Flask, request, jsonify
from flask_cors import CORS
import openai
import logging
from dotenv import load_dotenv

load_dotenv()

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

openai.api_key = os.getenv("OPENAI_API_KEY")

@app.route('/health', methods=['GET'])
def health_check():
    """Simple health check endpoint to verify the API is running."""
    return jsonify({"status": "ok"})

@app.route('/hint', methods=['POST'])
def get_hint():
    """
    Generate a hint for a LeetCode problem based on the user's code.
    
    Expected request body:
    {
        "problemTitle": "Problem title",
        "problemDescription": "Problem description",
        "userCode": "User's current code",
        "language": "Programming language"
    }
    """
    try:
        data = request.json
        
        if not data:
            return jsonify({"error": "No data provided"}), 400
        
        # Extract data from request
        problem_title = data.get('problemTitle', '')
        problem_description = data.get('problemDescription', '')
        user_code = data.get('userCode', '')
        language = data.get('language', '')
        
        # Log request (excluding potentially large code snippets)
        logger.info(f"Received hint request for problem: {problem_title}")
        
        # Validate required fields
        if not problem_title or not problem_description or not user_code:
            return jsonify({"error": "Missing required fields"}), 400
        
        # Create prompt for OpenAI
        prompt = f"""
        You are an experienced programming mentor helping someone solve a LeetCode problem.
        
        ## Problem:
        {problem_title}
        
        ## Description:
        {problem_description}
        
        ## User's Current Code ({language}):
        ```{language}
        {user_code}
        ```
        
        Please provide a helpful hint that guides the user toward the solution without giving it away completely.
        Focus on identifying issues in their approach or suggesting a better algorithm or data structure.
        Keep your hint concise (100-200 words) and include a specific suggestion they can implement.
        """
        
        # Call OpenAI API
        response = openai.ChatCompletion.create(
            model="gpt-4",
            messages=[
                {"role": "system", "content": "You are a helpful programming mentor specializing in algorithm problems."},
                {"role": "user", "content": prompt}
            ],
            max_tokens=300,
            temperature=0.7
        )
        
        # Extract hint from response
        hint = response.choices[0].message.content.strip()
        
        return jsonify({
            "hint": hint
        })
        
    except Exception as e:
        logger.error(f"Error generating hint: {str(e)}")
        return jsonify({"error": f"Error generating hint: {str(e)}"}), 500

if __name__ == '__main__':
    port = int(os.getenv("PORT", 5000))
    app.run(host='0.0.0.0', port=port, debug=False)