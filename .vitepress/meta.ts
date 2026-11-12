// noinspection ES6PreferShortImport: IntelliJ IDE hint to avoid warning to use `~/contributors`, will fail on build if changed

/* Texts */
export const projectName = 'Project AIRI'
export const projectShortName = 'AIRI'
export const projectDescription
  = 'An open-source attempt to re-create Neuro-sama, the most famous AI VTuber on this earth, but also forming a cyber companion for everyone.'

/* vitepress head */
export const ogUrl = 'https://airi.moeru.ai/docs/'
export const ogImage = `${ogUrl}open-graph.png`

/* GitHub and social links */
export const github = 'https://github.com/moeru-ai/airi'
export const docsRepository = 'https://github.com/moeru-ai/airi-docs'
export const releases = 'https://github.com/moeru-ai/airi/releases'
export const contributing = 'https://github.com/moeru-ai/airi/blob/main/.github/CONTRIBUTING.md'
export const discord = 'https://discord.gg/TgQ3Cu2F7A'
export const x = 'https://x.com/proj_airi'
export const contactEmail = 'airi@moeru.ai'

/* Avatar/Image/Sponsors servers */
export const sponsor = 'https://github.com/sponsors/nekomeowww'

/* Analytics */
// The docs site has its own OpenPanel project, apart from the AIRI apps.
// This public client accepts only the docs origin. Never add a client secret here.
export const openpanel = {
  apiUrl: 'https://analytics.airi.build/api',
  clientId: '85a92cc3-0c5c-412a-b5b6-1c2447ad9e63',
} as const
