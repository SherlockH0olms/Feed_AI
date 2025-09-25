import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Question } from '../types';
import FormBuilder from '../components/FormBuilder';

interface CreateFormPageProps {
  onCreateForm: (form: Omit<Form, 'id' | 'createdAt' | 'responses'>) => void;
}

const CreateFormPage: React.FC<CreateFormPageProps> = ({ onCreateForm }) => {
  const navigate = useNavigate();

  const handleSave = (title: string, description: string, questions: Question[]) => {
    const newForm = {
      title,
      description,
      questions,
      isActive: true
    };

    onCreateForm(newForm);
    navigate('/');
  };

  return (
    <div className="max-w-4xl mx-auto py-8">
      <FormBuilder onSave={handleSave} />
    </div>
  );
};

export default CreateFormPage;