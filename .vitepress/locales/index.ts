import enBrand from './en/brand.yaml'
import en from './en/versions.yaml'
import es from './es/versions.yaml'
import fr from './fr/versions.yaml'
import ja from './ja/versions.yaml'
import ko from './ko/versions.yaml'
import ru from './ru/versions.yaml'
import vi from './vi/versions.yaml'
import zhHans from './zh-Hans/versions.yaml'
import zhHant from './zh-Hant/versions.yaml'

/**
 * Site messages keyed by locale, merged over the theme messages.
 *
 * The brand page is available only in English, so only that locale has the brand messages.
 */
export default {
  'en': { docs: { versions: en, brand: enBrand } },
  'es': { docs: { versions: es } },
  'fr': { docs: { versions: fr } },
  'ja': { docs: { versions: ja } },
  'ko': { docs: { versions: ko } },
  'ru': { docs: { versions: ru } },
  'vi': { docs: { versions: vi } },
  'zh-Hans': { docs: { versions: zhHans } },
  'zh-Hant': { docs: { versions: zhHant } },
} as Record<string, Record<string, unknown>>
