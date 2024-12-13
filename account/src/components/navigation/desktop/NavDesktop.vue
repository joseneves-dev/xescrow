<script setup lang="ts">
const { y } = useWindowScroll()

const isScrolling = computed(() => {
  return y.value > 15
})
</script>

<template>
  <div class="navbar is-transparent" :class="[isScrolling && 'is-scrolled']">
    <div class="navbar-inner">
      <div class="left">
        <slot name="left"></slot>
      </div>
      <div class="center">
        <slot name="center"></slot>
      </div>
      <div class="right">
        <slot name="right"></slot>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
@import '/@src/scss/abstracts/all';
@import '/@src/scss/layout/responsive';

.navbar {
  top: 0;
  left: 0;
  width: 100%;
  height: 80px;
  padding: 10px 0 5px 0;
  background: var(--white);
  transition: all 0.3s; // transition-all test
  border-bottom: 1px solid var(--fade-grey);
  z-index: 100;

  &.is-transparent {
    background: transparent;
    box-shadow: none;
    border-bottom-color: transparent;

    &.is-solid,
    &.is-scrolled {
      position: fixed;
      background: var(--white);
      border-bottom-color: var(--fade-grey);
    }

    &.is-solid {
      box-shadow: none !important;
    }

    &.is-scrolled {
      position: fixed;
      box-shadow: 0 0 8px 0 rgb(0 0 0 / 12%);
    }
  }

  .navbar-inner {
    //position: relative;
    width: 100%;
    display: flex;
    justify-content: space-between;

    .left {
      display: flex;
      align-items: center;
      width: 25%;

      .brand {
        margin-left: 10px;
        display: flex;
        align-items: center;

        img {
          display: block;
          min-width: 38px;
          height: 36px;
        }

        span {
          font-family: var(--font);
          font-size: 0.95rem;
          color: var(--muted-grey);
          letter-spacing: 1px;
          max-width: 50px;
          line-height: 1.2;
          margin-left: 8px;
        }
      }

      .separator {
        height: 36px;
        width: 2px;
        border-right: 1px solid color-mix(in oklab, var(--fade-grey), black 4%);
        margin: 0 20px 0 16px;
      }
    }

    .center {
      display: flex;
      align-items: center;
      justify-content: center;
      flex-grow: 2;
      width: 50%;      
      min-height: 80px;


      .centered-links {
        display: flex;
        width: 100%;
        max-width: 580px;

        .centered-link {
          flex: 1 1 0;
          text-align: center;
          padding: 10px 0;
          border-radius: 8px;
          border: 1px solid transparent;
          margin: 0 4px;
          transition: all 0.3s; // transition-all test

          &:hover {
            background: color-mix(in oklab, var(--fade-grey), white 4%);
          }

          &.is-active {
            background: var(--white);
            border-color: color-mix(in oklab, var(--fade-grey), black 3%);
            box-shadow: var(--light-box-shadow);

            &:hover,
            &:focus {
              background: var(--white);
            }

            .iconify {
              color: var(--primary);
            }

            span {
              color: color-mix(in oklab, var(--primary), black 8%);
            }
          }

          &.router-link-active {
            background: var(--white);
            border-color: color-mix(in oklab, var(--fade-grey), black 3%);
            box-shadow: var(--light-box-shadow);

            &:hover,
            &:focus {
              background: var(--white);
            }

            .iconify {
              color: var(--primary);
            }

            span {
              color: color-mix(in oklab, var(--primary), black 8%);
            }
          }

          .iconify {
            font-size: large;
            height: 20px;
            width: 20px;
            color: color-mix(in oklab, var(--light-text), white 6%);
            stroke-width: 1.6px;
            transition: stroke 0.3s;
          }

          span {
            display: block;
            font-family: var(--font);
            font-size: 0.85rem;
            color: var(--muted-grey);
            text-transform: uppercase;
            transition: all 0.3s; // transition-all test
            cursor: pointer;
          }
        }
      }
    }

    .right {
      display: flex;
      align-items: center;
      justify-content: flex-end;
      width: 25%;

      .icon-link {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 34px;
        width: 34px;
        border-radius: var(--radius-rounded);
        margin: 0 4px;
        transition: all 0.3s; // transition-all test

        &:hover {
          background: var(--white);
          border-color: var(--fade-grey);
          box-shadow: var(--light-box-shadow);
        }

        .iconify {
          height: 18px;
          width: 18px;
          stroke-width: 1.6px;
          color: var(--light-text);
          transition: stroke 0.3s;
          vertical-align: 0;
          transform: none;
        }
      }

      .profile-dropdown {
        > img {
          height: 32px;
          width: 32px;
          border-radius: var(--radius-rounded);
          margin: 0 4px;
          cursor: pointer;
        }
      }
    }
  }
}

/* ==========================================================================
4. Webapp Navbar Dark mode
========================================================================== */

.is-dark {
  .navbar{
    background: color-mix(in oklab, var(--dark-sidebar), black 2%);
    border-color: color-mix(in oklab, var(--dark-sidebar), white 1%);

    &.is-transparent {
      background: transparent;
      box-shadow: none;
      border-bottom-color: transparent;

      &.is-solid,
      &.is-scrolled {
        position: fixed;
        background: color-mix(in oklab, var(--dark-sidebar), black 2%);
        border-color: color-mix(in oklab, var(--dark-sidebar), white 1%);
      }
    }

    .navbar-inner {
      .left {
        .separator {
          border-color: color-mix(in oklab, var(--dark-sidebar), white 12%);
        }
      }

      .center {
        .centered-links {
          .centered-link {
            &:hover {
              background: color-mix(in oklab, var(--dark-sidebar), white 2%);
            }

            &.is-active {
              background: color-mix(in oklab, var(--dark-sidebar), white 2%);
              border-color: color-mix(in oklab, var(--dark-sidebar), white 12%);

              &:hover,
              &:focus {
                background: color-mix(in oklab, var(--dark-sidebar), white 2%);
              }

              span {
                color: var(--primary);
              }

              .iconify {
                color: var(--primary);
              }
            }
            &.router-link-active {
              background: color-mix(in oklab, var(--dark-sidebar), white 2%);
              border-color: color-mix(in oklab, var(--dark-sidebar), white 12%);

              &:hover,
              &:focus {
                background: color-mix(in oklab, var(--dark-sidebar), white 2%);
              }

              span {
                color: var(--primary);
              }

              .iconify {
                color: var(--primary);
              }
            }
          }
        }

        .centered-button {
          > .button {
            background: transparent !important;
            border: none;

            &:hover,
            &:focus {
              background: color-mix(in oklab, var(--dark-sidebar), white 3%) !important;
            }
          }
        }
      }

      .right {
        .icon-link {
          background: color-mix(in oklab, var(--dark-sidebar), black 2%);

          &:hover,
          &:focus {
            background: color-mix(in oklab, var(--dark-sidebar), white 2%);
          }
        }
      }
    }
  }

}
</style>
