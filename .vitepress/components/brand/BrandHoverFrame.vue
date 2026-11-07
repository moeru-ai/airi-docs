<script setup lang="ts">
/**
 * Content with a title above it, and a frame that appears around it.
 *
 * At rest, the page shows the content and the title. While the pointer is on the content, or while a control has keyboard
 * focus, the frame and the actions appear. The frame is behind and outside the content, so the content stays in place and
 * nothing covers it. A touch screen has no pointer, so it always shows the frame and the actions.
 *
 * The frame takes `--bk-frame-top` above the content and `--bk-frame-side` on the other sides. It does not take part in
 * the layout, so the parent keeps this space free.
 */
withDefaults(defineProps<{
  /** The element of the whole block. */
  as?: string
  /** The element of the frame, which holds the title and the actions. */
  captionAs?: string
}>(), {
  as: 'div',
  captionAs: 'div',
})
</script>

<template>
  <component :is="as" class="bk-hover-frame">
    <component :is="captionAs" class="bk-hover-frame__frame">
      <div class="bk-hover-frame__bar">
        <div class="bk-hover-frame__title">
          <slot name="title" />
        </div>
        <div class="bk-hover-frame__actions">
          <slot name="actions" />
        </div>
      </div>
    </component>
    <slot />
  </component>
</template>

<style scoped>
.bk-hover-frame {
  position: relative;
  /* The frame stays behind the content of this element, also while an entrance animation runs. */
  isolation: isolate;
}

.bk-hover-frame__frame {
  position: absolute;
  z-index: -1;
  inset: calc(var(--bk-frame-top) * -1) calc(var(--bk-frame-side) * -1) calc(var(--bk-frame-side) * -1);
}

/* The surface of the frame. The corners next to the content have the same center as the corners of the content. */
.bk-hover-frame__frame::before {
  content: '';
  position: absolute;
  inset: 0;
  border: 1px solid var(--bk-line-solid);
  border-radius: calc(var(--bk-radius) + var(--bk-frame-side));
  border-bottom-right-radius: var(--hover-frame-radius-bottom-right, calc(var(--bk-radius) + var(--bk-frame-side)));
  border-bottom-left-radius: var(--hover-frame-radius-bottom-left, calc(var(--bk-radius) + var(--bk-frame-side)));
  background: color-mix(in srgb, hsl(var(--foreground)) 5%, hsl(var(--background)));
  box-shadow: 0 24px 60px -24px rgb(0 0 0 / 0.45);
}

/* The title and the actions line up with the edges of the content. */
.bk-hover-frame__bar {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  height: var(--bk-frame-top);
  padding-inline: var(--bk-frame-side);
}

/* A title in text stays on the edge of the content without the frame. Inside the frame, it needs more space from the round corner. */
.bk-hover-frame__title {
  min-width: 0;
  color: hsl(var(--muted-foreground));
  font-size: 0.75rem;
  translate: var(--hover-frame-title-inset, 0.375rem) 0;
}

/* The button is as far from the edge of the frame as the content, so it has the radius of the content, and its corner has the center of the frame corner. */
.bk-hover-frame__actions :deep(.bk-action) {
  border-radius: var(--bk-radius);
}

/* A hidden frame does not react to the pointer, so the empty space around the content does not show it. */
@media (hover: hover) {
  .bk-hover-frame__frame {
    pointer-events: none;
  }

  .bk-hover-frame__frame::before {
    opacity: 0;
    scale: 0.985;
    transition:
      opacity 0.2s ease,
      scale 0.3s var(--bk-ease-out);
  }

  .bk-hover-frame__title {
    translate: 0 0;
    transition: translate 0.3s var(--bk-ease-out);
  }

  .bk-hover-frame__actions {
    opacity: 0;
    transition: opacity 0.2s ease;
  }

  .bk-hover-frame:hover > .bk-hover-frame__frame,
  .bk-hover-frame:has(:focus-visible) > .bk-hover-frame__frame {
    pointer-events: auto;
  }

  .bk-hover-frame:hover > .bk-hover-frame__frame::before,
  .bk-hover-frame:has(:focus-visible) > .bk-hover-frame__frame::before {
    opacity: 1;
    scale: 1;
  }

  .bk-hover-frame:hover > .bk-hover-frame__frame .bk-hover-frame__title,
  .bk-hover-frame:has(:focus-visible) > .bk-hover-frame__frame .bk-hover-frame__title {
    translate: var(--hover-frame-title-inset, 0.375rem) 0;
  }

  .bk-hover-frame:hover > .bk-hover-frame__frame .bk-hover-frame__actions,
  .bk-hover-frame:has(:focus-visible) > .bk-hover-frame__frame .bk-hover-frame__actions {
    opacity: 1;
  }
}

@media (prefers-reduced-motion: reduce) {
  .bk-hover-frame__frame::before {
    scale: 1;
    transition: none;
  }

  .bk-hover-frame__title {
    transition: none;
  }
}
</style>
