'use client'

import Link from 'next/link'
import { useParams } from 'next/navigation'
import { CourseDetail } from '@/components/course/CourseDetail'
import { CourseGate } from '@/components/course/CourseGate'

export default function CourseDetailPage() {
  const { id } = useParams<{ id: string }>()

  return (
    <section className="page">
      <Link href="/" className="btn btn-back">
        ← Назад до курсів
      </Link>
      <CourseGate courseId={Number(id)}>{course => <CourseDetail course={course} />}</CourseGate>
    </section>
  )
}
