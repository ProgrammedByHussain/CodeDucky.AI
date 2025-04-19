# CodeDucky.AI

A Chrome extension that provides intelligent hints for LeetCode problems based on your current code, using OpenAI's API.

## Features

- Analyzes your code and the problem description
- Provides personalized hints without giving away the full solution
- Works directly in the LeetCode interface
- Helps you learn and improve your problem-solving skills

## Architecture

This project consists of two main components:

1. **Chrome Extension (Frontend)**

   - React-based popup interface
   - Content scripts to extract problem details and code
   - Communication with backend API

2. **Flask Backend (API)**
   - RESTful API built with Flask
   - Communicates with OpenAI's API
   - Processes LeetCode problems and generates hints

## Setup Instructions

### Frontend Setup (Chrome Extension)

1. Clone the repository:

   ```
   git clone https://github.com/ProgrammedByHussain/CodeDucky.AI.git
   cd leetcode-ai-assistant/extension
   ```

2. Install dependencies:

   ```
   npm install
   ```

3. Build the extension:

   ```
   npm run build
   ```

4. Load the extension in Chrome:
   - Open Chrome and navigate to `chrome://extensions/`
   - Enable "Developer mode"
   - Click "Load unpacked" and select the `dist` folder

### Backend Setup (Flask API)

1. Navigate to the backend directory:

   ```
   cd ../backend
   ```

2. Create a virtual environment:

   ```
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. Install dependencies:

   ```
   pip install -r requirements.txt
   ```

4. Create a `.env` file with your OpenAI API key:

   ```
   echo "OPENAI_API_KEY=your_api_key_here" > .env
   ```

5. Run the Flask app locally:
   ```
   flask run
   ```

### Deployment Options

#### Option A: AWS Lambda (Serverless)

1. Install Zappa:

   ```
   pip install zappa
   ```

2. Update `zappa_settings.json` with your S3 bucket name and AWS region

3. Deploy:

   ```
   zappa deploy dev
   ```

4. Update the API endpoint in `popup.jsx` with your Lambda URL

#### Option B: EC2 Instance

1. Set up an EC2 instance with Ubuntu

2. Install dependencies:

   ```
   sudo apt-get update
   sudo apt-get install python3-pip python3-venv nginx
   ```

3. Clone repository and set up as in local development

4. Configure Nginx as a reverse proxy

5. Set up a systemd service to run the Flask app with Gunicorn

## Usage

1. Navigate to a LeetCode problem
2. Start solving the problem
3. When stuck, click the LeetCode AI Assistant icon in your Chrome toolbar
4. Click "Get Hint" to receive a personalized hint based on your current code

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
