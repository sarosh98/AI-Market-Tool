from flask import Blueprint, jsonify, request
import openai
import yfinance as yf
import numpy as np

market_bp = Blueprint("market_bp", __name__)

def convert_numpy_types(obj):
    """Recursively convert numpy types to native Python types."""
    if isinstance(obj, np.integer):
        return int(obj)
    elif isinstance(obj, np.floating):
        return float(obj)
    elif isinstance(obj, np.ndarray):
        return obj.tolist()
    elif isinstance(obj, dict):
        return {k: convert_numpy_types(v) for k, v in obj.items()}
    elif isinstance(obj, list):
        return [convert_numpy_types(elem) for elem in obj]
    return obj

def get_stock_data(symbols, period="1mo"):
    data = {}
    for symbol in symbols:
        try:
            ticker = yf.Ticker(symbol)
            hist = ticker.history(period=period)
            if not hist.empty:
                latest_data = hist.iloc[-1]
                previous_close = hist.iloc[-2]["Close"] if len(hist) > 1 else latest_data["Close"]
                price_change = latest_data["Close"] - previous_close
                price_change_percent = (price_change / previous_close) * 100 if previous_close != 0 else 0

                info = ticker.info
                data[symbol] = {
                    "current_price": latest_data["Close"],
                    "price_change": price_change,
                    "price_change_percent": price_change_percent,
                    "volume": latest_data["Volume"],
                    "open": latest_data["Open"],
                    "high": latest_data["High"],
                    "low": latest_data["Low"],
                    "pe_ratio": info.get("trailingPE"),
                    "market_cap": info.get("marketCap"),
                    "sector": info.get("sector"),
                    "industry": info.get("industry"),
                    "long_name": info.get("longName"),
                }
            else:
                data[symbol] = {"error": "No historical data found"}
        except Exception as e:
            data[symbol] = {"error": str(e)}
    return convert_numpy_types(data)

@market_bp.route("/health", methods=["GET"])
def health_check():
    return jsonify({"status": "ok", "message": "Market analysis service is up and running!"})

@market_bp.route("/analyze", methods=["POST"])
def analyze_stocks():
    data = request.get_json()
    symbols = data.get("symbols")
    analysis_type = data.get("analysis_type", "technical")
    time_period = data.get("time_period", "1mo")
    custom_prompt = data.get("custom_prompt", "")
    api_key = request.headers.get("X-OpenAI-API-Key")

    if not api_key:
        return jsonify({"success": False, "error": "OpenAI API key is required"}), 400

    openai.api_key = api_key

    market_data = get_stock_data(symbols, time_period)

    if not market_data:
        return jsonify({"success": False, "error": "Could not retrieve market data"}), 500

    prompt = f"Perform a {analysis_type} analysis for the following stocks based on the provided data. {custom_prompt}\n\n"
    for symbol, s_data in market_data.items():
        prompt += f"\n--- {symbol} Data ---\n"
        for k, v in s_data.items():
            prompt += f"{k}: {v}\n"

    try:
        response = openai.chat.completions.create(
            model="gpt-4o",
            messages=[
                {"role": "system", "content": "You are a financial analyst AI. Provide concise and insightful market analysis."},
                {"role": "user", "content": prompt}
            ]
        )
        analysis_result = response.choices[0].message.content
        return jsonify({
            "success": True,
            "analysis": analysis_result,
            "market_data": market_data,
            "analysis_type": analysis_type,
            "time_period": time_period
        })
    except openai.APIError as e:
        return jsonify({"success": False, "error": f"OpenAI API Error: {e}"}), 500
    except Exception as e:
        return jsonify({"success": False, "error": f"Analysis failed: {e}"}), 500

