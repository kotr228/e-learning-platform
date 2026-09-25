'use client'

import { useParams } from 'next/navigation'
import { CourseGate } from '@/components/course/CourseGate'
import { LessonViewer } from '@/components/course/LessonViewer'

export default function LessonPage() {
  const { id, lessonId } = useParams<{ id: string; lessonId: string }>()

  return (
    <section className="page">
      <CourseGate courseId={Number(id)} requireEnrollment>
        {course => <LessonViewer key={lessonId} course={course} lessonId={Number(lessonId)} />}
      </CourseGate>
    </section>
  )
}
