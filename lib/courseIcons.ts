/**
 * Реєстр логотипів технологій (react-icons).
 *
 * У даних курсу зберігається лише ключ (`tech: ['react']`), а не сам компонент:
 * курси зберігаються в LocalStorage та експортуються в JSON, а функції-компоненти
 * не серіалізуються. Ключ → компонент перетворюється тут, у момент рендеру.
 */

import type { IconType } from 'react-icons'
import { FaAws } from 'react-icons/fa'
import {
  SiAngular,
  SiCss,
  SiDocker,
  SiGit,
  SiGraphql,
  SiHtml5,
  SiJavascript,
  SiJest,
  SiMongodb,
  SiNextdotjs,
  SiNodedotjs,
  SiPostgresql,
  SiPython,
  SiReact,
  SiRedux,
  SiSocketdotio,
  SiSvelte,
  SiTailwindcss,
  SiTypescript,
  SiVuedotjs
} from 'react-icons/si'
import type { Course, TechIconKey } from './types'

/** `Record<TechIconKey, …>` гарантує, що для кожного ключа є іконка */
export const TECH_ICONS: Record<TechIconKey, { icon: IconType; label: string }> = {
  javascript: { icon: SiJavascript, label: 'JavaScript' },
  html: { icon: SiHtml5, label: 'HTML5' },
  // У react-icons 5.x іконка CSS3 перейменована на SiCss
  css: { icon: SiCss, label: 'CSS' },
  react: { icon: SiReact, label: 'React' },
  nodejs: { icon: SiNodedotjs, label: 'Node.js' },
  git: { icon: SiGit, label: 'Git' },
  typescript: { icon: SiTypescript, label: 'TypeScript' },
  python: { icon: SiPython, label: 'Python' },
  vue: { icon: SiVuedotjs, label: 'Vue.js' },
  mongodb: { icon: SiMongodb, label: 'MongoDB' },
  docker: { icon: SiDocker, label: 'Docker' },
  graphql: { icon: SiGraphql, label: 'GraphQL' },
  // Simple Icons прибрали логотип AWS, тому беремо його з Font Awesome
  aws: { icon: FaAws, label: 'AWS' },
  angular: { icon: SiAngular, label: 'Angular' },
  redux: { icon: SiRedux, label: 'Redux' },
  nextjs: { icon: SiNextdotjs, label: 'Next.js' },
  tailwind: { icon: SiTailwindcss, label: 'Tailwind CSS' },
  postgresql: { icon: SiPostgresql, label: 'PostgreSQL' },
  jest: { icon: SiJest, label: 'Jest' },
  socketio: { icon: SiSocketdotio, label: 'Socket.IO' },
  svelte: { icon: SiSvelte, label: 'Svelte' }
}

export function isTechIconKey(value: unknown): value is TechIconKey {
  return typeof value === 'string' && Object.hasOwn(TECH_ICONS, value)
}

/** Іконки технологій курсу; порожній масив — показуємо emoji-заглушку */
export function getCourseIcons(course: Pick<Course, 'tech'>) {
  return (course.tech ?? []).filter(isTechIconKey).map(key => ({ key, ...TECH_ICONS[key] }))
}
