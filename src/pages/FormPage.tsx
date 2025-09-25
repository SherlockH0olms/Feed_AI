import React from 'react';
import { useParams } from 'react-router-dom';
import { Form, FormResponse } from '../types';
import FormSubmission from '../components/FormSubmission';

interface FormPageProps {
  forms: Form[];
  onSubmitResponse: (response: Omit<FormResponse, 'id' | 'submittedAt'>) => void;
}

const FormPage: React.FC<FormPageProps> = ({ forms, onSubmitResponse }) => {
  const { id } = useParams<{ id: string }>();
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

  return (
    <div className="py-8">
      <FormSubmission form={form} onSubmit={onSubmitResponse} />
    </div>
  );
};

export default FormPage;