import { contactEmail, discord, github, x } from '../../meta'

type Translate = (key: string, values?: Record<string, unknown>) => string

/** Lengths of the project description, also the message keys under `docs.brand.about.parts`. */
export const DESCRIPTION_LENGTHS = ['short', 'medium', 'long'] as const

export type DescriptionLength = typeof DESCRIPTION_LENGTHS[number]

/**
 * The description of a length. Each length starts with the text of the shorter lengths.
 *
 * Before:
 * - `'medium'`
 *
 * After:
 * - The text of the parts `short` and `medium`
 */
export function descriptionOf(t: Translate, length: DescriptionLength): string {
  return DESCRIPTION_LENGTHS
    .slice(0, DESCRIPTION_LENGTHS.indexOf(length) + 1)
    .map(part => t(`docs.brand.about.parts.${part}`))
    .join(' ')
}

/** The holders of the copyright, in the order of the credit line. */
export const CREDIT_HOLDERS = ['Project AIRI', 'Moeru AI'] as const

export const CREDIT_LINE = `© ${CREDIT_HOLDERS.join(' × ')}`

/** The website of the project. The About section shows it in its own row, before the other links. */
export const PROJECT_WEBSITE = { label: 'airi.moeru.ai', href: 'https://airi.moeru.ai' }

export const PROJECT_LINKS = [
  { label: 'GitHub', href: github },
  { label: 'Discord', href: discord },
  { label: 'X', href: x },
]

export interface ProjectFact {
  /** Message key under `docs.brand.facts`. */
  id: string
  label: string
  value: string
}

/**
 * Facts about the project.
 *
 * Sources: the README of the AIRI repository (name, platforms), its `package.json` (license),
 * and its first commit on 2024-06-09.
 */
export function projectFacts(t: Translate): ProjectFact[] {
  const fact = (id: string, value?: string): ProjectFact => ({
    id,
    label: t(`docs.brand.facts.${id}.label`),
    value: value ?? t(`docs.brand.facts.${id}.value`),
  })

  return [
    fact('name', 'Project AIRI / AIRI'),
    fact('category'),
    fact('started'),
    fact('platforms'),
    fact('license', 'MIT'),
    fact('developer'),
  ]
}

/** Text of `README.txt` in the archives: the descriptions, the facts, the credit line, the terms, and the contact. */
export function archiveReadme(t: Translate, pageUrl: string): string {
  return [
    `Project AIRI / ${t('docs.brand.hero.title')}`,
    pageUrl,
    '',
    ...DESCRIPTION_LENGTHS.flatMap(length => [`[${t(`docs.brand.about.lengths.${length}`)}]`, descriptionOf(t, length), '']),
    ...projectFacts(t).map(fact => `${fact.label}: ${fact.value}`),
    `${t('docs.brand.facts.website.label')}: ${PROJECT_WEBSITE.href}`,
    ...PROJECT_LINKS.map(link => `${link.label}: ${link.href}`),
    '',
    `${t('docs.brand.basics.credit')}: ${CREDIT_LINE}`,
    t('docs.brand.usage.terms'),
    '',
    `${t('docs.brand.facts.contact.label')}: ${contactEmail}`,
    '',
  ].join('\n')
}
