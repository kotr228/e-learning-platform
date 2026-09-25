'use client'

import { useParams } from 'next/navigation'
import { CourseGate } from '@/components/course/CourseGate'
import { CourseTest } from '@/components/course/CourseTest'

export default function TestPage() {
  const { id } = useParams<{ id: string }>()

  return (
    <section className="page">
      <CourseGate courseId={Number(id)} requireEnrollment>
        {course => <CourseTest course={course} />}
      </CourseGate>
    </section>
  )
}
