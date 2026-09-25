import { EmptyState } from '@/components/EmptyState'

export default function NotFound() {
  return (
    <section className="page">
      <h2>404</h2>
      <EmptyState icon="🧭" link={{ href: '/', label: 'Повернутись до каталогу' }}>
        Сторінку не знайдено.
      </EmptyState>
    </section>
  )
}
