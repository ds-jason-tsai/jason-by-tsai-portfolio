import 'server-only'

const dictionaries = {
  en: () => import('./en.json').then((module) => module.default),
  zh: () => import('./zh.json').then((module) => module.default),
  ja: () => import('./ja.json').then((module) => module.default),
}

const defaultLocale = 'zh'

// Defensive fallback: requests that bypass the locale-redirect middleware
// (e.g. /favicon.ico before app/favicon.ico existed, or any other path
// excluded from middleware's matcher) can reach this function with a
// `locale` value that isn't actually 'en' | 'zh' | 'ja'. Previously that
// crashed with "TypeError: dictionaries[locale] is not a function"
// (see production runtime errors on the /[lang] route). Falling back to
// the default locale keeps the page rendering instead of 500ing.
export const getDictionary = async (locale: 'en' | 'zh' | 'ja') =>
  (dictionaries[locale] ?? dictionaries[defaultLocale])()
