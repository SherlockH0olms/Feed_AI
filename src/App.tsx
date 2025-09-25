import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { Form, FormResponse } from './types';
import { useLocalStorage } from './hooks/useLocalStorage';
import Navigation from './components/Navigation';
import HomePage from './pages/HomePage';
import CreateFormPage from './pages/CreateFormPage';
import FormPage from './pages/FormPage';
import DashboardPage from './pages/DashboardPage';

function App() {
  const [forms, setForms] = useLocalStorage<Form[]>('forms', []);

  const createForm = (formData: Omit<Form, 'id' | 'createdAt' | 'responses'>) => {
    const newForm: Form = {
      ...formData,
      id: crypto.randomUUID(),
      createdAt: new Date(),
      responses: []
    };
    setForms(prev => [...prev, newForm]);
  };

  const submitResponse = (responseData: Omit<FormResponse, 'id' | 'submittedAt'>) => {
    const response: FormResponse = {
      ...responseData,
      id: crypto.randomUUID(),
      submittedAt: new Date()
    };

    setForms(prev => prev.map(form => 
      form.id === response.formId
        ? { ...form, responses: [...form.responses, response] }
        : form
    ));
  };

  const toggleFormStatus = (formId: string) => {
    setForms(prev => prev.map(form => 
      form.id === formId
        ? { ...form, isActive: !form.isActive }
        : form
    ));
  };

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        
        <main className="py-8 px-4 sm:px-6 lg:px-8">
          <Routes>
            <Route 
              path="/" 
              element={
                <HomePage 
                  forms={forms} 
                  onToggleFormStatus={toggleFormStatus}
                />
              } 
            />
            <Route 
              path="/create" 
              element={<CreateFormPage onCreateForm={createForm} />} 
            />
            <Route 
              path="/form/:id" 
              element={
                <FormPage 
                  forms={forms} 
                  onSubmitResponse={submitResponse}
                />
              } 
            />
            <Route 
              path="/dashboard/:id" 
              element={
                <DashboardPage 
                  forms={forms}
                  onToggleFormStatus={toggleFormStatus}
                />
              } 
            />
          </Routes>
        </main>
        
        <Toaster 
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: '#363636',
              color: '#fff',
            },
          }}
        />
      </div>
    </Router>
  );
}

export default App;