import { useState, useMemo } from 'react';
import api from '../services/api';

export interface Question {
  id: number;
  text: string;
}

export interface UseQuizEngineProps<T extends { id: number }> {
  questions: T[];
  onSubmit?: (score: number, answers: Record<number, number>) => Promise<void> | void;
  apiEndpoint?: string;
  initialAnswers?: Record<number, number>;
  initialStep?: number;
}

export function useQuizEngine<T extends { id: number }>({
  questions,
  onSubmit,
  apiEndpoint = '/assessments/submit',
  initialAnswers = {},
  initialStep = 0,
}: UseQuizEngineProps<T>) {
  const [currentStep, setCurrentStep] = useState<number>(initialStep);
  const [answers, setAnswers] = useState<Record<number, number>>(initialAnswers);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const totalQuestions = questions.length;
  
  // Ensure bounds safety for the current step
  const safeStep = Math.max(0, Math.min(currentStep, totalQuestions > 0 ? totalQuestions - 1 : 0));
  const activeQuestion = questions[safeStep];

  // Retrieve current active answer points from cache
  const selectedPoints = activeQuestion ? answers[activeQuestion.id] : undefined;

  // Validation safeguard ensuring active choice is registered
  const isAnswered = selectedPoints !== undefined;

  // Compute cumulative summaries
  const totalScore = useMemo(() => {
    return Object.values(answers).reduce((sum, score) => sum + score, 0);
  }, [answers]);

  // Record selection in cache
  const handleSelectOption = (points: number) => {
    if (!activeQuestion) return;
    setError(null);
    setAnswers((prev) => ({
      ...prev,
      [activeQuestion.id]: points,
    }));
  };

  // Next step transition with validation safeguards and API dispatch structures
  const handleNext = async () => {
    if (!isAnswered) {
      setError('Please register an active choice before proceeding.');
      return;
    }
    setError(null);

    if (currentStep < totalQuestions - 1) {
      setCurrentStep((prev) => prev + 1);
    } else {
      setIsSubmitting(true);
      try {
        if (onSubmit) {
          await onSubmit(totalScore, answers);
        } else {
          // Fire API dispatch structure
          await api.post(apiEndpoint, {
            score: totalScore,
            answers,
            submittedAt: new Date().toISOString(),
          });
        }
        setIsSubmitted(true);
      } catch (err) {
        console.error('Quiz submission failed:', err);
        const errorMsg = (err as { response?: { data?: { error?: string } }; message?: string }).response?.data?.error || (err as Error).message || 'Failed to submit assessment.';
        setError(errorMsg);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  // Previous step transition with index bounds tracking
  const handlePrevious = () => {
    setError(null);
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  // Reset the quiz state engine
  const handleReset = () => {
    setAnswers({});
    setCurrentStep(0);
    setIsSubmitted(false);
    setIsSubmitting(false);
    setError(null);
  };

  // Dynamic progress tracker percentage calculation
  const progressPercentage = totalQuestions > 0 ? (safeStep / totalQuestions) * 100 : 0;

  return {
    currentStep: safeStep,
    answers,
    totalScore,
    isAnswered,
    isSubmitted,
    isSubmitting,
    error,
    activeQuestion,
    selectedPoints,
    progressPercentage,
    handleSelectOption,
    handleNext,
    handlePrevious,
    handleReset,
  };
}
