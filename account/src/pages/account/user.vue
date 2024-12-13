<script setup lang="ts">

import { useWindowSize } from '@vueuse/core'
const { width, height } = useWindowSize()
</script>
<template>
  <div class="page-content-inner">
    <div class="account-wrapper">
      <div class="columns">
        <div class="column is-3" v-if="width >= 1024">
          <SidebarDesktop />
        </div>
        <div class="column">
          <RouterView v-slot="{ Component }">
            <transition name="translate-page-y" mode="in-out">
              <component :is="Component" />
            </transition>
          </RouterView>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
@import '/@src/scss/abstracts/all';

.account-wrapper {
  padding-bottom: 60px;
  .account-box {
    @include app-s-card;
    &.is-navigation {
      .media-flex-center {
        padding-bottom: 20px;
        .flex-meta {
          span {
            &:first-child {
              font-size: 1.3rem;
            }
          }
        }
      }
      .account-menu {
        margin: 10px;
        
        .account-menu-item {
          display: flex;
          align-items: center;
          padding: 12px 16px;
          border: 1px solid transparent;
          border-radius: 8px;
          margin-bottom: 5px;
          transition: all 0.3s; // transition-all test
          &.router-link-active {
            box-shadow: var(--light-box-shadow);
            border-color: color-mix(in oklab, var(--fade-grey), black 3%);
            span,
            .iconify {
              color: var(--primary);
            }
            .end {
              display: block;
            }
          }
          &:not(.router-link-active) {
            &:hover {
              background: color-mix(in oklab, var(--fade-grey), white 3%);
            }
          }
          .iconify {
            margin-right: 8px;
            font-size: 1.1rem;
            color: var(--light-text);
            &.fas,
            .fal,
            .far {
              font-size: 0.9rem;
            }
          }
          span {
            margin-left: 10px;
            font-family: var(--font-alt);
            font-size: 0.95rem;
            color: var(--dark-text);
          }
          .end {
            margin-left: auto;
            display: none;
          }
        }
      }
    }
    &.is-form {
      padding: 0;
      &.is-footerless {
        padding-bottom: 20px;
      }
      .form-head,
      .form-foot {
        padding: 12px 4.5%;
        .form-head-inner,
        .form-foot-inner {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
      }
      .form-head {
        border-bottom: 1px solid color-mix(in oklab, var(--fade-grey), black 3%);
        transition: all 0.3s; // transition-all test
        &.is-stuck {
          background: var(--white);
          padding-right: 80px;
          border-left: 1px solid color-mix(in oklab, var(--fade-grey), black 3%);
        }
        .left {
          h3 {
            font-family: var(--font-alt);
            font-size: 1.2rem;
            line-height: 1.3;
          }
          p {
            font-size: 0.95rem;
          }
        }
      }
      .form-foot {
        border-top: 1px solid color-mix(in oklab, var(--fade-grey), black 3%);
      }
      .form-body {
        padding: 20px;
        .fieldset {
          padding: 20px;
          margin: 0 auto;
          .fieldset-heading {
            margin-bottom: 20px;
            h4 {
              font-family: var(--font-alt);
              font-weight: 600;
              font-size: 1rem;
            }
            p {
              font-size: 0.9rem;
            }
          }
          .columns {
            &.no-padding {
              padding: 10px 0px !important;
            }
            padding: 10px 20px;

            .column {
              padding-top: 0.25rem;
              padding-bottom: 0.25rem;
            }
          }
          .v-avatar {
            position: relative;
            display: block;
            margin: 0 auto;
            .edit-button {
              position: absolute;
              bottom: 0;
              right: 0;
            }
          }
          .setting-list {
            .setting-form {
              text-align: center;
              .filepond-profile-wrap {
                margin: 0 auto 10px !important;
              }
            }
            .setting-item {
              display: flex;
              align-items: center;
              margin-bottom: 24px;
              padding: 20px 10px 0px;

              .icon-wrap {
                position: relative;
                display: flex;
                align-items: center;
                justify-content: center;
                width: 40px;
                min-width: 40px;
                height: 40px;
                border-radius: var(--radius-rounded);
                background: color-mix(in oklab, var(--fade-grey), white 2%);
                border: 1px solid color-mix(in oklab, var(--fade-grey), black 3%);
                color: var(--light-text);
                &.has-img {
                  border-color: var(--primary);
                  img {
                    width: 36px;
                    min-width: 36px;
                    height: 36px;
                  }
                }
                .iconify {
                  font-size: 1.2rem;
                }
              }
              img {
                display: block;
                width: 50px;
                min-width: 50px;
                height: 50px;
                border-radius: var(--radius-rounded);
                border: 1px solid transparent;
              }
              .meta {
                margin-left: 10px;
                > span {
                  font-family: var(--font);
                  display: block;
                  &:first-child {
                    font-family: var(--font-alt);
                    font-weight: 600;
                    color: var(--dark-text);
                    font-size: 0.9rem;
                  }
                  &:nth-child(2),
                  &:nth-child(3) {
                    font-size: 0.85rem;
                    color: var(--light-text);
                    .iconify {
                      position: relative;
                      top: -2px;
                      font-size: 4px;
                      margin: 0 6px;
                    }
                  }
                  &:nth-child(3) {
                    color: var(--primary);
                  }
                  span {
                    display: inline-block;
                  }
                }
              }
              .end {
                margin-left: auto;
              }
            }
          }
        }
      }
    }
  }
}
.is-dark {
  .account-wrapper {
    .account-box {
      @include app-card--dark;
      &.is-navigation {
        .account-menu {
          .account-menu-item {
            &.router-link-active {
              background: var(--dark-sidebar-light-8);
              border-color: color-mix(in oklab, var(--dark-sidebar), white 12%);
              i,
              span {
                color: var(--primary);
              }
            }
            &:not(.router-link-active) {
              &:hover {
                background: color-mix(in oklab, var(--dark-sidebar), white 10%);
              }
            }
            span {
              color: var(--dark-dark-text);
            }
          }
        }
      }
      &.is-form {
        .form-head,
        .form-foot {
          border-color: color-mix(in oklab, var(--dark-sidebar), white 12%);
        }
        .form-head {
          &.is-stuck {
            background: var(--dark-sidebar);
            border-color: color-mix(in oklab, var(--dark-sidebar), white 6%);
          }
          .left {
            h3 {
              color: var(--dark-dark-text);
            }
          }
        }
        .form-body {
          .fieldset {
            .fieldset-heading {
              h4 {
                color: var(--dark-dark-text);
              }
            }
            .setting-list {
              .setting-item {
                > img,
                > .icon-wrap,
                > .icon-wrap img {
                  border-color: color-mix(in oklab, var(--dark-sidebar), white 12%);
                }
                > .icon-wrap {
                  background: color-mix(in oklab, var(--dark-sidebar), white 2%);
                }
                .meta {
                  > span {
                    &:nth-child(3) {
                      color: var(--primary);
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
}
</style>