<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

import { contactEmail } from '../../meta'
import { DESCRIPTION_LENGTHS, PROJECT_LINKS, PROJECT_WEBSITE, projectFacts } from './kit'

/** The description in three parts, and the facts about the project. */
const { t } = useI18n()

const facts = computed(() => projectFacts(t))
</script>

<template>
  <div class="bk-about">
    <div class="bk-about__description bk-reveal">
      <p v-for="length of DESCRIPTION_LENGTHS" :key="length" class="bk-about__part">
        {{ t(`docs.brand.about.parts.${length}`) }}
      </p>
    </div>

    <dl class="bk-about__facts bk-reveal">
      <div v-for="fact of facts" :key="fact.id" class="bk-about__fact">
        <dt>{{ fact.label }}</dt>
        <dd>{{ fact.value }}</dd>
      </div>
      <div class="bk-about__fact">
        <dt>{{ t('docs.brand.facts.website.label') }}</dt>
        <dd class="bk-about__links">
          <a :href="PROJECT_WEBSITE.href" target="_blank" rel="noopener noreferrer">
            {{ PROJECT_WEBSITE.label }}
            <span class="i-lucide:arrow-up-right" aria-hidden="true" />
          </a>
        </dd>
      </div>
      <div class="bk-about__fact">
        <dt>{{ t('docs.brand.facts.links.label') }}</dt>
        <dd class="bk-about__links">
          <a v-for="link of PROJECT_LINKS" :key="link.href" :href="link.href" target="_blank" rel="noopener noreferrer">
            {{ link.label }}
            <span class="i-lucide:arrow-up-right" aria-hidden="true" />
          </a>
        </dd>
      </div>
      <div class="bk-about__fact">
        <dt>{{ t('docs.brand.facts.contact.label') }}</dt>
        <dd class="bk-about__links">
          <a :href="`mailto:${contactEmail}`">{{ contactEmail }}</a>
        </dd>
      </div>
    </dl>
  </div>
</template>

<style scoped>
.bk-about {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: clamp(2.5rem, 5vw, 4rem);
}

@media (min-width: 1024px) {
  .bk-about {
    grid-template-columns: minmax(0, 7fr) minmax(0, 5fr);
    align-items: start;
  }
}

.bk-about__part {
  margin: 0 0 0.75em;
  color: hsl(var(--foreground));
  font-size: clamp(1.0625rem, 1.5vw, 1.25rem);
  line-height: 1.55;
  text-wrap: pretty;
}

.bk-about__part:last-child {
  margin-bottom: 0;
}

.bk-about__facts {
  margin: 0;
  border-top: 1px solid var(--bk-line);
}

.bk-about__fact {
  display: grid;
  grid-template-columns: minmax(6.5rem, 2fr) minmax(0, 5fr);
  align-items: baseline;
  gap: 1rem;
  padding-block: 0.85rem;
  border-bottom: 1px solid var(--bk-line);
  font-size: 0.9375rem;
  line-height: 1.5;
}

.bk-about__fact dt {
  color: hsl(var(--muted-foreground));
  font-size: 0.875rem;
}

.bk-about__fact dd {
  margin: 0;
}

/* A phone: the text and the rows of facts take less height. */
@media (max-width: 639px) {
  .bk-about__part {
    font-size: 1rem;
  }

  .bk-about__fact {
    padding-block: 0.6rem;
  }
}

/* One link per line. */
.bk-about__links {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.35rem;
}

.bk-about__links a {
  display: inline-flex;
  align-items: center;
  gap: 0.2rem;
  text-decoration: underline;
  text-decoration-color: var(--bk-line-strong);
  text-underline-offset: 0.3em;
  transition: text-decoration-color 0.2s ease;
}

.bk-about__links a:hover {
  text-decoration-color: var(--bk-pink);
}

.bk-about__links a span {
  font-size: 0.8em;
  opacity: 0.6;
}
</style>
