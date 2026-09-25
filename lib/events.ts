/**
 * Власні події додатку (Модуль 3: CustomEvent)
 */

export type AppEventName = 'coursesFiltered' | 'coursesSorted' | 'filtersReset'

export const APP_EVENTS: AppEventName[] = ['coursesFiltered', 'coursesSorted', 'filtersReset']

export function dispatchAppEvent(name: AppEventName, detail: Record<string, unknown> = {}) {
  document.dispatchEvent(new CustomEvent(name, { detail, bubbles: true, cancelable: true }))
}
