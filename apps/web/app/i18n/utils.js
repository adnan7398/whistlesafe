import en from './locales/en.json'
import hi from './locales/hi.json'
import bn from './locales/bn.json'
import ta from './locales/ta.json'
import te from './locales/te.json'
import kn from './locales/kn.json'

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