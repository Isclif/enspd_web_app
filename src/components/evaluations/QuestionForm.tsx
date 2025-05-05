// src/components/evaluations/QuestionForm.tsx
import React, { useState, useEffect } from 'react';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
import { Select } from '../common/Select';
import { Question, QuestionType, Option } from '../../types/evaluations';
import { v4 as uuidv4 } from 'uuid';

interface QuestionFormProps {
  question: Question;
  evaluationType: QuestionType;
  onSave: (question: Question) => void;
  onCancel: () => void;
}

export const QuestionForm: React.FC<QuestionFormProps> = ({ 
  question, 
  evaluationType,
  onSave, 
  onCancel 
}) => {
  const [formData, setFormData] = useState<Question>(question);
  const [newOption, setNewOption] = useState<string>('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Mettre à jour le type de question si le type d'évaluation change
  useEffect(() => {
    setFormData(prev => ({
      ...prev,
      type: evaluationType
    }));
  }, [evaluationType]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.text.trim()) {
      newErrors.text = 'Le texte de la question est requis';
    }
    
    if ((formData.type === 'qcm' || formData.type === 'vrai_faux') && formData.options?.length < 2) {
      newErrors.options = 'Au moins deux options sont requises';
    }

    if (formData.type === 'qcm' && !formData.options?.some(opt => opt.isCorrect)) {
      newErrors.correctOption = 'Au moins une option correcte est requise';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSave(formData);
    }
  };

  const handleChange = <K extends keyof Question>(key: K, value: Question[K]) => {
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

  const handleAddOption = () => {
    if (!newOption.trim()) return;
    
    const option: Option = {
      id: uuidv4(),
      text: newOption,
      isCorrect: false
    };
    
    const updatedOptions = [...(formData.options || []), option];
    handleChange('options', updatedOptions);
    setNewOption('');
  };

  const handleRemoveOption = (id: string) => {
    const updatedOptions = formData.options?.filter(opt => opt.id !== id) || [];
    handleChange('options', updatedOptions);
  };

  const handleToggleCorrect = (id: string) => {
    const updatedOptions = formData.options?.map(opt => {
      if (opt.id === id) {
        return { ...opt, isCorrect: !opt.isCorrect };
      }
      // Si c'est une question vrai/faux, désélectionner les autres options
      if (formData.type === 'vrai_faux') {
        return { ...opt, isCorrect: opt.id === id };
      }
      return opt;
    }) || [];
    
    handleChange('options', updatedOptions);
  };

  // Préparer les options par défaut pour les questions de type vrai/faux
  useEffect(() => {
    if (formData.type === 'vrai_faux' && (!formData.options || formData.options.length === 0)) {
      handleChange('options', [
        { id: uuidv4(), text: 'Vrai', isCorrect: false },
        { id: uuidv4(), text: 'Faux', isCorrect: false }
      ]);
    }
  }, [formData.type]);

  return (
    <div className="bg-white p-6 rounded-lg border border-gray-200">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-bold">
          {question.id ? 'Modifier la question' : 'Ajouter une question'}
        </h3>
        <Button variant="secondary" size="sm" onClick={onCancel}>
          Annuler
        </Button>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input 
          label="Texte de la question"
          value={formData.text}
          onChange={e => handleChange('text', e.target.value)}
          placeholder="Saisissez votre question ici"
          error={errors.text}
        />
        
        <Input 
          label="Points"
          type="number"
          min="1"
          max="100"
          value={formData.points.toString()}
          onChange={e => handleChange('points', parseInt(e.target.value) || 1)}
          placeholder="Nombre de points"
        />
        
        {(formData.type === 'qcm' || formData.type === 'vrai_faux') && (
          <div className="space-y-2">
            <label className="block text-gray-700 font-semibold mb-2">
              Options
              {errors.options && <span className="text-red-500 text-sm ml-2">{errors.options}</span>}
              {errors.correctOption && <span className="text-red-500 text-sm ml-2">{errors.correctOption}</span>}
            </label>
            
            {formData.options?.map(option => (
              <div key={option.id} className="flex items-center space-x-2 p-2 border rounded">
                <input
                  type={formData.type === 'qcm' ? 'checkbox' : 'radio'}
                  checked={option.isCorrect || false}
                  onChange={() => handleToggleCorrect(option.id)}
                  className="h-4 w-4"
                />
                <span className="flex-grow">{option.text}</span>
                {formData.type !== 'vrai_faux' && (
                  <button
                    type="button"
                    onClick={() => handleRemoveOption(option.id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    Supprimer
                  </button>
                )}
              </div>
            ))}
            
            {formData.type !== 'vrai_faux' && (
              <div className="flex mt-2">
                <Input 
                  value={newOption}
                  onChange={e => setNewOption(e.target.value)}
                  placeholder="Nouvelle option"
                  className="mr-2"
                />
                <Button 
                  type="button" 
                  variant="secondary" 
                  size="sm"
                  onClick={handleAddOption}
                >
                  Ajouter
                </Button>
              </div>
            )}
          </div>
        )}
        
        <div className="mt-6 flex justify-end">
          <Button type="submit" variant="primary">
            Enregistrer la question
          </Button>
        </div>
      </form>
    </div>
  );
};