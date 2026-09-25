import { LoaderCircle } from 'lucide-react'

export function PageLoading() {
  return (
    <div role="status" className="my-12 flex flex-col items-center gap-2 text-slate-500 dark:text-slate-400">
      <LoaderCircle className="size-8 animate-spin text-brand-600 dark:text-brand-400" aria-hidden />
      Завантаження...
    </div>
  )
}
