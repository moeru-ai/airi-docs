import { useLocalStorage, useMounted, usePreferredReducedMotion } from '@vueuse/core'
import { useData } from 'vitepress'
import { computed, shallowRef } from 'vue'

const toastMessage = shallowRef<string>()
const toastKey = shallowRef(0)
let toastTimer: ReturnType<typeof setTimeout> | undefined

/**
 * One short status message at the bottom of the brand kit page, for example
 * after a copy to the clipboard.
 *
 * A new message replaces the current message in the same place. A repeat of the current message only
 * extends its time, so a repeated action does not replay the entrance.
 */
export function useBrandToast() {
  function show(message: string) {
    if (message !== toastMessage.value) {
      toastMessage.value = message
      toastKey.value++
    }

    clearTimeout(toastTimer)
    toastTimer = setTimeout(() => toastMessage.value = undefined, 2200)
  }

  return { message: toastMessage, key: toastKey, show }
}

export async function copyText(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text)

    return true
  }
  catch {
    return false
  }
}

/**
 * True when the visitor turned on "reduce motion" in the site settings or in the system.
 */
export function useReducedMotion() {
  const siteSetting = useLocalStorage('docs:settings/reduce-motion', false)
  const system = usePreferredReducedMotion()

  return computed(() => siteSetting.value || system.value === 'reduce')
}

/**
 * True when the page shows the dark theme.
 *
 * The server does not know the theme of the visitor, so the value is false until the component is mounted.
 * The first render in the browser then matches the HTML from the server.
 */
export function usePageDark() {
  const { isDark } = useData()
  const mounted = useMounted()

  return computed(() => mounted.value && isDark.value)
}