@market_bp.route("/market-summary", methods=["POST"])
def market_summary():
    data = request.get_json()
    indices = data.get("indices", ["^GSPC", "^DJI", "^IXIC"])
    sectors = data.get("sectors", ["XLK", "XLF", "XLE", "XLV"])
    report_type = data.get("report_type", "daily")
    api_key = request.headers.get("X-OpenAI-API-Key")

    if not api_key:
        return jsonify({"success": False, "error": "OpenAI API key is required"}), 400

    openai.api_key = api_key

    market_overview_data = {}
    all_symbols = list(set(indices + sectors))
    for symbol in all_symbols:
        try:
            ticker = yf.Ticker(symbol)
            info = ticker.info
            hist = ticker.history(period="1d")
            if not hist.empty:
                latest_data = hist.iloc[-1]
                previous_close = hist.iloc[-2]["Close"] if len(hist) > 1 else latest_data["Close"]
                change = latest_data["Close"] - previous_close
                change_percent = (change / previous_close) * 100 if previous_close != 0 else 0

                market_overview_data[symbol] = {
                    "name": info.get("longName", symbol),
                    "current": latest_data["Close"],
                    "change": change,
                    "change_percent": change_percent,
                }
            else:
                market_overview_data[symbol] = {"error": "No historical data found"}
        except Exception as e:
            market_overview_data[symbol] = {"error": str(e)}

    market_overview_data = convert_numpy_types(market_overview_data)

    prompt = f"Generate a {report_type} market summary based on the following data:\n\n"
    for symbol, s_data in market_overview_data.items():
        prompt += f"\n--- {s_data.get('name', symbol)} Data ---\n"
        for k, v in s_data.items():
            prompt += f"{k}: {v}\n"

    try:
        response = openai.chat.completions.create(
            model="gpt-4o",
            messages=[
                {"role": "system", "content": "You are a financial analyst AI. Provide a comprehensive market summary."},
                {"role": "user", "content": prompt}
            ]
        )
        summary_result = response.choices[0].message.content
        return jsonify({
            "success": True,
            "summary": summary_result,
            "market_data": market_overview_data,
            "report_type": report_type
        })
    except openai.APIError as e:
        return jsonify({"success": False, "error": f"OpenAI API Error: {e}"}), 500
    except Exception as e:
        return jsonify({"success": False, "error": f"Market summary failed: {e}"}), 500

@market_bp.route("/stock-screener", methods=["POST"])
def stock_screener():
    data = request.get_json()
    criteria = data.get("criteria")
    market_cap = data.get("market_cap", "any")
    sector = data.get("sector", "any")
    max_results = data.get("max_results", 5)
    api_key = request.headers.get("X-OpenAI-API-Key")

    if not api_key:
        return jsonify({"success": False, "error": "OpenAI API key is required"}), 400

    openai.api_key = api_key

    # This is a simplified example. In a real application, you would integrate with a stock screening API
    # or a database of stock fundamentals to filter based on criteria.
    # For now, we will simulate screening with OpenAI.

    prompt = f"Given the following criteria: \nCriteria: {criteria}\nMarket Cap: {market_cap}\nSector: {sector}\nMax Results: {max_results}\n\nSuggest {max_results} stock symbols that best fit these criteria. Provide only the stock symbols, comma-separated, without any additional text or explanation."

    try:
        response = openai.chat.completions.create(
            model="gpt-4o",
            messages=[
                {"role": "system", "content": "You are a stock screening AI. Provide stock symbols based on criteria."},
                {"role": "user", "content": prompt}
            ]
        )
        screening_results_str = response.choices[0].message.content
        screening_results = [s.strip() for s in screening_results_str.split(",") if s.strip()]

        # Optionally, fetch some basic data for the screened stocks
        screened_stocks_data = get_stock_data(screening_results, period="1d")

        return jsonify({
            "success": True,
            "criteria": criteria,
            "screening_results": screened_stocks_data # Return detailed data for screened stocks
        })
    except openai.APIError as e:
        return jsonify({"success": False, "error": f"OpenAI API Error: {e}"}), 500
    except Exception as e:
        return jsonify({"success": False, "error": f"Stock screening failed: {e}"}), 500

