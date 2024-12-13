<script setup lang="ts">
import { useWarning } from "/@userStores/warning";
import { useUser } from "/@userStores/user";

const { t } = useI18n();
const warning = useWarning();
const user = useUser();

const open = ref<Boolean>(warning?.phoneNumber ? true : false);
const skipVerification = ref<Boolean>(
  Boolean(sessionStorage.getItem("skipPhone")) ?? false,
);

const close = async () => {
  open.value = false;
  if (!sessionStorage.getItem("skipPhone")) {
    useSessionStorage("skipPhone", true);
  } else {
    sessionStorage.setItem("skipPhone", "true");
  }
};
const userName = ref<string>(
  user?.identity?.firstName + " " + user?.identity?.lastName,
);

onBeforeMount(async () => {
  if (skipVerification.value) {
    open.value = false;
  }
});
</script>

<template>
  <div class="personal-dashboard personal-dashboard-v2">
    <div class="columns is-multiline">
      <div class="column is-12">
        <div class="dashboard-header">
          <div class="user-meta is-dark-bordered-12">
            <h3 class="title is-4 is-narrow is-bold">
              {{ t("pages.dashboard.welcome", { userName: userName }) }}
            </h3>
          </div>
        </div>
      </div>
    </div>
    <VMessage color="primary">
      <div>
        <span class="pr-1"
          >Welcome, this is the teste account to xescrow.app</span
        >
      </div>
    </VMessage>
    <VMessage color="primary">
      <div>
        <strong class="pr-1">Wallet</strong>
        <span
          >The wallet button in the navigation panel, can start any
          transaction</span
        >
      </div>
    </VMessage>
    <VMessage color="primary">
      <div>
        <strong class="pr-1">Escrow</strong>
        <span
          >The escrow button in the navigation panel, can dispute any
          transaction if the state is initialize.</span
        >
      </div>
    </VMessage>
  </div>
  <VModal
    v-if="warning?.phoneNumber"
    :open="open"
    title=""
    size="none"
    actions="center"
    noheader
    nofooter
    noclose
  >
    <template #content>
      <UpdatePhoneNumber @close="close" />
    </template>
  </VModal>
</template>

<style lang="scss">
@import "/@src/scss/abstracts/all";

.is-navbar {
  .personal-dashboard {
    margin-top: 30px;
  }
}

.personal-dashboard-v2 {
  .dashboard-header {
    @include app-s-card();

    display: flex;
    align-items: center;
    padding: 30px;

    .user-meta {
      padding: 0 3rem;
      border-right: 1px solid color-mix(in oklab, var(--fade-grey), black 3%) h3 {
        max-width: 180px;
      }
    }

    .user-action {
      padding: 0 3rem;
    }

    .cta {
      position: relative;
      flex-grow: 2;
      max-width: 275px;
      margin-left: auto;
      background: color-mix(in oklab, var(--primary), white 8%);
      padding: 20px;
      border-radius: var(--radius-large);
      box-shadow: var(--primary-box-shadow);
      .lnil,
      .lnir {
        position: absolute;
        bottom: 1rem;
        right: 1rem;
        font-size: 4rem;
        opacity: 0.3;
      }

      .link {
        font-family: var(--font-alt);
        display: block;
        font-weight: 500;
        margin-top: 0.5rem;

        &:hover {
          color: var(--smoke-white);
          opacity: 0.6;
        }
      }
    }
  }

  .dashboard-card {
    @include app-s-card();

    padding: 30px;

    &:not(:last-child) {
      margin-bottom: 1.5rem;
    }

    .card-head {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 20px;

      h3 {
        font-family: var(--font-alt);
        font-size: 1rem;
        font-weight: 600;
        color: var(--dark-text);
        margin-bottom: 0;
      }
    }

    .active-projects,
    .active-team,
    .active-list {
      padding: 10px 0;
    }
  }
}

.is-dark {
  .personal-dashboard-v2 {
    .dashboard-header,
    .dashboard-card {
      @include app-card--dark();
    }

    .home-header {
      .cta {
        background: var(--primary-light-2);
        box-shadow: var(--primary-box-shadow);
      }
    }
  }
}

@media (max-width: 1023px) {
  .personal-dashboard-v2 {
    .dashboard-header {
      flex-direction: column;
      text-align: center;

      .v-avatar {
        margin-bottom: 10px;
      }

      .user-meta {
        padding-top: 10px;
        padding-bottom: 10px;
        border: none;
      }

      .user-action {
        padding-bottom: 30px;
      }

      .cta {
        margin-left: 0;
      }
    }

    .active-projects {
      .media-flex-center {
        .flex-end {
          .avatar-stack {
            display: none;
          }
        }
      }
    }
  }
}
</style>
