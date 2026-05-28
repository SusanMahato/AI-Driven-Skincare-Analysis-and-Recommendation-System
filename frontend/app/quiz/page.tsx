'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { submitQuiz } from '@/lib/api';
import { isLoggedIn } from '@/lib/auth';

const questions = [
  {
    id: 'age_range',
    question: 'What is your age range?',
    options: ['Under 18', '18-24', '25-34', '35-44', '45+'],
  },
  {
    id: 'gender',
    question: 'What is your gender?',
    options: ['Male', 'Female', 'Prefer not to say'],
  },
  {
    id: 'skin_type',
    question: 'What is your skin type?',
    options: ['Oily', 'Dry', 'Combination', 'Normal', "I don't know"],
  },
  {
    id: 'products_used_before',
    question: 'Have you used skincare products before?',
    options: ['Never', 'Occasionally', 'Moisturizer', 'Serum', 'Sunscreen'],
  },
  {
    id: 'sun_exposure',
    question: 'How much sun exposure do you get daily?',
    options: ['Under 1hr', '1-3hrs', '3hrs+'],
  },
  {
    id: 'concern_one',
    question: 'What is your main skin concern?',
    options: ['Acne', 'Oiliness', 'Dryness', 'Redness', 'Dark spots', 'Wrinkles', 'Dark circles', 'Pores'],
  },
  {
    id: 'skin_goal',
    question: 'What is your skin goal?',
    options: ['Clear skin', 'Even tone', 'Anti-aging', 'Hydration', 'Oil control'],
  },
];

export default function QuizPage() {
  const router = useRouter();
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<any>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isLoggedIn()) {
      router.push('/login');
    }
  }, []);

  const handleSelect = (value: string) => {
    const question = questions[current];
    setAnswers({ ...answers, [question.id]: value });
  };

  const handleNext = () => {
    if (current < questions.length - 1) {
      setCurrent(current + 1);
    }
  };

  const handleBack = () => {
    if (current > 0) {
      setCurrent(current - 1);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError('');
    try {
      await submitQuiz({
        ...answers,
        concern_two: null,
        sensitivity: null,
      });
      router.push('/scan');
    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const question = questions[current];
  const selected = answers[question.id];
  const isLast = current === questions.length - 1;

  return (
    <div className="min-h-screen bg-rose-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-md p-8 w-full max-w-md">

        {/* Progress */}
        <div className="mb-6">
          <div className="flex justify-between text-xs text-gray-400 mb-2">
            <span>Question {current + 1} of {questions.length}</span>
            <span>{Math.round(((current + 1) / questions.length) * 100)}%</span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-2">
            <div
              className="bg-rose-400 h-2 rounded-full transition-all"
              style={{ width: `${((current + 1) / questions.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Question */}
        <h2 className="text-lg font-semibold text-gray-800 mb-6">{question.question}</h2>

        {/* Options */}
        <div className="space-y-3 mb-8">
          {question.options.map((option) => (
            <button
              key={option}
              onClick={() => handleSelect(option)}
              className={`w-full text-left px-4 py-3 rounded-xl border text-sm transition ${
                selected === option
                  ? 'border-rose-400 bg-rose-50 text-rose-600 font-medium'
                  : 'border-gray-200 text-gray-700 hover:border-rose-200'
              }`}
            >
              {option}
            </button>
          ))}
        </div>

        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

        {/* Navigation */}
        <div className="flex gap-3">
          {current > 0 && (
            <button
              onClick={handleBack}
              className="flex-1 border border-gray-200 text-gray-700 rounded-lg py-2.5 text-sm font-medium hover:bg-gray-50 transition"
            >
              Back
            </button>
          )}
          {isLast ? (
            <button
              onClick={handleSubmit}
              disabled={!selected || loading}
              className="flex-1 bg-rose-500 text-white rounded-lg py-2.5 text-sm font-medium hover:bg-rose-600 transition disabled:opacity-50"
            >
              {loading ? 'Saving...' : 'Complete Quiz'}
            </button>
          ) : (
            <button
              onClick={handleNext}
              disabled={!selected}
              className="flex-1 bg-rose-500 text-white rounded-lg py-2.5 text-sm font-medium hover:bg-rose-600 transition disabled:opacity-50"
            >
              Next
            </button>
          )}
        </div>

      </div>
    </div>
  );
}