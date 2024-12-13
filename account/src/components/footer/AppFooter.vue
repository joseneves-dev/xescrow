<script setup lang="ts">
import { useApi } from '/@src/api/api'
import { useAppConfigurations } from '/@appStores/appConfigurations'

const { t } = useI18n()

const api = useApi()
const appConfigurations = useAppConfigurations()

const currentYear = ref<number>(new Date().getFullYear())

await api.get('/csrf')
.then((response) => {
}).catch((error) => {
})

</script>
<template>
  <footer class="footer">
    <div class="container">
      <div class="columns footer-body">
        <div class="column is-5">
          <div class="p-t-10 p-b-10">
            <Logo width="32px" height="32px" />

            <div class="footer-description p-t-10 p-b-10">
              <p>{{ t('footer.description') }}</p>
            </div>
          </div>
          <div>
            <div class="social-links p-t-10 p-b-10">
              <a href="https://x.com/twitter" >
                @xescrow.app
              </a>
            </div>
          </div>
        </div>
        <div class="column is-6 is-offset-1">
          <div class="columns is-flex-tablet-p">
            <div class="column">
              <ul class="footer-column">
                <li class="column-header">XESCROW</li>
                <li class="column-item"><a href="#">{{ t('footer.menu.subscribe') }}</a></li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <div class="footer-copyright">
        <p>
          {{ t('footer.copyright', {year: currentYear}) }}
        </p>
      </div>
    </div>
  </footer>
  <VOfflinePrompt v-if="appConfigurations.isOffline" />
</template>
<style lang="scss">
.footer {
  margin-top: auto;
  position: relative;
  padding-bottom: 0 !important;

  .grids {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 8rem;
  }

  .footer-head {
    padding-bottom: 3rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: 1px solid color-mix(in oklab, var(--fade-grey), black 4%);

    .head-text {
      h3 {
        font-family: var(--font);
        font-size: 1.8rem;
        color: var(--dark-text);
      }

      p {
        font-size: 1.1rem;
        color: var(--light-text);
      }
    }

    .head-action {
      .buttons {
        .button {
          &.action-button {
            height: 36px;
            min-width: 140px;
          }

          &.chat-button {
            background: transparent;
            border: none;
            outline: none;
            box-shadow: none;
            color: var(--primary);
            font-weight: 500;
          }
        }
      }
    }
  }

  .footer-body {
    padding-top: 3rem;

    .footer-column {
      padding-top: 20px;

      .column-header {
        font-family: var(--font-alt);
        text-transform: uppercase;
        color: var(--dark-text);
        font-size: 1rem;
        font-weight: 700;
        margin: 10px 0;
      }

      .column-item {
        padding-bottom: 10px;

        a {
          font-family: var(--font);
          color: var(--light-text);

          &:hover {
            color: var(--primary);
          }
        }
      }
    }

    .social-links {
      display: flex;
      justify-content: flex-start;
      align-items: center;

      a {
        color: var(--light-text);
        margin: 0 5px;

        &:hover {
          color: var(--primary);
        }
      }
    }

    .footer-description {
      color: var(--light-text);
    }

    .moto {
      color: var(--light-text);
    }

    .small-footer-logo {
      height: 36px;
    }
  }

  .footer-copyright {
    font-family: var(--font);
    color: var(--light-text);
    padding: 4rem 0 2rem 0;

    a {
      color: var(--light-text);

      &:hover {
        color: var(--primary);
      }
    }
  }
}

.is-dark {
  .footer {
    background: color-mix(in oklab, var(--landing-xxx), white 8%);

    .footer-head {
      border-color: color-mix(in oklab, var(--landing-xxx), white 18%);

      .head-text {
        h3 {
          color: var(--dark-dark-text);
        }

        p {
          font-size: 1.1rem;
          color: var(--light-text);
        }
      }

      .head-action {
        .buttons {
          .button {
            &.action-button {
              background: var(--primary);
              border-color: var(--primary);
            }

            &.chat-button {
              color: var(--primary);
              background: none !important;
            }
          }
        }
      }
    }

    .footer-body {
      .footer-column {
        .column-header {
          color: var(--dark-dark-text);
        }

        .column-item {
          a:hover {
            color: var(--primary);
          }
        }
      }

      .social-links {
        a:hover {
          color: var(--primary);
        }
      }
    }

    .footer-copyright {
      a {
        &:hover {
          color: var(--primary);
        }
      }
    }
  }
}
</style>