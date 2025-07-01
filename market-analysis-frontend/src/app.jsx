import { useState } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Label } from '@/components/ui/label.jsx'
import { Textarea } from '@/components/ui/textarea.jsx'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select.jsx'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Alert, AlertDescription } from '@/components/ui/alert.jsx'
import { TrendingUp, TrendingDown, BarChart3, Search, Brain, AlertCircle, Loader2 } from 'lucide-react'
import './App.css'

function App() {
  const [apiKey, setApiKey] = useState('')
  const [symbols, setSymbols] = useState('AAPL,GOOGL,MSFT')
  const [analysisType, setAnalysisType] = useState('technical')
  const [timePeriod, setTimePeriod] = useState('1mo')
  const [customPrompt, setCustomPrompt] = useState('')
  const [screeningCriteria, setScreeningCriteria] = useState('')
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState(null)
  const [error, setError] = useState('')

  const handleAnalysis = async () => {
    if (!apiKey.trim()) {
      setError('Please enter your OpenAI API key')
      return
    }
    
    if (!symbols.trim()) {
      setError('Please enter at least one stock symbol')
      return
    }

    setLoading(true)
    setError('')
    setResults(null)

    try {
      const response = await fetch('/api/market/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-OpenAI-API-Key': apiKey
        },
        body: JSON.stringify({
          symbols: symbols.split(',').map(s => s.trim().toUpperCase()),
          analysis_type: analysisType,
          time_period: timePeriod,
          custom_prompt: customPrompt
        })
      })

      const data = await response.json()
      
      if (data.success) {
        setResults(data)
      } else {
        setError(data.error || 'Analysis failed')
      }
    } catch (err) {
      setError('Failed to connect to the analysis service')
    } finally {
      setLoading(false)
    }
  }

  const handleMarketSummary = async () => {
    if (!apiKey.trim()) {
      setError('Please enter your OpenAI API key')
      return
    }

    setLoading(true)
    setError('')
    setResults(null)

    try {
      const response = await fetch('/api/market/market-summary', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-OpenAI-API-Key': apiKey
        },
        body: JSON.stringify({
          indices: ["^GSPC", "^DJI", "^IXIC"],
          sectors: ["XLK", "XLF", "XLE", "XLV"],
          report_type: 'daily'
        })
      })

      const data = await response.json()
      
      if (data.success) {
        setResults(data)
      } else {
        setError(data.error || 'Market summary failed')
      }
    } catch (err) {
      setError('Failed to connect to the analysis service')
    } finally {
      setLoading(false)
    }
  }

  const handleStockScreening = async () => {
    if (!apiKey.trim()) {
      setError('Please enter your OpenAI API key')
      return
    }
    
    if (!screeningCriteria.trim()) {
      setError('Please enter screening criteria')
      return
    }

    setLoading(true)
    setError('')
    setResults(null)

    try {
      const response = await fetch('/api/market/stock-screener', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-OpenAI-API-Key': apiKey
        },
        body: JSON.stringify({
          criteria: screeningCriteria,
          market_cap: 'any',
          sector: 'any',
          max_results: 10
        })
      })

      const data = await response.json()
      
      if (data.success) {
        setResults(data)
      } else {
        setError(data.error || 'Stock screening failed')
      }
    } catch (err) {
      setError('Failed to connect to the analysis service')
    } finally {
      setLoading(false)
    }
  }

  const formatCurrency = (value) => {
    if (value === null || value === undefined) return 'N/A'
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value)
  }

  const formatPercent = (value) => {
    if (value === null || value === undefined) return 'N/A'
    return `${value.toFixed(2)}%`
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-slate-900 dark:text-slate-100 mb-2 flex items-center justify-center gap-3">
            <Brain className="h-10 w-10 text-blue-600" />
            AI Market Analysis Tool
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400">
            Powered by OpenAI GPT-4 for intelligent market insights
          </p>
        </div>

        {/* API Key Input */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5" />
              OpenAI API Configuration
            </CardTitle>
            <CardDescription>
              Enter your OpenAI API key to enable AI-powered analysis
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <div className="flex-1">
                <Label htmlFor="apiKey">OpenAI API Key</Label>
                <Input
                  id="apiKey"
                  type="password"
                  placeholder="sk-..."
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  className="mt-1"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Error Display */}
        {error && (
          <Alert className="mb-6 border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/20">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-700 dark:text-red-400">
              {error}
            </AlertDescription>
          </Alert>
        )}

        {/* Main Interface */}
        <Tabs defaultValue="analysis" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="analysis" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Stock Analysis
            </TabsTrigger>
            <TabsTrigger value="summary" className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Market Summary
            </TabsTrigger>
            <TabsTrigger value="screening" className="flex items-center gap-2">
              <Search className="h-4 w-4" />
              Stock Screening
            </TabsTrigger>
          </TabsList>

          {/* Stock Analysis Tab */}
          <TabsContent value="analysis">
            <Card>
              <CardHeader>
                <CardTitle>AI-Powered Stock Analysis</CardTitle>
                <CardDescription>
                  Analyze individual stocks with AI-generated insights
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="symbols">Stock Symbols (comma-separated)</Label>
                    <Input
                      id="symbols"
                      placeholder="AAPL,GOOGL,MSFT"
                      value={symbols}
                      onChange={(e) => setSymbols(e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="analysisType">Analysis Type</Label>
                    <Select value={analysisType} onValueChange={setAnalysisType}>
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="technical">Technical Analysis</SelectItem>
                        <SelectItem value="fundamental">Fundamental Analysis</SelectItem>
                        <SelectItem value="sentiment">Sentiment Analysis</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="timePeriod">Time Period</Label>
                    <Select value={timePeriod} onValueChange={setTimePeriod}>
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1d">1 Day</SelectItem>
                        <SelectItem value="5d">5 Days</SelectItem>
                        <SelectItem value="1mo">1 Month</SelectItem>
                        <SelectItem value="3mo">3 Months</SelectItem>
                        <SelectItem value="6mo">6 Months</SelectItem>
                        <SelectItem value="1y">1 Year</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <Label htmlFor="customPrompt">Custom Analysis Prompt (Optional)</Label>
                  <Textarea
                    id="customPrompt"
                    placeholder="Add specific questions or focus areas for the analysis..."
                    value={customPrompt}
                    onChange={(e) => setCustomPrompt(e.target.value)}
                    className="mt-1"
                  />
                </div>
                <Button 
                  onClick={handleAnalysis} 
                  disabled={loading}
                  className="w-full"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <BarChart3 className="mr-2 h-4 w-4" />
                      Analyze Stocks
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Market Summary Tab */}
          <TabsContent value="summary">
            <Card>
              <CardHeader>
                <CardTitle>Market Summary Report</CardTitle>
                <CardDescription>
                  Get a comprehensive overview of market conditions and trends
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button 
                  onClick={handleMarketSummary} 
                  disabled={loading}
                  className="w-full"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Generating Summary...
                    </>
                  ) : (
                    <>
                      <TrendingUp className="mr-2 h-4 w-4" />
                      Generate Market Summary
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Stock Screening Tab */}
          <TabsContent value="screening">
            <Card>
              <CardHeader>
                <CardTitle>AI Stock Screener</CardTitle>
                <CardDescription>
                  Find stocks that match your investment criteria using AI
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="screeningCriteria">Screening Criteria</Label>
                  <Textarea
                    id="screeningCriteria"
                    placeholder="e.g., 'Growth stocks under $100 with P/E ratio less than 25 in the technology sector'"
                    value={screeningCriteria}
                    onChange={(e) => setScreeningCriteria(e.target.value)}
                    className="mt-1"
                  />
                </div>
                <Button 
                  onClick={handleStockScreening} 
                  disabled={loading}
                  className="w-full"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Screening...
                    </>
                  ) : (
                    <>
                      <Search className="mr-2 h-4 w-4" />
                      Screen Stocks
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Results Display */}
        {results && (
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5" />
                Analysis Results
              </CardTitle>
            </CardHeader>
            <CardContent>
              {/* Stock Analysis Results */}
              {results.analysis && (
                <div className="space-y-6">
                  {/* Market Data Summary */}
                  {results.market_data && (
                    <div>
                      <h3 className="text-lg font-semibold mb-4">Market Data</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {Object.entries(results.market_data).map(([symbol, data]) => (
                          <Card key={symbol} className="p-4">
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="font-semibold">{symbol}</h4>
                              <Badge variant={data.price_change >= 0 ? "default" : "destructive"}>
                                {data.price_change >= 0 ? (
                                  <TrendingUp className="h-3 w-3 mr-1" />
                                ) : (
                                  <TrendingDown className="h-3 w-3 mr-1" />
                                )}
                                {formatPercent(data.price_change_percent)}
                              </Badge>
                            </div>
                            <div className="space-y-1 text-sm">
                              <div className="flex justify-between">
                                <span>Price:</span>
                                <span>{formatCurrency(data.current_price)}</span>
                              </div>
                              <div className="flex justify-between">
                                <span>Change:</span>
                                <span className={data.price_change >= 0 ? "text-green-600" : "text-red-600"}>
                                  {formatCurrency(data.price_change)}
                                </span>
                              </div>
                              {data.pe_ratio && (
                                <div className="flex justify-between">
                                  <span>P/E:</span>
                                  <span>{data.pe_ratio.toFixed(2)}</span>
                                </div>
                              )}
                            </div>
                          </Card>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* AI Analysis */}
                  <div>
                    <h3 className="text-lg font-semibold mb-4">AI Analysis</h3>
                    <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-6">
                      <pre className="whitespace-pre-wrap text-sm leading-relaxed">
                        {results.analysis}
                      </pre>
                    </div>
                  </div>
                </div>
              )}

              {/* Market Summary Results */}
              {results.summary && (
                <div className="space-y-6">
                  {/* Market Overview */}
                  {results.market_data && (
                    <div>
                      <h3 className="text-lg font-semibold mb-4">Market Overview</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {Object.entries(results.market_data).map(([symbol, data]) => (
                          <Card key={symbol} className="p-4">
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="font-semibold text-sm">{data.name || symbol}</h4>
                              <Badge variant={data.change >= 0 ? "default" : "destructive"}>
                                {data.change >= 0 ? (
                                  <TrendingUp className="h-3 w-3 mr-1" />
                                ) : (
                                  <TrendingDown className="h-3 w-3 mr-1" />
                                )}
                                {formatPercent(data.change_percent)}
                              </Badge>
                            </div>
                            <div className="text-lg font-bold">
                              {formatCurrency(data.current)}
                            </div>
                            <div className={`text-sm ${data.change >= 0 ? "text-green-600" : "text-red-600"}`}>
                              {formatCurrency(data.change)}
                            </div>
                          </Card>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* AI Summary */}
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Market Summary</h3>
                    <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-6">
                      <pre className="whitespace-pre-wrap text-sm leading-relaxed">
                        {results.summary}
                      </pre>
                    </div>
                  </div>
                </div>
              )}

              {/* Stock Screening Results */}
              {results.screening_results && (
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold">Stock Screening Results</h3>
                  <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-6">
                    <pre className="whitespace-pre-wrap text-sm leading-relaxed">
                      {JSON.stringify(results.screening_results, null, 2)}
                    </pre>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}

export default App
