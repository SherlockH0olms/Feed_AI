import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Form } from '../types';
import StatsDashboard from '../components/StatsDashboard';
import AIInsights from '../components/AIInsights';
import QRCodeDisplay from '../components/QRCodeDisplay';
import { ArrowLeft, BarChart3, Brain, QrCode, Settings } from 'lucide-react';
import toast from 'react-hot-toast';

interface DashboardPageProps {
  forms: Form[];
  onToggleFormStatus: (formId: string) => void;
}

const DashboardPage: React.FC<DashboardPageProps> = ({ forms, onToggleFormStatus }) => {
  const { id } = useParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState<'stats' | 'insights' | 'share'>('stats');
  
  const form = forms.find(f => f.id === id);

  if (!form) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <h2 className="text-xl font-semibold text-red-800 mb-2">Form Not Found</h2>
          <p className="text-red-700">The form you're looking for doesn't exist or has been removed.</p>
        </div>
      </div>
    );
  }

  const handleToggleStatus = () => {
    onToggleFormStatus(form.id);
    toast.success(form.isActive ? 'Form closed successfully' : 'Form reopened successfully');
  };

  const tabs = [
    { id: 'stats', label: 'Statistics', icon: BarChart3 },
    { id: 'insights', label: 'AI Insights', icon: Brain },
    { id: 'share', label: 'Share & QR', icon: QrCode },
  ];

  return (
    <div className="max-w-7xl mx-auto py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <Link
            to="/"
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Back to Forms</span>
          </Link>
          
          <button
            onClick={handleToggleStatus}
            className={`flex items-center space-x-2 px-4 py-2 rounded-md font-medium transition-colors ${
              form.isActive
                ? 'bg-red-100 text-red-700 hover:bg-red-200'
                : 'bg-green-100 text-green-700 hover:bg-green-200'
            }`}
          >
            <Settings className="h-4 w-4" />
            <span>{form.isActive ? 'Close Form' : 'Reopen Form'}</span>
          </button>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{form.title}</h1>
          {form.description && (
            <p className="text-gray-600 mb-4">{form.description}</p>
          )}
          
          <div className="flex items-center space-x-6 text-sm text-gray-600">
            <span className="flex items-center">
              <span className="font-medium">{form.responses.length}</span>
              <span className="ml-1">responses</span>
            </span>
            <span className="flex items-center">
              <span className="font-medium">{form.questions.length}</span>
              <span className="ml-1">questions</span>
            </span>
            <span className={`px-2 py-1 text-xs font-medium rounded-full ${
              form.isActive 
                ? 'bg-green-100 text-green-800' 
                : 'bg-red-100 text-red-800'
            }`}>
              {form.isActive ? 'Active' : 'Closed'}
            </span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-8">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as typeof activeTab)}
                  className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === 'stats' && <StatsDashboard form={form} />}
      {activeTab === 'insights' && <AIInsights form={form} />}
      {activeTab === 'share' && (
        <div className="max-w-2xl mx-auto">
          <QRCodeDisplay
            url={`${window.location.origin}/form/${form.id}`}
            title={`Share "${form.title}"`}
          />
          {!form.isActive && (
            <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-yellow-800 text-center">
                <strong>Note:</strong> This form is currently closed and not accepting responses.
                Reopen it to start collecting responses again.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DashboardPage;