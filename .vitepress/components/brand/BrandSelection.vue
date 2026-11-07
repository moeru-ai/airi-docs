<script setup lang="ts">
import type { BrandActionItem } from './BrandActions.vue'
import type { BrandTone } from './assets'

import BrandActions from './BrandActions.vue'

/**
 * Selection of an object in a design tool: a solid box on the bounds of the object, a handle at each corner, and the
 * download buttons. The parent must place this element exactly on the object.
 *
 * The box and the buttons appear only while the pointer is on the object. The buttons stand outside the box, below
 * its bottom right corner, so they do not cover the object. They are children of this element, so the pointer stays on
 * this element on the way from the object to a button. The parent must leave at least 30 pixels below the object.
 *
 * A touch screen has no pointer position and always shows the buttons. This element then has no position, so the
 * buttons use the corner of the parent, where a small object does not limit their width.
 */
defineProps<{
  items: BrandActionItem[]
  /** The fixed background behind the buttons, see `BrandActions.vue`. */
  surface?: BrandTone
}>()
</script>

<template>
  <div class="bk-selection" data-canvas-box>
    <span class="bk-selection__box" aria-hidden="true">
      <span class="bk-selection__handle is-tl" />
      <span class="bk-selection__handle is-tr" />
      <span class="bk-selection__handle is-bl" />
      <span class="bk-selection__handle is-br" />
    </span>
    <BrandActions reveal :surface="surface" :items="items" />
  </div>
</template>

<style scoped>
.bk-selection {
  /* Main pink of the logo. */
  --select: #ec92ad;
}

.bk-selection__box {
  pointer-events: none;
  position: absolute;
  inset: 0;
  box-shadow: 0 0 0 1px var(--select);
  opacity: 0;
  transition: opacity 0.2s ease;
}

/* Handles on the corners of the box line, which is 1px outside the box. */
.bk-selection__handle {
  position: absolute;
  width: 7px;
  height: 7px;
  background: #fff;
  box-shadow: 0 0 0 1px var(--select);
  translate: -50% -50%;
}

.bk-selection__handle.is-tl { top: -0.5px; left: -0.5px; }
.bk-selection__handle.is-tr { top: -0.5px; left: calc(100% + 0.5px); }
.bk-selection__handle.is-bl { top: calc(100% + 0.5px); left: -0.5px; }
.bk-selection__handle.is-br { top: calc(100% + 0.5px); left: calc(100% + 0.5px); }

.bk-selection:focus-within .bk-selection__box {
  opacity: 1;
}

@media (hover: hover) {
  .bk-selection {
    position: relative;
  }

  .bk-selection:hover .bk-selection__box {
    opacity: 1;
  }

  /* The padding is the gap between the box and the buttons, and it is part of this element. */
  .bk-selection .bk-actions {
    position: absolute;
    top: 100%;
    right: 0;
    width: max-content;
    padding-top: 6px;
  }

  /* A strip along the whole bottom edge, so the pointer can leave the object at any point on its way to the buttons. */
  .bk-selection:hover::after {
    content: '';
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    height: 6px;
  }
}

/* The buttons stand in the empty space of the parent. */
@media (hover: none) {
  .bk-selection .bk-actions {
    position: absolute;
    right: 0.25rem;
    bottom: 0.25rem;
    left: 0.25rem;
  }
}
</style>
