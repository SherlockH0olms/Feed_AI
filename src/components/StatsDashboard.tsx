import React from 'react';
import { Form } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Users, MessageSquare, BarChart3, Clock } from 'lucide-react';

interface StatsDashboardProps {
  form: Form;
}

const COLORS = ['#3B82F6', '#8B5CF6', '#10B981', '#F59E0B', '#EF4444', '#6B7280'];

const StatsDashboard: React.FC<StatsDashboardProps> = ({ form }) => {
  const totalResponses = form.responses.length;

  const getQuestionStats = (questionId: string) => {
    const question = form.questions.find(q => q.id === questionId);
    if (!question) return null;

    if (question.type === 'multiple-choice' && question.options) {
      const responses = form.responses.map(r => r.answers[questionId]).filter(Boolean) as string[];
      const stats = question.options.map(option => ({
        name: option,
        value: responses.filter(r => r === option).length,
        percentage: responses.length > 0 ? Math.round((responses.filter(r => r === option).length / responses.length) * 100) : 0
      }));
      return { type: 'chart', data: stats };
    } else {
      const responses = form.responses.map(r => r.answers[questionId]).filter(Boolean) as string[];
      return { type: 'text', data: responses };
    }
  };

  const recentResponses = form.responses
    .sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime())
    .slice(0, 5);

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Responses</p>
              <p className="text-2xl font-bold text-gray-900">{totalResponses}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-purple-100">
              <MessageSquare className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Questions</p>
              <p className="text-2xl font-bold text-gray-900">{form.questions.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100">
              <BarChart3 className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Completion Rate</p>
              <p className="text-2xl font-bold text-gray-900">
                {totalResponses > 0 ? '100%' : '0%'}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-yellow-100">
              <Clock className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Status</p>
              <p className="text-2xl font-bold text-gray-900">
                {form.isActive ? 'Active' : 'Closed'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Question Statistics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {form.questions.map((question) => {
          const stats = getQuestionStats(question.id);
          if (!stats) return null;

          return (
            <div key={question.id} className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                {question.question}
              </h3>
              
              {stats.type === 'chart' && stats.data.length > 0 ? (
                <div className="space-y-4">
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={stats.data}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis 
                          dataKey="name" 
                          tick={{ fontSize: 12 }}
                          interval={0}
                          angle={-45}
                          textAnchor="end"
                          height={100}
                        />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="value" fill="#3B82F6" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {stats.data.map((item, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                        <span className="text-sm text-gray-700">{item.name}</span>
                        <span className="text-sm font-semibold text-gray-900">
                          {item.value} ({item.percentage}%)
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : stats.type === 'text' && stats.data.length > 0 ? (
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {(stats.data as string[]).map((response, index) => (
                    <div key={index} className="p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-700">{response}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  No responses yet
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Recent Responses */}
      {recentResponses.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Responses</h3>
          <div className="space-y-3">
            {recentResponses.map((response, index) => (
              <div key={response.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm font-medium text-gray-700">
                  Response #{totalResponses - index}
                </span>
                <span className="text-sm text-gray-500">
                  {new Date(response.submittedAt).toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default StatsDashboard;