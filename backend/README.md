# OmniFlow AI - Backend MVP

OmniFlow AI is a backend service containing an AI agent pipeline designed to understand natural language requests, extract travel parameters, execute browser flight searches, compare results, and draft automated summary emails.

## Tech Stack
- **Framework**: Python 3.12, FastAPI
- **Automation**: Playwright
- **AI Integration**: Google Gemini API SDK (using `gemini-1.5-flash`)
- **JSON Serialization**: Pydantic v2

---

## Installation & Setup

1. **Navigate to the Backend Directory**:
   ```bash
   cd backend
   ```

2. **Initialize and Activate Virtual Environment**:
   - Windows:
     ```powershell
     python -m venv venv
     .\venv\Scripts\activate
     ```
   - macOS/Linux:
     ```bash
     python -m venv venv
     source venv/bin/activate
     ```

3. **Install Dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

4. **Install Playwright Browsers**:
   ```bash
   playwright install chromium
   ```

5. **Configure Environment Variables**:
   Copy `.env.example` to `.env` and set your Google Gemini API key:
   ```env
   GEMINI_API_KEY=your_actual_gemini_api_key_here
   PLAYWRIGHT_HEADLESS=True
   LOG_LEVEL=INFO
   PORT=8000
   HOST=127.0.0.1
   ```

---

## Running the Application

Start the FastAPI application server:
```bash
python app/main.py
```
Or run via uvicorn directly:
```bash
uvicorn app.main:app --reload
```

The server will start on `http://127.0.0.1:8000`.

---

## API Endpoints

### 1. Health Check
- **Endpoint**: `GET /health`
- **Description**: Verifies that the backend services are running.
- **Example Response**:
  ```json
  {
    "status": "healthy",
    "service": "OmniFlow AI Backend"
  }
  ```

### 2. Chat Agent
- **Endpoint**: `POST /chat`
- **Description**: Processes natural language query and executes the agent pipeline.
- **Payload Schema**:
  ```json
  {
    "message": "Find the cheapest flight from Mumbai to Delhi next Friday and email me the best option."
  }
  ```
- **Example Response**:
  ```json
  {
    "intent": "flight_search",
    "entities": {
      "from": "Mumbai",
      "to": "Delhi",
      "date": "Next Friday",
      "budget": null
    },
    "results": [
      {
        "airline": "IndiGo",
        "price": "₹5,200",
        "website": "Google Flights"
      },
      {
        "airline": "Air India",
        "price": "₹6,150",
        "website": "Google Flights"
      }
    ],
    "summary": "Best flight found is IndiGo at ₹5,200 departing at 06:00...",
    "email": "Dear User,\n\nWe found the best flight options for your upcoming trip from Mumbai to Delhi on Next Friday...\n\nBest regards,\nOmniFlow AI"
  }
  ```

---

## Architecture Overview

The backend uses a clean, decoupled layout:
- **`app/main.py`**: App initialization, CORS policy, and server startup.
- **`app/api/`**: REST router definitions (`POST /chat`, `GET /health`).
- **`app/agents/`**: Conversational agent services (`planner`, `intent`, `entity_extractor`, `summarizer`, `email_generator`).
- **`app/automation/`**: Browser automation engine (`browser`, `flight_search`, `playwright_helper`).
- **`app/services/`**: Infrastructure connections (`gemini_service`, `prompt_service`).
- **`app/prompts/`**: Parameterized prompt text files.
- **`app/schemas/`**: Pydantic network request/response definitions.
- **`app/models/`**: Domain models (e.g., flight definition).
