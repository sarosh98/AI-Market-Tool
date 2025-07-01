# AI-Powered Market Analysis Tool

## Overview

The AI-Powered Market Analysis Tool is a comprehensive web application designed to provide intelligent insights into financial markets. Leveraging the power of OpenAI's GPT-4 and real-time market data, it offers features for stock analysis, market summaries, and AI-driven stock screening. The application is built with a Flask backend for API services and a React frontend for a dynamic and responsive user interface.

## Features

### 1. Stock Analysis
- **AI-Powered Insights**: Get in-depth technical, fundamental, and sentiment analysis for individual stocks using OpenAI GPT-4.
- **Customizable Analysis**: Specify stock symbols, analysis type (technical, fundamental, sentiment), time periods (1 day to 1 year), and custom prompts for tailored insights.
- **Real-time Data**: Integrates with `yfinance` to fetch up-to-date stock data.

### 2. Market Summary
- **Comprehensive Overviews**: Generate daily market summaries covering major indices (S&P 500, Dow Jones, NASDAQ) and key sectors.
- **AI-Generated Reports**: Receive concise and insightful reports on overall market conditions and trends.

### 3. AI Stock Screener
- **Natural Language Criteria**: Find stocks that match your investment criteria by simply describing them in natural language (e.g., 



## Technologies Used

### Backend
- **Flask**: A lightweight Python web framework for building the API.
- **Flask-SQLAlchemy**: ORM for interacting with the database (SQLite by default).
- **Flask-CORS**: Enables Cross-Origin Resource Sharing for seamless frontend-backend communication.
- **OpenAI Python Library**: For integrating with OpenAI GPT-4 for AI analysis.
- **yfinance**: A popular library for fetching historical market data from Yahoo Finance.
- **NumPy**: Used for numerical operations, especially with data from `yfinance`.

### Frontend
- **React**: A JavaScript library for building user interfaces.
- **Vite**: A fast build tool for modern web projects.
- **Tailwind CSS**: A utility-first CSS framework for rapid UI development.
- **Shadcn/ui**: A collection of reusable components built with Radix UI and Tailwind CSS.
- **Lucide React**: A collection of open-source icons.
- **pnpm**: A fast, disk space efficient package manager for Node.js.

## Project Structure

```
AI-Powered Market/
├── src/
│   ├── main.py                    # Flask application entry point
│   ├── extensions.py              # Centralized SQLAlchemy db object initialization
│   ├── routes/                    # API blueprints
│   │   ├── user.py                # User authentication and management routes
│   │   └── market_analysis.py     # Market analysis API routes
│   ├── models/                    # Database models
│   │   └── user.py                # User model
│   ├── database/                  # SQLite database file (app.db) will be created here
│   └── static/                    # Built React frontend files are served from here
├── market-analysis-frontend/      # React frontend source code
│   ├── public/
│   ├── src/
│   │   ├── App.jsx                # Main React application component
│   │   ├── main.jsx               # React entry point
│   │   ├── index.css              # Main CSS file (Tailwind imports)
│   │   ├── App.css                # Custom CSS and Tailwind theme variables
│   │   ├── components/            # Reusable React components
│   │   │   └── ui/                # Shadcn/ui components
│   │   ├── hooks/
│   │   └── lib/
│   │       └── utils.js           # Utility functions (e.g., for Tailwind CSS class merging)
│   ├── package.json               # Frontend dependencies and scripts
│   ├── pnpm-lock.yaml             # pnpm lock file
│   ├── postcss.config.js          # PostCSS configuration for Tailwind CSS
│   ├── tailwind.config.js         # Tailwind CSS configuration
│   └── vite.config.js             # Vite build configuration
├── venv/                          # Python virtual environment
├── requirements.txt               # Python dependencies
├── api_demo.py                    # Python script to test API endpoints
├── README.md                      # Project README file
└── .gitignore                     # Git ignore file
```




## Setup and Installation

Follow these steps to get the AI-Powered Market Analysis Tool up and running on your local machine.

### Prerequisites

Before you begin, ensure you have the following installed:

*   **Python 3.11+**: Download from [python.org](https://www.python.org/downloads/). Make sure to add Python to your PATH during installation.
*   **Node.js LTS (Long Term Support) version**: Download from [nodejs.org](https://nodejs.org/en/download/). Ensure `npm` (Node Package Manager) is included in the installation and added to your PATH.
*   **Git**: For cloning the repository.

### 1. Clone the Repository

First, clone the project repository to your local machine:

```bash
git clone <repository_url> # Replace <repository_url> with the actual URL
cd AI-Powered Market
```

### 2. Backend Setup (Flask)

Navigate to the backend project directory and set up the Python virtual environment.

```bash
cd AI-Powered Market
python -m venv venv
```

**Activate the virtual environment:**

*   **Windows:**
    ```bash
vend\Scripts\activate
    ```
*   **macOS/Linux:**
    ```bash
source venv/bin/activate
    ```

**Install Python dependencies:**

```bash
pip install -r requirements.txt
```

**Create the database directory:**

```bash
mkdir src\database # For Windows
# mkdir -p src/database # For macOS/Linux
```

### 3. Frontend Setup (React)

Navigate to the frontend project directory.

```bash
cd market-analysis-frontend
```

**Install pnpm globally (if you haven't already):**

```bash
npm install -g pnpm
```

**Install frontend dependencies:**

```bash
pnpm install
```

**Build the React frontend for production:**

```bash
pnpm run build
```

**Copy the built frontend files to the Flask static directory:**

This step is crucial for the Flask backend to serve the React frontend.

*   **Windows (from `market-analysis-frontend` directory):**
    ```bash
robocopy dist ..\src\static /e /mir
    ```
    (Note: `..\src\static` assumes `market-analysis-frontend` and `src` are siblings within `AI-Powered Market`)

*   **macOS/Linux (from `market-analysis-frontend` directory):**
    ```bash
cp -r dist/* ../src/static/
    ```

### 4. Running the Application

**Navigate back to the root of the backend project:**

```bash
cd ..
```

**Ensure your virtual environment is activated.**

**Start the Flask development server:**

```bash
python src/main.py
```

The server will typically run on `http://127.0.0.1:5001`. Open this URL in your web browser.

### 5. Configure OpenAI API Key

Upon opening the application in your browser, you will see an input field to enter your OpenAI API Key. Obtain your API key from the [OpenAI platform](https://platform.openai.com/account/api-keys) and enter it into the application to enable AI-powered features.

## Usage

Once the application is running and your API key is configured:

*   **Stock Analysis**: Enter comma-separated stock symbols (e.g., `AAPL,GOOGL,MSFT`), select an analysis type and time period, and optionally add a custom prompt. Click 



## Troubleshooting

This section addresses common issues you might encounter during setup or while running the application.

### 1. `ERROR: No matching distribution found for ...` or `Requires-Python >=X.Y`

This indicates a Python dependency version conflict or an outdated Python interpreter.

*   **Solution**: Ensure your Python version is 3.11 or higher. If the error persists, try updating `pip` within your virtual environment (`python -m ensurepip --upgrade`) and then reinstalling dependencies (`pip install -r requirements.txt`). The `requirements.txt` provided uses flexible version ranges to minimize these issues.

### 2. `ModuleNotFoundError: No module named 'src.models.user'` or similar

This means Python cannot find a specific module, usually due to an incorrect file structure.

*   **Solution**: Verify that your project structure exactly matches the `Project Structure` section above. Ensure `main.py`, `extensions.py`, `routes/` (with `user.py` and `market_analysis.py`), and `models/` (with `user.py`) are in their correct locations within the `src` directory.

### 3. `ImportError: cannot import name '...' from partially initialized module '...' (most likely due to a circular import)`

This occurs when modules try to import from each other in a loop.

*   **Solution**: Ensure `db` is initialized in `src/extensions.py` and imported from there into `src/main.py` and `src/models/user.py`. The provided code structure is designed to prevent this.

### 4. `RuntimeError: Either 'SQLALCHEMY_DATABASE_URI' or 'SQLALCHEMY_BINDS' must be set.`

This means the database connection string is not configured.

*   **Solution**: In `src/main.py`, ensure the `app.config['SQLALCHEMY_DATABASE_URI']` line is uncommented and correctly points to your database file (e.g., `sqlite:///src/database/app.db`). Also, ensure `db.init_app(app)` is called after `app.config` is set.

### 5. `FileNotFoundError: [Errno 2] No such file or directory: '.../src/database/app.db'`

This means the `database` directory where the SQLite file should reside does not exist.

*   **Solution**: Manually create the `database` folder inside your `src` directory: `mkdir src\database` (Windows) or `mkdir -p src/database` (macOS/Linux).

### 6. `Could not find index.html` or blank page in browser

This indicates the React frontend files are not being served by Flask.

*   **Solution**: Ensure you have successfully run `pnpm install` and `pnpm run build` in the `market-analysis-frontend` directory. Then, verify that the contents of the `dist` folder were correctly copied to `src/static` using the `robocopy` (Windows) or `cp -r` (macOS/Linux) command as described in the `Frontend Setup` section. Remember to restart the Flask server after copying files.

### 7. `Failed to load PostCSS config: Cannot find module 'autoprefixer'` or similar frontend build errors

This suggests missing frontend development dependencies.

*   **Solution**: Ensure all frontend dependencies are installed by running `pnpm install` in the `market-analysis-frontend` directory. If specific modules are reported missing, try installing them explicitly (e.g., `pnpm install autoprefixer postcss`).

### 8. `Object of type int64 is not JSON serializable`

This is a backend error when `yfinance` data (NumPy types) is sent directly as JSON.

*   **Solution**: Ensure your `src/routes/market_analysis.py` includes the `convert_numpy_types` function and applies it to all data structures before they are returned in `jsonify` responses, as provided in the latest version of the code.

### 9. `SyntaxError: f-string: unmatched '('`

This is a Python syntax error, often due to incorrect quoting within f-strings.

*   **Solution**: Check your `src/routes/market_analysis.py` for f-strings that use the same quote type internally as their external delimiter (e.g., `f"... {s_data.get("name", symbol)} ..."`). Change the inner quotes to the opposite type (e.g., `f"... {s_data.get(\'name\', symbol)} ..."`).

If you encounter any other issues, please refer to the specific error message and consult online resources or seek further assistance.


