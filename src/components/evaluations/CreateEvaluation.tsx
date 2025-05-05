// src/components/evaluations/CreateEvaluation.tsx
import React, { useState } from 'react';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
import { Select } from '../common/Select';
import { v4 as uuidv4 } from 'uuid';

// Types
export type QuestionType = 'qcm' | 'redaction' | 'vrai_faux';

export interface Option {
  id: string;
  text: string;
  isCorrect: boolean;
}

export interface Question {
  id: string;
  text: string;
  type: QuestionType;
  options: Option[];
  points: number;
}

export interface Evaluation {
  id: string;
  titre: string;
  description: string;
  type: QuestionType;
  dateLimit: string;
  questions: Question[];
  createdAt: string;
}

interface CreateEvaluationProps {
  onSubmit: (evaluation: Omit<Evaluation, 'id' | 'createdAt'>) => void;
}

export const CreateEvaluation: React.FC<CreateEvaluationProps> = ({ onSubmit }) => {
  const [formData, setFormData] = useState<Omit<Evaluation, 'id' | 'createdAt'>>({
    titre: '',
    description: '',
    type: 'qcm',
    dateLimit: '',
    questions: []
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showQuestionForm, setShowQuestionForm] = useState<boolean>(false);
  
  // État pour la gestion des questions en cours d'édition
  const [currentQuestion, setCurrentQuestion] = useState<Question>({
    id: uuidv4(),
    text: '',
    type: 'qcm',
    options: [],
    points: 1
  });
  
  // État pour la nouvelle option en cours d'ajout
  const [newOption, setNewOption] = useState<string>('');
  const [editingQuestionIndex, setEditingQuestionIndex] = useState<number | null>(null);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.titre.trim()) {
      newErrors.titre = 'Le titre est requis';
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'La description est requise';
    }
    
    if (!formData.dateLimit) {
      newErrors.dateLimit = 'La date limite est requise';
    }
    
    if (formData.questions.length === 0) {
      newErrors.questions = 'Au moins une question est requise';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateQuestion = (): Record<string, string> => {
    const questionErrors: Record<string, string> = {};
    
    if (!currentQuestion.text.trim()) {
      questionErrors.text = 'Le texte de la question est requis';
    }
    
    if (currentQuestion.type === 'qcm' && currentQuestion.options.length < 2) {
      questionErrors.options = 'Au moins deux options sont requises pour un QCM';
    }
    
    if ((currentQuestion.type === 'qcm' || currentQuestion.type === 'vrai_faux') && 
        !currentQuestion.options.some(opt => opt.isCorrect)) {
      questionErrors.correctOption = 'Veuillez sélectionner au moins une option correcte';
    }
    
    return questionErrors;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Si le formulaire de question est ouvert, vérifier s'il y a des modifications non sauvegardées
    if (showQuestionForm && currentQuestion.text.trim()) {
      if (window.confirm('Vous avez une question non enregistrée. Voulez-vous la sauvegarder avant de soumettre ?')) {
        addQuestion();
      }
    }
    
    if (validateForm()) {
      onSubmit(formData);
      
      // Réinitialiser le formulaire
      setFormData({
        titre: '',
        description: '',
        type: 'qcm',
        dateLimit: '',
        questions: []
      });
      resetQuestionForm();
    }
  };

  const handleChange = <K extends keyof typeof formData>(key: K, value: typeof formData[K]) => {
    setFormData(prev => ({ ...prev, [key]: value }));
    
    // Effacer l'erreur si elle existe
    if (errors[key as string]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[key as string];
        return newErrors;
      });
    }
  };
  
  const handleQuestionChange = <K extends keyof typeof currentQuestion>(
    key: K, 
    value: typeof currentQuestion[K]
  ) => {
    setCurrentQuestion(prev => {
      let updatedQuestion = { ...prev, [key]: value };
      
      // Si le type change, réinitialiser les options au besoin
      if (key === 'type') {
        const newType = value as QuestionType;
        if (newType === 'vrai_faux') {
          updatedQuestion.options = [
            { id: uuidv4(), text: 'Vrai', isCorrect: false },
            { id: uuidv4(), text: 'Faux', isCorrect: false }
          ];
        } else if (newType === 'redaction') {
          updatedQuestion.options = [];
        }
      }
      
      return updatedQuestion;
    });
  };

  const addOption = () => {
    if (!newOption.trim()) return;
    
    const option: Option = {
      id: uuidv4(),
      text: newOption,
      isCorrect: false
    };
    
    setCurrentQuestion(prev => ({
      ...prev,
      options: [...prev.options, option]
    }));
    
    setNewOption('');
  };

  const toggleCorrectOption = (optionId: string) => {
    setCurrentQuestion(prev => {
      const updatedOptions = prev.options.map(opt => {
        if (prev.type === 'qcm') {
          // Pour QCM, plusieurs réponses peuvent être correctes
          if (opt.id === optionId) {
            return { ...opt, isCorrect: !opt.isCorrect };
          }
          return opt;
        } else {
          // Pour Vrai/Faux, une seule réponse peut être correcte
          if (opt.id === optionId) {
            return { ...opt, isCorrect: true };
          }
          return { ...opt, isCorrect: false };
        }
      });
      
      return { ...prev, options: updatedOptions };
    });
  };

  const removeOption = (optionId: string) => {
    setCurrentQuestion(prev => ({
      ...prev,
      options: prev.options.filter(opt => opt.id !== optionId)
    }));
  };

  const addQuestion = () => {
    const questionErrors = validateQuestion();
    if (Object.keys(questionErrors).length > 0) {
      setErrors({ ...errors, ...questionErrors });
      return;
    }
    
    if (editingQuestionIndex !== null) {
      // Mode édition
      const updatedQuestions = [...formData.questions];
      updatedQuestions[editingQuestionIndex] = currentQuestion;
      handleChange('questions', updatedQuestions);
      setEditingQuestionIndex(null);
    } else {
      // Mode ajout
      handleChange('questions', [...formData.questions, {...currentQuestion, id: uuidv4()}]);
    }
    
    resetQuestionForm();
    // Maintenir le formulaire ouvert pour faciliter l'ajout de plusieurs questions
    if (showQuestionForm) {
      setCurrentQuestion({
        id: uuidv4(),
        text: '',
        type: formData.type, // Conserver le même type pour plus de rapidité
        options: [],
        points: 1
      });
    }
  };

  const editQuestion = (index: number) => {
    setCurrentQuestion({...formData.questions[index]});
    setEditingQuestionIndex(index);
    setShowQuestionForm(true);
    
    // Scroll jusqu'au formulaire de questions
    setTimeout(() => {
      document.getElementById('question-form')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const deleteQuestion = (index: number) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette question ?')) {
      const updatedQuestions = [...formData.questions];
      updatedQuestions.splice(index, 1);
      handleChange('questions', updatedQuestions);
    }
  };

  const resetQuestionForm = () => {
    setCurrentQuestion({
      id: uuidv4(),
      text: '',
      type: formData.type,
      options: [],
      points: 1
    });
    setEditingQuestionIndex(null);
    setNewOption('');
    setShowQuestionForm(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    // Ajout d'option avec la touche Enter
    if (e.key === 'Enter' && newOption.trim()) {
      e.preventDefault();
      addOption();
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-xl font-bold mb-4">Créer une nouvelle évaluation</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <Input 
            label="Titre"
            value={formData.titre}
            onChange={e => handleChange('titre', e.target.value)}
            placeholder="Titre de l'évaluation"
            error={errors.titre}
          />
          
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-2">Description</label>
            <textarea 
              className={`w-full border ${errors.description ? 'border-red-500' : 'border-gray-300'} rounded px-3 py-2`}
              value={formData.description}
              onChange={e => handleChange('description', e.target.value)}
              placeholder="Description de l'évaluation"
              rows={3}
            />
            {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
          </div>
          
          <Select 
            label="Type d'évaluation par défaut"
            options={[
              { value: 'qcm', label: 'QCM' },
              { value: 'redaction', label: 'Rédaction' },
              { value: 'vrai_faux', label: 'Vrai/Faux' }
            ]}
            value={formData.type}
            onChange={(value) => handleChange('type', value as QuestionType)}
          />
          
          <Input 
            label="Date limite"
            type="date"
            value={formData.dateLimit}
            onChange={e => handleChange('dateLimit', e.target.value)}
            error={errors.dateLimit}
          />
        </div>
        
        <div className="border-t pt-6" id="question-section">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-lg">Questions ({formData.questions.length})</h3>
            <Button 
              type="button" 
              variant={showQuestionForm ? "secondary" : "primary"}
              onClick={() => setShowQuestionForm(!showQuestionForm)}
            >
              {showQuestionForm ? "Masquer le formulaire" : "Ajouter une question"}
            </Button>
          </div>
          
          {errors.questions && (
            <div className="bg-red-50 border border-red-300 text-red-700 px-4 py-2 rounded mb-4">
              {errors.questions}
            </div>
          )}
          
          {/* Formulaire d'ajout/modification de question */}
          {showQuestionForm && (
            <div id="question-form" className="space-y-4 bg-gray-50 p-4 rounded-lg border mb-6">
              <h4 className="font-semibold">
                {editingQuestionIndex !== null ? `Modifier la question ${editingQuestionIndex + 1}` : 'Nouvelle question'}
              </h4>
              
              <Input 
                label="Question"
                value={currentQuestion.text}
                onChange={e => handleQuestionChange('text', e.target.value)}
                placeholder="Texte de la question"
                error={errors.text}
              />
              
              <div className="flex space-x-4">
                <Select 
                  label="Type de question"
                  options={[
                    { value: 'qcm', label: 'QCM' },
                    { value: 'redaction', label: 'Rédaction' },
                    { value: 'vrai_faux', label: 'Vrai/Faux' }
                  ]}
                  value={currentQuestion.type}
                  onChange={(value) => handleQuestionChange('type', value as QuestionType)}
                />
                
                <div className="w-1/4">
                  <label className="block text-gray-700 font-semibold mb-2">Points</label>
                  <input 
                    type="number" 
                    min="1" 
                    className="w-full border border-gray-300 rounded px-3 py-2"
                    value={currentQuestion.points}
                    onChange={e => handleQuestionChange('points', parseInt(e.target.value) || 1)}
                  />
                </div>
              </div>
              
              {(currentQuestion.type === 'qcm' || currentQuestion.type === 'vrai_faux') && (
                <div className="mt-4">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="font-medium">Options de réponse</h4>
                    
                    {currentQuestion.type === 'qcm' && (
                      <div className="text-sm text-gray-500">
                        {currentQuestion.options.filter(o => o.isCorrect).length} option(s) correcte(s)
                      </div>
                    )}
                  </div>
                  
                  {errors.options && <p className="text-red-500 text-sm mb-2">{errors.options}</p>}
                  {errors.correctOption && <p className="text-red-500 text-sm mb-2">{errors.correctOption}</p>}
                  
                  <div className="space-y-2 mb-4">
                    {currentQuestion.options.map(option => (
                      <div key={option.id} className="flex items-center space-x-2 bg-white p-2 rounded border">
                        <input 
                          type={currentQuestion.type === 'qcm' ? 'checkbox' : 'radio'} 
                          checked={option.isCorrect}
                          onChange={() => toggleCorrectOption(option.id)}
                          id={`option-${option.id}`}
                          className="h-5 w-5"
                        />
                        <label htmlFor={`option-${option.id}`} className="flex-grow">
                          {option.text}
                          {option.isCorrect && (
                            <span className="ml-2 text-green-600 text-sm">(Correcte)</span>
                          )}
                        </label>
                        {currentQuestion.type === 'qcm' && (
                          <button 
                            type="button" 
                            className="text-red-600 hover:text-red-800"
                            onClick={() => removeOption(option.id)}
                          >
                            Supprimer
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                  
                  {currentQuestion.type === 'qcm' && (
                    <div className="flex space-x-2">
                      <input 
                        type="text" 
                        className="flex-grow border border-gray-300 rounded px-3 py-2"
                        value={newOption}
                        onChange={e => setNewOption(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Nouvelle option (Appuyer sur Entrée pour ajouter)"
                      />
                      <Button 
                        type="button" 
                        variant="secondary" 
                        onClick={addOption}
                      >
                        Ajouter
                      </Button>
                    </div>
                  )}
                </div>
              )}
              
              <div className="flex justify-end space-x-2 mt-4">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={resetQuestionForm}
                >
                  Annuler
                </Button>
                <Button 
                  type="button" 
                  variant="primary" 
                  onClick={addQuestion}
                >
                  {editingQuestionIndex !== null ? 'Mettre à jour' : 'Ajouter'} la question
                </Button>
              </div>
            </div>
          )}
          
          {/* Liste des questions ajoutées */}
          {formData.questions.length === 0 ? (
            <div className="text-center py-8 bg-gray-50 rounded border border-dashed border-gray-300">
              <p className="text-gray-500">Aucune question ajoutée</p>
              <Button 
                type="button" 
                variant="secondary"
                className="mt-2" 
                onClick={() => setShowQuestionForm(true)}
              >
                Ajouter votre première question
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {formData.questions.map((question, index) => (
                <div key={question.id} className="p-4 border rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                  <div className="flex justify-between items-start mb-3">
                    <h4 className="font-semibold text-lg">
                      <span className="inline-block bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm mr-2">
                        #{index + 1}
                      </span>
                      {question.text}
                    </h4>
                    <div className="flex space-x-2">
                      <button 
                        type="button"
                        className="text-blue-600 hover:text-blue-800"
                        onClick={() => editQuestion(index)}
                      >
                        Modifier
                      </button>
                      <button 
                        type="button"
                        className="text-red-600 hover:text-red-800"
                        onClick={() => deleteQuestion(index)}
                      >
                        Supprimer
                      </button>
                    </div>
                  </div>
                  <div className="flex items-center mb-2 text-sm text-gray-600">
                    <span className={`px-2 py-1 rounded mr-2 ${
                      question.type === 'qcm' ? 'bg-purple-100 text-purple-800' : 
                      question.type === 'redaction' ? 'bg-yellow-100 text-yellow-800' : 
                      'bg-green-100 text-green-800'
                    }`}>
                      {question.type === 'qcm' ? 'QCM' : 
                       question.type === 'redaction' ? 'Rédaction' : 'Vrai/Faux'}
                    </span>
                    <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded">
                      {question.points} point{question.points > 1 ? 's' : ''}
                    </span>
                  </div>
                  
                  {(question.type === 'qcm' || question.type === 'vrai_faux') && (
                    <div className="mt-2 pl-4 border-l-2 border-gray-200">
                      <p className="text-sm font-medium mb-1">Options:</p>
                      <ul className="space-y-1">
                        {question.options.map(option => (
                          <li 
                            key={option.id} 
                            className={`text-sm ${option.isCorrect ? 'font-medium text-green-600' : ''}`}
                          >
                            {option.isCorrect ? '✓ ' : '○ '}{option.text}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
              
              {/* Bouton pour ajouter une nouvelle question après la liste */}
              {!showQuestionForm && (
                <div className="flex justify-center mt-4">
                  <Button 
                    type="button" 
                    variant="secondary"
                    onClick={() => setShowQuestionForm(true)}
                  >
                    Ajouter une autre question
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
        
        <div className="mt-8 pt-4 border-t flex justify-between items-center">
          <div>
            {formData.questions.length > 0 && (
              <p className="text-gray-600">
                {formData.questions.length} question{formData.questions.length > 1 ? 's' : ''} - 
                Total: {formData.questions.reduce((sum, q) => sum + q.points, 0)} points
              </p>
            )}
          </div>
          <Button type="submit" variant="primary" size="lg">
            Créer l'évaluation
          </Button>
        </div>
      </form>
    </div>
  );
};