'use client'

import { ChevronLeft } from 'lucide-react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { CourseDetail } from '@/components/course/CourseDetail'
import { CourseGate } from '@/components/course/CourseGate'
import { buttonClass } from '@/components/ui/styles'

export default function CourseDetailPage() {
  const { id } = useParams<{ id: string }>()

  return (
    <section className="page">
      <Link href="/" className={buttonClass('neutral', 'md', 'mb-6')}>
        <ChevronLeft className="size-4" aria-hidden />
        Назад до курсів
      </Link>
      <CourseGate courseId={Number(id)}>{course => <CourseDetail course={course} />}</CourseGate>
    </section>
  )
}
