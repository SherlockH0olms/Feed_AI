import React from 'react';
import { Link } from 'react-router-dom';
import { Form } from '../types';
import { PlusCircle, BarChart3, Eye, Settings, Users } from 'lucide-react';
import QRCodeDisplay from '../components/QRCodeDisplay';

interface HomePageProps {
  forms: Form[];
  onToggleFormStatus: (formId: string) => void;
}

const HomePage: React.FC<HomePageProps> = ({ forms, onToggleFormStatus }) => {
  return (
    <div className="max-w-7xl mx-auto">
      {/* Hero Section */}
      <div className="text-center py-12 mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          FormInsight
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Create anonymous forms, collect responses, and get AI-powered insights in real-time. 
          Perfect for hackathons, surveys, and market research.
        </p>
        
        <Link
          to="/create"
          className="inline-flex items-center space-x-2 px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold text-lg transition-colors shadow-lg hover:shadow-xl"
        >
          <PlusCircle className="h-6 w-6" />
          <span>Create Your First Form</span>
        </Link>
      </div>

      {/* Features Grid */}
      {forms.length === 0 && (
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          <div className="text-center p-6 bg-white rounded-lg shadow-md">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="h-8 w-8 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Anonymous Collection</h3>
            <p className="text-gray-600">
              Collect honest responses with complete anonymity and privacy protection
            </p>
          </div>
          
          <div className="text-center p-6 bg-white rounded-lg shadow-md">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <BarChart3 className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Real-time Analytics</h3>
            <p className="text-gray-600">
              Watch responses come in live with interactive charts and statistics
            </p>
          </div>
          
          <div className="text-center p-6 bg-white rounded-lg shadow-md">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <BarChart3 className="h-8 w-8 text-purple-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">AI Insights</h3>
            <p className="text-gray-600">
              Get intelligent analysis and actionable recommendations from your data
            </p>
          </div>
        </div>
      )}

      {/* Forms List */}
      {forms.length > 0 && (
        <div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Your Forms</h2>
            <Link
              to="/create"
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-medium transition-colors"
            >
              <PlusCircle className="h-5 w-5" />
              <span>New Form</span>
            </Link>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {forms.map((form) => (
              <div key={form.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="p-6">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-lg font-semibold text-gray-900 truncate">
                      {form.title}
                    </h3>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      form.isActive 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {form.isActive ? 'Active' : 'Closed'}
                    </span>
                  </div>
                  
                  {form.description && (
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {form.description}
                    </p>
                  )}
                  
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <span>{form.questions.length} questions</span>
                    <span>{form.responses.length} responses</span>
                  </div>
                  
                  <div className="flex space-x-2">
                    <Link
                      to={`/form/${form.id}`}
                      className="flex items-center space-x-1 px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md text-sm font-medium transition-colors flex-1 justify-center"
                    >
                      <Eye className="h-4 w-4" />
                      <span>View</span>
                    </Link>
                    
                    <Link
                      to={`/dashboard/${form.id}`}
                      className="flex items-center space-x-1 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm font-medium transition-colors flex-1 justify-center"
                    >
                      <BarChart3 className="h-4 w-4" />
                      <span>Stats</span>
                    </Link>
                    
                    <button
                      onClick={() => onToggleFormStatus(form.id)}
                      className="flex items-center space-x-1 px-3 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-md text-sm font-medium transition-colors"
                    >
                      <Settings className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* QR Code Demo */}
      {forms.length > 0 && forms.find(f => f.isActive) && (
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            Share Your Active Forms
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {forms.filter(f => f.isActive).map((form) => (
              <QRCodeDisplay
                key={form.id}
                url={`${window.location.origin}/form/${form.id}`}
                title={form.title}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default HomePage;