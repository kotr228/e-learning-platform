'use client'

import Link from 'next/link'
import { useState, type FormEvent } from 'react'
import { useNotify } from '@/context/ToastContext'
import { gradeTest } from '@/lib/courses'
import type { Course } from '@/lib/types'

type Result = ReturnType<typeof gradeTest>

export function CourseTest({ course }: { course: Course }) {
  const notify = useNotify()
  const [answers, setAnswers] = useState<Record<number, number>>({})
  const [result, setResult] = useState<Result | null>(null)
  const { questions } = course.test

  const onSubmit = (e: FormEvent) => {
    e.preventDefault()
    const graded = gradeTest(questions, answers)
    setResult(graded)
    window.scrollTo({ top: 0, behavior: 'smooth' })
    if (graded.passed) {
      notify(`Тест складено успішно! ${graded.percentage}%`, 'success')
    }
  }

  const onRetry = () => {
    setAnswers({})
    setResult(null)
  }

  if (result) {
    return (
      <div className="test-result">
        <div className="test-result-icon" aria-hidden="true">
          {result.passed ? '🎉' : '📚'}
        </div>
        <h2 className={result.passed ? 'text-success-soft' : 'text-warning-soft'}>
          {result.passed ? 'Вітаємо! Тест складено!' : 'Потрібно попрацювати ще'}
        </h2>
        <p className="test-score">
          {result.score} з {questions.length} правильних ({result.percentage}%)
        </p>

        <div className="panel text-start">
          <h3 className="text-center mb-4">Результати по питаннях:</h3>
          {result.answers.map((a, i) => (
            <div key={i} className={`answer-result ${a.isCorrect ? 'correct' : 'incorrect'}`}>
              <strong>Питання {i + 1}:</strong> {a.question}
              <br />
              <span>{a.isCorrect ? '✅ Правильно' : '❌ Неправильно'}</span>
            </div>
          ))}
        </div>

        <div className="lesson-actions">
          <Link href={`/courses/${course.id}`} className="btn btn-back">
            ← Назад до курсу
          </Link>
          {!result.passed && (
            <button type="button" className="btn btn-primary" onClick={onRetry}>
              🔄 Спробувати ще раз
            </button>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="test-container">
      <h2>📝 Тест: {course.title}</h2>
      <p className="text-muted mb-4">Відповідьте на всі питання та натисніть &quot;Завершити тест&quot;</p>

      <form onSubmit={onSubmit}>
        {questions.map((q, qIndex) => (
          <fieldset key={qIndex} className="test-question">
            <legend>
              Питання {qIndex + 1}: {q.question}
            </legend>
            {q.options.map((option, oIndex) => (
              <label key={oIndex} className={`test-option${answers[qIndex] === oIndex ? ' selected' : ''}`}>
                <input
                  type="radio"
                  name={`question-${qIndex}`}
                  value={oIndex}
                  checked={answers[qIndex] === oIndex}
                  onChange={() => setAnswers(prev => ({ ...prev, [qIndex]: oIndex }))}
                />
                {option}
              </label>
            ))}
          </fieldset>
        ))}

        <div className="lesson-actions">
          <Link href={`/courses/${course.id}`} className="btn btn-back">
            Скасувати
          </Link>
          <button type="submit" className="btn btn-primary">
            ✓ Завершити тест
          </button>
        </div>
      </form>
    </div>
  )
}
