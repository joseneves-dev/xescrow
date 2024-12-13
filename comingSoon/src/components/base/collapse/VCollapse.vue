<script setup lang="ts">
export interface VCollapseItem {
  title: string
  content: string
  value?: any
  url?: string
}
export interface VCollapseProps {
  items: VCollapseItem[]
  itemOpen?: number
  withChevron?: boolean
}

const props = withDefaults(defineProps<VCollapseProps>(), {
  items: () => [],
  itemOpen: undefined,
})

const internalItemOpen = ref<number | undefined>(props.itemOpen)
const toggle = (key: number) => {
  if (internalItemOpen.value === key) {
    internalItemOpen.value = undefined
    return
  }

  internalItemOpen.value = key
}
</script>

<template>
  <div class="collapse-container">
    <details
      v-for="(item, key) in items"
      :key="key"
      :class="[withChevron && 'has-chevron', !withChevron && 'has-plus']"
      :open="internalItemOpen === key || undefined"
      class="collapse"
    >
      <slot
        name="collapse-item"
        :item="item"
        :index="key"
        :toggle="toggle"
      >
        <summary
          class="collapse-header"
          tabindex="0"
          role="button"
          @keydown.enter.prevent="() => toggle(key)"
          @click.prevent="() => toggle(key)"
        >
          <h3>
            <slot
              name="collapse-item-summary"
              :item="item"
              :index="key"
              :toggle="toggle"
            >
              {{ item.title }}
            </slot>
          </h3>
          <div class="collapse-head-info">
            <slot
              name="collapse-item-head"
              :item="item"
              :index="key"
            />
            <div class="collapse-icon">
              <VIcon
                v-if="withChevron"
                icon="lucide:chevron-down"
              />
              <VIcon
                v-else-if="!withChevron"
                icon="lucide:plus"
              />
            </div>
          </div>
        </summary>
        <div class="collapse-content">
          <slot
            name="collapse-item-content"
            :item="item"
            :index="key"
            :toggle="toggle"
          >
            <p>
              {{ item.content }}
            </p>
          </slot>
        </div>
      </slot>
    </details>
  </div>
</template>

<style lang="scss">
@import '/@src/scss/abstracts/all';

.collapse-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: flex-start; /* Ensure items align independently */

  .collapse {
    @include app-s-card;

    width: 48%; /* 48% width + some space between them */
    box-sizing: border-box;
    margin-bottom: 1.5rem;
    flex: unset; /* Remove flex: 1; from the mixin */
    display: block; /* Override inline-block display */

    &.has-plus {
      &[open] {
        .collapse-header {
          .collapse-icon {
            transform: rotate(calc(var(--transform-direction) * 45deg));
          }
        }

        .collapse-content {
          max-height: 500px; /* Adjust max-height based on expected content size */
          overflow: visible; /* Allow content to expand fully */
        }
      }
      
      .collapse-content {
          padding: 0 20px 20px;
          overflow: hidden; /* Prevent expanding content from affecting other items */
          transition: max-height 0.3s ease; /* Smooth transition for collapsing/expanding */
          max-height: 0; /* Start with the content collapsed */
        }
    }

    &.has-chevron {
      &[open] {
        .collapse-header {
          .collapse-icon {
            transform: rotate(calc(var(--transform-direction) * 180deg));
          }
        }

        .collapse-content {
          display: block;
        }
      }
    }

    &[open] {
      .collapse-icon {
        border-color: color-mix(in oklab, var(--fade-grey), black 3%) !important;
        box-shadow: var(--light-box-shadow);
      }
    }

    .collapse-header {
      position: relative;
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: 60px;
      padding: 0 20px;
      cursor: pointer;

      h3 {
        font-family: var(--font-alt);
        font-size: 0.9rem;
        font-weight: 600;
        color: var(--dark-text);
      }

      .collapse-head-info {
        display: flex;
        align-items: center;
        justify-content: flex-end;
      }

      .collapse-icon {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 30px;
        width: 30px;
        background: var(--white);
        border-radius: var(--radius-rounded);
        border: 1px solid transparent;
        transition: all 0.3s; // transition-all test

        > span {
          display: block;
          height: 16px;
          width: 16px;
        }

        .iconify {
          height: 16px;
          width: 16px;
          color: var(--light-text);
        }
      }
    }

    .collapse-content {
      display: none;
      padding: 0 20px 20px;
      color: var(--light-text);
      font-family: var(--font);

      p:not(:last-child) {
        margin-bottom: 12px;
      }
    }
  }
}
.is-dark {
  .collapse {
    @include app-card--dark;

    &[open] {
      .collapse-header {
        .collapse-icon {
          background: color-mix(in oklab, var(--dark-sidebar), white 2%);
          border-color: color-mix(in oklab, var(--dark-sidebar), white 4%) !important;
        }
      }
    }

    .collapse-header {
      h3 {
        color: var(--dark-dark-text);
      }

      .collapse-icon {
        background: color-mix(in oklab, var(--dark-sidebar), white 6%);
        border-color: color-mix(in oklab, var(--dark-sidebar), white 6%);
      }
    }
  }
}
</style>
