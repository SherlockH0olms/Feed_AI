import React, { useState } from 'react';
import { Form, FormResponse } from '../types';
import { Send, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';

interface FormSubmissionProps {
  form: Form;
  onSubmit: (response: Omit<FormResponse, 'id' | 'submittedAt'>) => void;
}

const FormSubmission: React.FC<FormSubmissionProps> = ({ form, onSubmit }) => {
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleAnswerChange = (questionId: string, answer: string | string[]) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate required questions
    const missingRequired = form.questions
      .filter(q => q.required)
      .find(q => !answers[q.id] || (Array.isArray(answers[q.id]) && (answers[q.id] as string[]).length === 0));

    if (missingRequired) {
      toast.error('Please answer all required questions');
      return;
    }

    const response = {
      formId: form.id,
      answers
    };

    onSubmit(response);
    setIsSubmitted(true);
    toast.success('Response submitted successfully!');
  };

  if (!form.isActive) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
          <h2 className="text-xl font-semibold text-yellow-800 mb-2">Form Closed</h2>
          <p className="text-yellow-700">This form is no longer accepting responses.</p>
        </div>
      </div>
    );
  }

  if (isSubmitted) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-green-50 border border-green-200 rounded-lg p-8 text-center">
          <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-green-800 mb-2">Thank You!</h2>
          <p className="text-green-700">Your response has been submitted successfully.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">{form.title}</h1>
        {form.description && (
          <p className="text-gray-600 mb-6">{form.description}</p>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {form.questions.map((question) => (
            <div key={question.id} className="border-b border-gray-200 pb-6 last:border-b-0">
              <label className="block text-sm font-medium text-gray-900 mb-3">
                {question.question}
                {question.required && <span className="text-red-500 ml-1">*</span>}
              </label>
              
              {question.type === 'multiple-choice' && question.options ? (
                <div className="space-y-2">
                  {question.options.map((option, index) => (
                    <label key={index} className="flex items-center">
                      <input
                        type="radio"
                        name={question.id}
                        value={option}
                        onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                      />
                      <span className="ml-2 text-sm text-gray-700">{option}</span>
                    </label>
                  ))}
                </div>
              ) : (
                <textarea
                  rows={4}
                  value={answers[question.id] as string || ''}
                  onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Type your answer here..."
                />
              )}
            </div>
          ))}
          
          <div className="flex justify-end pt-6">
            <button
              type="submit"
              className="flex items-center space-x-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-medium transition-colors"
            >
              <Send className="h-5 w-5" />
              <span>Submit Response</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FormSubmission;