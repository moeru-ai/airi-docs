import type { ThemeVitePluginsOptions } from '@proj-airi/vitepress-theme/node'

import { execFileSync } from 'node:child_process'

import { docsRepository, github } from './meta'

type GitChangelogOptions = NonNullable<ThemeVitePluginsOptions['gitChangelog']>
type MapAuthors = NonNullable<GitChangelogOptions['mapAuthors']>
type Commit = Parameters<Extract<GitChangelogOptions['repoURL'], (...args: any[]) => any>>[0]

/**
 * Last commit of the history extracted from `docs/` of moeru-ai/airi.
 */
const extractedFromAiriHead = 'c34129f6122d28ed9982375bc9b4c00d038d8094'

function listExtractedCommits(): Set<string> {
  try {
    const out = execFileSync('git', ['rev-list', extractedFromAiriHead], { encoding: 'utf-8' })
    return new Set(out.split('\n').filter(Boolean))
  }
  catch {
    // Shallow clones do not have the extracted history, so there is nothing to map.
    console.warn('Commits extracted from moeru-ai/airi are not in this clone, #refs in changelogs link to moeru-ai/airi-docs.')
    return new Set()
  }
}

const extractedCommits = listExtractedCommits()

/**
 * Commits extracted from moeru-ai/airi reference its issues and pull requests
 * (`#1234`), while their hashes only exist in this repository.
 */
export function repoURLOf(commit: Commit): string {
  return extractedCommits.has(commit.hash) ? github : docsRepository
}

export function commitURLOf(commit: Commit): string {
  return `${docsRepository}/commit/${commit.hash}`
}

/**
 * Merges the Git identities of the same person in the page changelogs.
 */
export const gitAuthors: MapAuthors = [
  {
    name: 'Neko Ayaka',
    username: 'nekomeowww',
    mapByNameAliases: ['Neko'],
    mapByEmailAliases: ['neko@ayaka.moe'],
  },
  {
    name: 'LemonNeko',
    username: 'LemonNekoGH',
    mapByEmailAliases: ['self@lemonneko.moe', 'chheese048@gmail.com'],
  },
  {
    name: 'RainbowBird',
    username: 'luoling8192',
    mapByEmailAliases: ['git@luoling.moe', 'rbxin2003@outlook.com'],
  },
  {
    name: '藍+85CD',
    username: 'kwaa',
  },
  {
    name: 'Makito',
    username: 'sumimakito',
    mapByEmailAliases: ['i@maki.to'],
  },
  {
    name: 'Typed SIGTERM',
    username: 'typed-sigterm',
    mapByEmailAliases: ['typed.sigterm@gmail.com'],
  },
  {
    name: 'Neko-233',
    username: 'Neko-233',
    mapByNameAliases: ['Lovehsigure_520'],
    mapByEmailAliases: ['1260907335@qq.com'],
  },
  {
    name: '0xSelenicDove',
    username: '0xSelenicDove',
    mapByNameAliases: ['Columbina'],
  },
  {
    name: 'Icefair',
    username: 'JhIcefair',
  },
]
