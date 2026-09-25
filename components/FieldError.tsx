/** Повідомлення про помилку валідації поля */
export function FieldError({ id, message }: { id: string; message: string | null | undefined }) {
  if (!message) return null
  return (
    <span id={`error-${id}`} className="error-message" role="alert">
      {message}
    </span>
  )
}
