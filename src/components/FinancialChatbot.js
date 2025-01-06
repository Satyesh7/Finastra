import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send } from 'lucide-react';

const FinancialChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  // API Configuration - Replace with your actual API key
  const ALPHA_VANTAGE_API_KEY = 'YOUR_ALPHA_VANTAGE_API_KEY';
  const ALPHA_VANTAGE_URL = 'https://www.alphavantage.co/query';

  useEffect(() => {
    if (messages.length === 0) {
      setMessages([{ 
        text: "Hello! How can I assist you with your financial goals today?",
        isBot: true 
      }]);
    }
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const extractStockSymbol = (text) => {
    // Common company names to symbols mapping
    const commonStocks = {
      'apple': 'AAPL',
      'google': 'GOOGL',
      'microsoft': 'MSFT',
      'amazon': 'AMZN',
      'tesla': 'TSLA',
      'netflix': 'NFLX',
      'meta': 'META',
      'facebook': 'META'
    };

    const words = text.toLowerCase().split(' ');
    
    // First check if a stock symbol is directly mentioned (e.g., AAPL)
    const directSymbol = words.find(word => word.length >= 2 && word.length <= 5 && word === word.toUpperCase());
    if (directSymbol) return directSymbol;

    // Then check for company names
    for (const word of words) {
      if (commonStocks[word]) return commonStocks[word];
    }

    return null;
  };

  const fetchStockData = async (symbol) => {
    try {
      console.log('Fetching data for:', symbol);
      const response = await fetch(
        `${ALPHA_VANTAGE_URL}?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${ALPHA_VANTAGE_API_KEY}`
      );
      const data = await response.json();
      console.log('Received data:', data);
      return data;
    } catch (error) {
      console.error('Error fetching stock data:', error);
      return null;
    }
  };

  const analyzeQuery = (input) => {
    const text = input.toLowerCase();
    const hasStockIndicator = text.includes('stock') || 
                             text.includes('price') || 
                             text.includes('share') ||
                             text.includes('market');
    
    if (hasStockIndicator) {
      const symbol = extractStockSymbol(input);
      return { type: 'stock', symbol };
    }

    if (text.includes('mutual fund') || text.includes('sip')) {
      return { type: 'mutual_fund' };
    }
    
    if (text.includes('invest') || text.includes('portfolio')) {
      return { type: 'investment_advice' };
    }

    return { type: 'general' };
  };

  const generateResponse = async (userInput) => {
    try {
      const query = analyzeQuery(userInput);
      console.log('Analyzed query:', query);
      
      switch (query.type) {
        case 'stock':
          if (query.symbol) {
            setIsTyping(true);
            const data = await fetchStockData(query.symbol);
            console.log('Stock data received:', data);
            
            if (data && data['Global Quote']) {
              const quote = data['Global Quote'];
              return `${query.symbol} Stock Information:
                      Price: $${quote['05. price']}
                      Change: ${quote['10. change percent']}
                      Volume: ${quote['06. volume']}
                      Would you like to know more details?`;
            }
            return `I couldn't fetch the current stock information for ${query.symbol}. Please try again later.`;
          }
          return "Could you specify which stock you're interested in? You can mention the company name or stock symbol.";

        case 'mutual_fund':
          return "I can help you understand mutual funds and SIPs. What specific information would you like to know?";

        case 'investment_advice':
          return "I'd be happy to provide investment advice. Could you tell me more about your financial goals and risk tolerance?";

        default:
          return "How can I help you with your investment journey? You can ask about stocks, mutual funds, or get general investment advice.";
      }
    } catch (error) {
      console.error('Error in generateResponse:', error);
      return "I apologize, but I'm having trouble processing your request. Please try again.";
    }
  };

  const handleSendMessage = async () => {
    if (!inputText.trim()) return;
    
    const userMessage = { text: inputText, isBot: false };
    setMessages(prev => [...prev, userMessage]);
    
    setIsTyping(true);
    const response = await generateResponse(inputText);
    setIsTyping(false);
    
    setMessages(prev => [...prev, { text: response, isBot: true }]);
    setInputText('');
  };

  return (
    <div className="fixed bottom-4 right-4 flex flex-col items-end z-[60]">
      {isOpen && (
        <div className="mb-4 bg-white rounded-lg shadow-xl w-80 md:w-96 flex flex-col h-96 transition-all duration-300">
          <div className="flex justify-between items-center p-4 border-b bg-gradient-to-r from-indigo-600 to-blue-500 rounded-t-lg">
            <h3 className="text-lg font-semibold text-white">JAGOINVESTOR Assist</h3>
            <button 
              onClick={() => setIsOpen(false)}
              className="text-white hover:text-gray-200 transition-colors duration-200"
            >
              <X size={20} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.isBot ? 'justify-start' : 'justify-end'}`}
              >
                <div
                  className={`max-w-xs p-3 rounded-lg ${
                    message.isBot
                      ? 'bg-gray-100 text-gray-800'
                      : 'bg-gradient-to-r from-indigo-600 to-blue-500 text-white'
                  }`}
                >
                  {message.text}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-gray-100 text-gray-800 p-3 rounded-lg animate-pulse">
                  Analyzing data...
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="p-4 border-t">
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Ask about stocks, mutual funds..."
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
            Need Help?
          </span>
          <button
            onClick={() => setIsOpen(true)}
            className="bg-gradient-to-r from-indigo-600 to-blue-500 text-white rounded-full p-4 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
          >
            <MessageCircle size={24} className="text-white" />
          </button>
        </div>
      )}
    </div>
  );
};

export default FinancialChatbot;