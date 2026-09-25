'use client'

import dynamic from 'next/dynamic'
import { PageLoading } from '@/components/PageLoading'

// Форма читає LocalStorage під час ініціалізації, тому рендериться лише на клієнті
const ProfileForm = dynamic(() => import('@/components/ProfileForm'), {
  ssr: false,
  loading: () => <PageLoading />
})

export default function ProfilePage() {
  return (
    <section className="page">
      <h2>👤 Мій профіль</h2>
      <ProfileForm />
    </section>
  )
}
