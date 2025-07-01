#!/usr/bin/env python3
"""
AI Market Analysis Tool - API Demo Script

This script demonstrates how to use the market analysis API endpoints.
Make sure the Flask server is running on localhost:5001 before running this script.

Usage:
    python api_demo.py

Note: You'll need to set your OpenAI API key as an environment variable:
    export OPENAI_API_KEY="your-api-key-here"
"""

import requests
import json
import os

# Configuration
BASE_URL = "http://localhost:5001/api/market"
OPENAI_API_KEY = os.getenv('OPENAI_API_KEY', 'your-openai-api-key-here')

def test_health_endpoint():
    """Test the health check endpoint"""
    print("🔍 Testing health endpoint...")
    try:
        response = requests.get(f"{BASE_URL}/health")
        if response.status_code == 200:
            print("✅ Health check passed!")
            print(f"Response: {response.json()}")
        else:
            print(f"❌ Health check failed with status {response.status_code}")
    except Exception as e:
        print(f"❌ Error testing health endpoint: {e}")
    print()

def test_stock_analysis():
    """Test stock analysis endpoint"""
    print("📊 Testing stock analysis...")
    
    payload = {
        "symbols": ["AAPL", "GOOGL", "MSFT"],
        "analysis_type": "technical",
        "time_period": "1mo",
        "custom_prompt": "Focus on recent price trends and volume analysis"
    }
    
    headers = {
        "Content-Type": "application/json",
        "X-OpenAI-API-Key": OPENAI_API_KEY
    }
    
    try:
        response = requests.post(f"{BASE_URL}/analyze", json=payload, headers=headers)
        if response.status_code == 200:
            data = response.json()
            print("✅ Stock analysis successful!")
            print(f"Analysis type: {data.get('analysis_type')}")
            print(f"Time period: {data.get('time_period')}")
            print(f"Symbols analyzed: {list(data.get('market_data', {}).keys())}")
            print("📈 Market data preview:")
            for symbol, data_point in list(data.get('market_data', {}).items())[:2]:
                print(f"  {symbol}: ${data_point.get('current_price', 'N/A'):.2f} "
                      f"({data_point.get('price_change_percent', 0):.2f}%)")
        else:
            print(f"❌ Stock analysis failed with status {response.status_code}")
            print(f"Error: {response.text}")
    except Exception as e:
        print(f"❌ Error testing stock analysis: {e}")
    print()

def test_market_summary():
    """Test market summary endpoint"""
    print("📈 Testing market summary...")
    
    payload = {
        "indices": ["^GSPC", "^DJI", "^IXIC"],
        "sectors": ["XLK", "XLF", "XLE"],
        "report_type": "daily"
    }
    
    headers = {
        "Content-Type": "application/json",
        "X-OpenAI-API-Key": OPENAI_API_KEY
    }
    
    try:
        response = requests.post(f"{BASE_URL}/market-summary", json=payload, headers=headers)
        if response.status_code == 200:
            data = response.json()
            print("✅ Market summary successful!")
            print(f"Report type: {data.get('report_type')}")
            print("📊 Market overview:")
            for symbol, data_point in list(data.get('market_data', {}).items())[:3]:
                print(f"  {symbol}: {data_point.get('current', 'N/A')} "
                      f"({data_point.get('change_percent', 0):.2f}%)")
        else:
            print(f"❌ Market summary failed with status {response.status_code}")
            print(f"Error: {response.text}")
    except Exception as e:
        print(f"❌ Error testing market summary: {e}")
    print()

def test_stock_screening():
    """Test stock screening endpoint"""
    print("🔍 Testing stock screening...")
    
    payload = {
        "criteria": "Technology stocks with P/E ratio less than 30",
        "market_cap": "large",
        "sector": "Technology",
        "max_results": 5
    }
    
    headers = {
        "Content-Type": "application/json",
        "X-OpenAI-API-Key": OPENAI_API_KEY
    }
    
    try:
        response = requests.post(f"{BASE_URL}/stock-screener", json=payload, headers=headers)
        if response.status_code == 200:
            data = response.json()
            print("✅ Stock screening successful!")
            print(f"Criteria: {data.get('criteria')}")
            print("🎯 Screening results available")
        else:
            print(f"❌ Stock screening failed with status {response.status_code}")
            print(f"Error: {response.text}")
    except Exception as e:
        print(f"❌ Error testing stock screening: {e}")
    print()

def main():
    """Run all API tests"""
    print("🚀 AI Market Analysis Tool - API Demo")
    print("=" * 50)
    
    if OPENAI_API_KEY == 'your-openai-api-key-here':
        print("⚠️  Warning: Please set your OpenAI API key as an environment variable:")
        print("   export OPENAI_API_KEY='your-actual-api-key'")
        print()
    
    # Test all endpoints
    test_health_endpoint()
    test_stock_analysis()
    test_market_summary()
    test_stock_screening()
    
    print("🎉 Demo completed!")
    print("\n💡 To use the web interface, visit: http://localhost:5001")

if __name__ == "__main__":
    main()

