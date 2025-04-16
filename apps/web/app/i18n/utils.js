import en from './locales/en.json' assert { type: 'json' }
import hi from './locales/hi.json' assert { type: 'json' }
import bn from './locales/bn.json' assert { type: 'json' }
import ta from './locales/ta.json' assert { type: 'json' }
import te from './locales/te.json' assert { type: 'json' }
import kn from './locales/kn.json' assert { type: 'json' }

const dictionaries = {
  en,
  hi,
  bn,
  ta,
  te,
  kn
}

export const getDictionary = (locale) => {
  return dictionaries[locale] || dictionaries.en
} 