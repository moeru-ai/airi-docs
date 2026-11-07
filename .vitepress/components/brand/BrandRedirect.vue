<script setup lang="ts">
import { useRouter, withBase } from 'vitepress'
import { onMounted } from 'vue'

/*
 * The brand page is available only in English. The language menu changes the language part of the current path, so the
 * other languages need a page at the same path. This page sends the reader to the English page and replaces its own
 * history entry, so that the back button does not return here.
 */
const router = useRouter()

onMounted(() => router.go(withBase('/en/brand'), { replace: true }))
</script>

<template>
  <!-- The slot has a link to the English page for a reader without JavaScript. -->
  <div class="px-6 py-24 text-center text-neutral-500">
    <slot />
  </div>
</template>
