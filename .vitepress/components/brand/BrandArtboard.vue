<script setup lang="ts">
/**
 * An artboard on the canvas, as in a design tool: the name sits outside the board, above its top left corner.
 *
 * The name is a visible copy of the label of the content, so screen readers skip it.
 * The content gives its own accessible name, such as the alternative text of the image.
 *
 * The `tools` slot stands above the top right corner of the board, so its controls do not cover the content. The controls
 * appear while the pointer is on the artboard or while a control has keyboard focus. A touch screen has no pointer, so it
 * always shows them.
 */
defineProps<{
  name: string
}>()
</script>

<template>
  <div class="bk-artboard">
    <div class="bk-artboard__head">
      <span class="bk-artboard__name" aria-hidden="true">{{ name }}</span>
      <div v-if="$slots.tools" class="bk-artboard__tools">
        <slot name="tools" />
      </div>
    </div>
    <div class="bk-artboard__board">
      <slot />
    </div>
  </div>
</template>

<style scoped>
.bk-artboard {
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.bk-artboard__head {
  position: relative;
}

/* The tools can be taller than the name block. They grow upward into the padding of the canvas, so the layout does not change. */
.bk-artboard__tools {
  position: absolute;
  right: 0;
  bottom: 0.25rem;
}

/* Hidden controls do not react to the pointer, so the space above the board does not show them. */
@media (hover: hover) {
  .bk-artboard__tools {
    pointer-events: none;
    opacity: 0;
    transition: opacity 0.2s ease;
  }

  .bk-artboard:hover .bk-artboard__tools,
  .bk-artboard:has(:focus-visible) .bk-artboard__tools {
    pointer-events: auto;
    opacity: 1;
  }
}

/* The name block has a fixed height, `--artboard-name`, so the layout of the canvas can count it. */
.bk-artboard__name {
  display: flex;
  align-items: flex-end;
  height: var(--artboard-name, 1.5rem);
  padding-bottom: 0.4rem;
  overflow: hidden;
  color: hsl(var(--muted-foreground));
  font-size: 0.75rem;
  line-height: 1;
  white-space: nowrap;
  text-overflow: ellipsis;
  transition: color 0.2s ease;
}

.bk-artboard:hover .bk-artboard__name {
  color: var(--bk-pink-ink);
}

/* A faint edge, so a light board stays visible on the light canvas. */
.bk-artboard__board {
  box-shadow: 0 0 0 1px var(--bk-line);
}
</style>
