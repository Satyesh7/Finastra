import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send } from 'lucide-react';
import { 
  LineChart, 
  Line, 
  PieChart, 
  Pie,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';

// API Configuration
const ALPHA_VANTAGE_API_KEY = 'ZIO4OM4J46L1EW7V';
const YAHOO_FINANCE_API = 'e219c1a5e2msh7491a8fe476b319p10da74jsn31a92020b07a';
const ALPHA_VANTAGE_BASE_URL = 'https://www.alphavantage.co/query';

// Stock Data Functions
  const fetchStockData = async (symbol) => {
  try {
    const response = await fetch(
      `${ALPHA_VANTAGE_BASE_URL}?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${ALPHA_VANTAGE_API_KEY}`
    );
    const data = await response.json();
    
    // Check for API errors
    if (data['Error Message'] || data['Note']) {
      console.error('API Error:', data);
      return null;
    }
    
    return data['Global Quote'] || null;
  } catch (error) {
    console.error('Error fetching stock data:', error);
    return null;
  }
};

const fetchTimeSeriesData = async (symbol) => {
  try {
    const response = await fetch(
      `${ALPHA_VANTAGE_BASE_URL}?function=TIME_SERIES_DAILY&symbol=${symbol}&apikey=${ALPHA_VANTAGE_API_KEY}`
    );
    const data = await response.json();
    const timeSeriesData = data['Time Series (Daily)'];
    
    return Object.entries(timeSeriesData).slice(0, 30).map(([date, values]) => ({
      date,
      value: parseFloat(values['4. close'])
    })).reverse();
  } catch (error) {
    console.error('Error fetching time series data:', error);
    return [];
  }
};

// Chart Components
const StockChart = ({ data, type = 'line' }) => {
  if (type === 'line') {
    return (
      <div className="w-full h-48">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="value" stroke="#4F46E5" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    );
  }
  
  return (
    <div className="w-full h-48">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={60}
            fill="#4F46E5"
            label
          />
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

const QUESTIONS = [
  {
    id: 'financial_situation',
    text: "What is your current financial situation? (e.g., monthly income, expenses, savings)",
    nextQuestion: 'goals'
  },
  {
    id: 'goals',
    text: "What are your top financial goals? (e.g., retirement, home purchase, education fund)",
    nextQuestion: 'risk_tolerance'
  },
  {
    id: 'risk_tolerance',
    text: "What is your risk tolerance? (conservative, balanced, aggressive)",
    nextQuestion: 'investment_horizon'
  },
  {
    id: 'investment_horizon',
    text: "What is your investment horizon? (short-term, medium-term, long-term)",
    nextQuestion: 'monthly_investment'
  },
  {
    id: 'monthly_investment',
    text: "How much are you willing to invest each month?",
    nextQuestion: 'preferred_investments'
  },
  {
    id: 'preferred_investments',
    text: "Do you have any preferred investment types? (stocks, bonds, mutual funds, ETFs)",
    nextQuestion: null
  }
];

const FinancialChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [userResponses, setUserResponses] = useState({});
  const [userName, setUserName] = useState('');
  const [conversationStage, setConversationStage] = useState('greeting');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (messages.length === 0) {
      const initialMessage = {
        text: "👋 Hey! I'm Max - your AI investment buddy. What should I call you?",
        isBot: true
      };
      setMessages([initialMessage]);
    }
    scrollToBottom();
  }, [messages.length]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

// Yahoo Finance API endpoints and functions
const processStockSymbol = async (input) => {
  try {
    // If input looks like a stock symbol, try it directly
    if (input.toUpperCase() === input && input.length >= 1 && input.length <= 5) {
      const data = await fetchStockData(input);
      if (data) return input;
    }

    // Search for the stock
    const searchResults = await searchStock(input);
    
    if (searchResults.length > 0) {
      // If we have multiple results, show them to the user
      if (searchResults.length > 1) {
        const resultText = `I found multiple matches for "${input}". Which one did you mean?\n\n${
          searchResults.map((result, index) => 
            `${index + 1}. ${result.name} (${result.symbol})`
          ).join('\n')
        }`;

        addMessage({
          text: resultText,
          isBot: true,
          actions: searchResults.map(result => ({
            label: `${result.symbol} - ${result.name}`,
            value: `analyze_${result.symbol}`
          }))
        });
        return null;
      }
      return searchResults[0].symbol;
    }
    
    return null;
  } catch (error) {
    console.error('Error processing stock symbol:', error);
    return null;
  }
};

const getRecommendedStocks = (riskProfile) => {
  const recommendations = {
    conservative: [
      { symbol: 'VTI', name: 'Vanguard Total Stock Market ETF', type: 'ETF' },
      { symbol: 'JNJ', name: 'Johnson & Johnson', type: 'Stock' },
      { symbol: 'PG', name: 'Procter & Gamble', type: 'Stock' },
      { symbol: 'KO', name: 'Coca-Cola Company', type: 'Stock' },
      { symbol: 'VIG', name: 'Vanguard Dividend Appreciation ETF', type: 'ETF' }
    ],
    balanced: [
      { symbol: 'VGT', name: 'Vanguard Information Technology ETF', type: 'ETF' },
      { symbol: 'MSFT', name: 'Microsoft Corporation', type: 'Stock' },
      { symbol: 'V', name: 'Visa Inc.', type: 'Stock' },
      { symbol: 'HD', name: 'Home Depot', type: 'Stock' },
      { symbol: 'QQQ', name: 'Invesco QQQ Trust', type: 'ETF' }
    ],
    aggressive: [
      { symbol: 'ARKK', name: 'ARK Innovation ETF', type: 'ETF' },
      { symbol: 'NVDA', name: 'NVIDIA Corporation', type: 'Stock' },
      { symbol: 'TSLA', name: 'Tesla, Inc.', type: 'Stock' },
      { symbol: 'AMD', name: 'Advanced Micro Devices', type: 'Stock' },
      { symbol: 'SOXX', name: 'iShares Semiconductor ETF', type: 'ETF' }
    ]
  };

  // Default to balanced if risk profile is not recognized
  const profile = riskProfile?.toLowerCase() || 'balanced';
  return recommendations[profile] || recommendations.balanced;
};

const fetchStockData = async (symbol) => {
  try {
    const [quoteResponse, summaryResponse] = await Promise.all([
      fetch(YAHOO_FINANCE_API.quote(symbol)),
      fetch(YAHOO_FINANCE_API.summary(symbol))
    ]);

    const quoteData = await quoteResponse.json();
    const summaryData = await summaryResponse.json();

    if (quoteData.chart.error || !summaryData.quoteSummary.result) {
      return null;
    }

    return {
      quote: quoteData.chart.result[0],
      summary: summaryData.quoteSummary.result[0]
    };
  } catch (error) {
    console.error('Error fetching stock data:', error);
    return null;
  }
};

const searchStock = async (query) => {
  try {
    const response = await fetch(YAHOO_FINANCE_API.search(query));
    const data = await response.json();
    
    if (!data.quotes || data.quotes.length === 0) {
      return [];
    }

    // Filter out non-stock results and get relevant details
    return data.quotes
      .filter(quote => quote.quoteType === 'EQUITY')
      .map(quote => ({
        symbol: quote.symbol,
        name: quote.longname || quote.shortname,
        exchange: quote.exchange,
        type: quote.quoteType
      }));
  } catch (error) {
    console.error('Error searching stocks:', error);
    return [];
  }
};

  const analyzeStock = async (input) => {
    setIsTyping(true);
    const symbol = processStockSymbol(input);
    
    try {
      const quoteData = await fetchStockData(symbol);
      
      if (!quoteData || quoteData['Error Message']) {
        addMessage({
          text: `Sorry, I couldn't find data for "${input}". Please try:\n• Using the stock symbol (e.g., AAPL for Apple)\n• Checking if the company name is spelled correctly\n• Using a different stock symbol`,
          isBot: true
        });
        return;
      }

      const timeSeriesData = await fetchTimeSeriesData(symbol);
      const price = parseFloat(quoteData['05. price']).toFixed(2);
      const change = quoteData['10. change percent'];
      const volume = parseInt(quoteData['06. volume']).toLocaleString();

      addMessage({
        text: `📊 Analysis for ${symbol}:\n\n• Current Price: ${price}\n• Change: ${change}\n• Volume: ${volume}\n\nHere's the 30-day price trend:`,
        isBot: true,
        chart: {
          type: 'line',
          data: timeSeriesData
        }
      });

      // Add performance metrics visualization
      const performanceData = [
        { name: 'Growth', value: parseFloat(change) },
        { name: 'Stability', value: 100 - parseFloat(change) }
      ];

      setTimeout(() => {
        addMessage({
          text: "Here's how the stock is performing in terms of growth vs stability:",
          isBot: true,
          chart: {
            type: 'pie',
            data: performanceData
          }
        });
      }, 1000);
    } catch (error) {
      console.error('Error analyzing stock:', error);
      addMessage({
        text: "I encountered an error while fetching the stock data. Please try again later or with a different symbol.",
        isBot: true
      });
    } finally {
      setIsTyping(false);
    }
  };

  const addMessage = (message) => {
    setMessages(prev => [...prev, message]);
  };

  const handleSendMessage = () => {
    if (!inputText.trim()) return;

    const userInput = inputText.trim();
    addMessage({
      text: userInput,
      isBot: false
    });

    if (conversationStage === 'greeting') {
      setUserName(userInput);
      setConversationStage('welcome');
      setTimeout(() => {
        addMessage({
          text: `Awesome to meet you, ${userInput}! 🎯 Ready to grow your wealth?`,
          isBot: true,
          actions: [
            { label: "Let's do it!", value: 'start' },
            { label: "Check investments", value: 'stocks' }
          ]
        });
      }, 500);
    } else if (conversationStage === 'checking_stock') {
      analyzeStock(userInput);
    } else if (currentQuestion) {
      handleQuestionResponse(userInput);
    }

    setInputText('');
  };

  const handleQuestionResponse = (response) => {
    setUserResponses(prev => ({
      ...prev,
      [currentQuestion.id]: response
    }));

    const nextQuestion = QUESTIONS.find(q => q.id === currentQuestion.nextQuestion);
    if (nextQuestion) {
      setCurrentQuestion(nextQuestion);
      addMessage({
        text: nextQuestion.text,
        isBot: true
      });
    } else {
      generateInvestmentSummary();
    }
  };

  const generateInvestmentSummary = async () => {
    const summary = `Based on your responses, here's your investment profile:
    • Financial Situation: ${userResponses.financial_situation}
    • Goals: ${userResponses.goals}
    • Risk Tolerance: ${userResponses.risk_tolerance}
    • Investment Horizon: ${userResponses.investment_horizon}
    • Monthly Investment: ${userResponses.monthly_investment}
    • Preferred Investments: ${userResponses.preferred_investments}`;

    addMessage({
      text: summary,
      isBot: true
    });

    // Get recommended stocks based on risk profile
    const recommendedStocks = getRecommendedStocks(userResponses.risk_tolerance);
    
    // Fetch current data for recommended stocks
    setIsTyping(true);
    try {
      const stockData = await Promise.all(
        recommendedStocks.map(async (stock) => {
          const data = await fetchStockData(stock.symbol);
          if (data && !data.chart.error) {
            const quote = data.chart.result[0];
            const lastPrice = quote.meta.regularMarketPrice;
            const previousClose = quote.meta.previousClose;
            const percentChange = ((lastPrice - previousClose) / previousClose * 100).toFixed(2);
            return {
              ...stock,
              price: lastPrice.toFixed(2),
              change: percentChange
            };
          }
          return null;
        })
      );

      const validStockData = stockData.filter(stock => stock !== null);

      if (validStockData.length > 0) {
        const recommendationText = `Based on your ${userResponses.risk_tolerance} risk profile, here are 5 recommended investments:\n\n${validStockData.map(stock => 
          `• ${stock.name} (${stock.symbol})\n  Price: ${stock.price} | Change: ${stock.change}%`
        ).join('\n\n')}`;

        addMessage({
          text: recommendationText,
          isBot: true
        });

        // Add visualization of stock performances
        const performanceData = validStockData.map(stock => ({
          name: stock.symbol,
          value: parseFloat(stock.change)
        }));

        setTimeout(() => {
          addMessage({
            text: "Here's how these stocks have been performing:",
            isBot: true,
            chart: {
              type: 'line',
              data: performanceData
            }
          });
        }, 1000);
      }
    } catch (error) {
      console.error('Error fetching recommendations:', error);
      addMessage({
        text: "I encountered an error while fetching the latest stock data. Would you like to learn more about investment strategies for your risk profile instead?",
        isBot: true
      });
    } finally {
      setIsTyping(false);
    }
  };

  const handleActionClick = (value) => {
    switch (value) {
      case 'start':
        addMessage({
          text: `Quick question ${userName} - what's your monthly income and savings looking like? 💰`,
          isBot: true
        });
        setCurrentQuestion(QUESTIONS[0]);
        break;
      case 'stocks':
        setConversationStage('checking_stock');
        addMessage({
          text: `Which investment interests you, ${userName}? Drop a company name or symbol! 📈`,
          isBot: true
        });
        break;
      case 'show_recommendations':
        // Handle showing recommendations based on user profile
        break;
      default:
        break;
    }
  };

  return (
    <div className="fixed bottom-4 right-4 flex flex-col items-end z-50">
      {isOpen && (
        <div className="mb-4 bg-white rounded-lg shadow-xl w-96 h-96 flex flex-col">
          <div className="flex justify-between items-center p-4 border-b bg-gradient-to-r from-indigo-600 to-blue-500 rounded-t-lg">
            <h3 className="text-lg font-semibold text-white">Investment Assistant</h3>
            <button 
              onClick={() => setIsOpen(false)}
              className="text-white hover:text-gray-200 transition-colors duration-200"
            >
              <X size={20} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto">
            <div className="p-4 space-y-4">
              {messages.map((message, index) => (
                <div key={index} className={`flex ${message.isBot ? 'justify-start' : 'justify-end'}`}>
                  <div className={`max-w-[80%] p-3 rounded-lg ${
                    message.isBot
                      ? 'bg-gray-100 text-gray-800'
                      : 'bg-gradient-to-r from-indigo-600 to-blue-500 text-white'
                  }`}>
                    <div className="whitespace-pre-wrap">{message.text}</div>
                    
                    {message.actions && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {message.actions.map((action, idx) => (
                          <button
                            key={idx}
                            onClick={() => handleActionClick(action.value)}
                            className="px-3 py-1 bg-white text-indigo-600 rounded-full text-sm hover:bg-indigo-50 transition-colors duration-200"
                          >
                            {action.label}
                          </button>
                        ))}
                      </div>
                    )}
                    
                    {message.chart && (
                      <div className="mt-4">
                        <StockChart 
                          data={message.chart.data}
                          type={message.chart.type}
                        />
                      </div>
                    )}
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 text-gray-800 p-3 rounded-lg animate-pulse">
                    Analyzing...
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </div>

          <div className="p-4 border-t bg-white">
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Type your message..."
                className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <button
                onClick={handleSendMessage}
                className="p-2 bg-gradient-to-r from-indigo-600 to-blue-500 text-white rounded-full hover:opacity-90 transition-opacity duration-200"
              >
                <Send size={20} />
              </button>
            </div>
          </div>
        </div>
      )}

      {!isOpen && (
        <div className="flex flex-col items-end">
          <span className="mb-2 text-sm font-medium text-gray-700 bg-white px-3 py-1 rounded-lg shadow-sm">
            Investment Help?
          </span>
          <button
            onClick={() => setIsOpen(true)}
            className="bg-gradient-to-r from-indigo-600 to-blue-500 text-white rounded-full p-4 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
          >
            <MessageCircle size={24} />
          </button>
        </div>
      )}
    </div>
  );
};

export default FinancialChatbot;