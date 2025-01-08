import React from 'react';
import { Link } from 'react-router-dom';
import { Search, Briefcase, LineChart, PieChart, BookOpen, LogIn, ClipboardCheck, UserCheck } from 'lucide-react';
import FinancialChatbot from './FinancialChatbot';

const Navbar = () => {
  return (
    <nav className="bg-gradient-to-r from-indigo-600 to-blue-500 fixed w-full top-0 z-50">
      <div className="w-full px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo - Extreme Left */}
          <div className="flex-none">
            <Link to="/" className="flex items-center">
              <div className="bg-white p-2 rounded-lg">
                <svg 
                  viewBox="0 0 24 24" 
                  className="h-6 w-6 text-indigo-600"
                  fill="currentColor"
                >
                  <path d="M12 3L4 9v12h16V9l-8-6zm0-2l10 7.5v14.5H2V8.5L12 1z"/>
                </svg>
              </div>
              <span className="ml-3 text-xl font-bold text-white">JAGOINVESTOR</span>
            </Link>
          </div>

          {/* Main Navigation Items - Centered */}
          <div className="flex items-center justify-center space-x-8 flex-1 px-32">
            {/* Portfolio */}
            <Link to="/portfolio" className="flex items-center space-x-2 text-white hover:text-indigo-200 transition-colors group">
              <div className="bg-indigo-400 bg-opacity-20 p-2 rounded-full group-hover:bg-opacity-30 transition-all">
                <Briefcase size={18} />
              </div>
              <span className="font-medium">Portfolio</span>
            </Link>

            {/* Mutual Fund/SIP */}
            <Link to="/mutual-funds" className="flex items-center space-x-2 text-white hover:text-indigo-200 transition-colors group">
              <div className="bg-indigo-400 bg-opacity-20 p-2 rounded-full group-hover:bg-opacity-30 transition-all">
                <PieChart size={18} />
              </div>
              <span className="font-medium">Mutual Fund/SIP</span>
            </Link>

            {/* Stock */}
            <Link to="/stocks" className="flex items-center space-x-2 text-white hover:text-indigo-200 transition-colors group">
              <div className="bg-indigo-400 bg-opacity-20 p-2 rounded-full group-hover:bg-opacity-30 transition-all">
                <LineChart size={18} />
              </div>
              <span className="font-medium">Stock</span>
            </Link>

            {/* Investment Guidelines */}
            <Link to="/guidelines" className="flex items-center space-x-2 text-white hover:text-indigo-200 transition-colors group">
              <div className="bg-indigo-400 bg-opacity-20 p-2 rounded-full group-hover:bg-opacity-30 transition-all">
                <BookOpen size={18} />
              </div>
              <span className="font-medium">Investment Guidelines</span>
            </Link>
          </div>

          {/* Right Side Items - Search and Sign In */}
          <div className="flex items-center space-x-4 flex-none">
            {/* Search Bar */}
            <div className="relative">
              <input
                type="text"
                placeholder="Search..."
                className="w-72 px-4 py-2 text-sm bg-indigo-400 bg-opacity-20 rounded-full text-white placeholder-indigo-200 focus:outline-none focus:ring-2 focus:ring-white focus:bg-opacity-30"
              />
              <Search className="absolute right-3 top-2 h-4 w-4 text-indigo-200" />
            </div>

            {/* Sign In Button */}
            <button className="flex items-center space-x-2 bg-white px-6 py-2 rounded-full text-indigo-600 hover:bg-indigo-50 transition-colors font-medium">
              <LogIn size={18} />
              <span>Sign In</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};


const HomePage = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      {/* Main Content */}
      <main className="pt-24 pb-16 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <h1 className="text-4xl font-bold text-blue-900 mb-8">
              The right way to approach investing
            </h1>
          </div>

          {/* Investment Approach Cards */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {/* Card 1 - Set Goals */}
            <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300">
              <div className="flex items-start space-x-4">
                <div className="p-3 bg-indigo-50 rounded-lg">
                  <ClipboardCheck className="w-8 h-8 text-indigo-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-blue-900">Set goals and create a Financial Plan</h3>
                  <p className="mt-2 text-gray-600">Create a personalized plan to achieve your financial objectives</p>
                </div>
              </div>
            </div>

            {/* Card 2 - Invest in Stocks */}
            <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300">
              <div className="flex items-start space-x-4">
                <div className="p-3 bg-indigo-50 rounded-lg">
                  <LineChart className="w-8 h-8 text-indigo-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-blue-900">Invest in Stocks and Mutual Funds</h3>
                  <p className="mt-2 text-gray-600">Build a diversified portfolio with expert guidance</p>
                </div>
              </div>
            </div>

            {/* Card 3 - Manage Portfolio */}
            <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300">
              <div className="flex items-start space-x-4">
                <div className="p-3 bg-indigo-50 rounded-lg">
                  <Briefcase className="w-8 h-8 text-indigo-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-blue-900">Manage your Portfolio</h3>
                  <p className="mt-2 text-gray-600">Track and optimize your investments for financial freedom</p>
                </div>
              </div>
            </div>

            {/* Card 4 - Discard Habits */}
            <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300">
              <div className="flex items-start space-x-4">
                <div className="p-3 bg-indigo-50 rounded-lg">
                  <svg className="w-8 h-8 text-indigo-600" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-blue-900">Discard unproductive investing habits</h3>
                  <p className="mt-2 text-gray-600">Learn to avoid common investment mistakes and pitfalls</p>
                </div>
              </div>
            </div>

            {/* Card 5 - Investment Advisor */}
            <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300">
              <div className="flex items-start space-x-4">
                <div className="p-3 bg-indigo-50 rounded-lg">
                  <UserCheck className="w-8 h-8 text-indigo-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-blue-900">Collaborate with a Dedicated Investment Advisor</h3>
                  <p className="mt-2 text-gray-600">Get personalized guidance from experienced professionals</p>
                </div>
              </div>
            </div>
          </div>

          {/* Call to Action Section */}
          <div className="bg-blue-50 rounded-lg p-8 text-center">
            <div className="max-w-2xl mx-auto">
              <h2 className="text-2xl font-semibold text-blue-900 mb-4">Did you know?</h2>
              <p className="text-gray-700 mb-6">Just setting your goals can increase your chances of achieving it by 33%.</p>
              <button className="bg-gradient-to-r from-indigo-600 to-blue-500 text-white px-8 py-3 rounded-full hover:opacity-90 transition-all duration-300">
                Make a Financial Plan
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Add the chatbot component */}
      <FinancialChatbot />
    </div>
  );
};

export default HomePage;