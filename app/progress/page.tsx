'use client'

import { PageLoading } from '@/components/PageLoading'
import { ProgressDashboard } from '@/components/ProgressDashboard'
import { useAppState } from '@/context/AppStateContext'

export default function ProgressPage() {
  const { state } = useAppState()

  return (
    <section className="page">
      <h2>Мій прогрес</h2>
      {state.hydrated ? <ProgressDashboard /> : <PageLoading />}
    </section>
  )
}
