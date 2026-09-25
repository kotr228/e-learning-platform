export const NAV_ITEMS = [
  { href: '/', label: 'Курси' },
  { href: '/my-courses', label: 'Мої курси' },
  { href: '/progress', label: 'Прогрес' },
  { href: '/profile', label: 'Профіль' }
] as const

export function isActivePath(pathname: string, href: string): boolean {
  if (href === '/') return pathname === '/' || pathname.startsWith('/courses')
  return pathname === href || pathname.startsWith(`${href}/`)
}
