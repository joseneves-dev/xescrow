<script setup lang="ts">
const isOpen = ref(false)
</script>

<template>
  <nav
    class="burger"
    aria-label="main navigation"
  >
    <div
            class="navbar-burger"
            :class="[isOpen && 'is-active']"
            @click="() => { isOpen = !isOpen}"
          >
            <span></span>
            <span></span>
            <span></span>
    </div>
  </nav>
  <div :class="[isOpen && 'is-active']" class="mobile-main-sidebar">
    <div class="inner">
      <slot name="top"></slot>
      <div class="center">
        <slot name="center"></slot>
      </div>
      <div class="bottom">
        <slot name="bottom"></slot>
      </div>
    </div>
  </div>

  <div v-if="isOpen" class="mobile-overlay" @click="() => { isOpen = !isOpen}"></div>
</template>

<style lang="scss">
.top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 30px;
  .left {
    left: 10px; /* Adjust the left offset as needed */
    top: 10px; /* Adjust the top offset as needed */
  }

  .right {
    display: flex;
    align-items: center;
  }
}


.multiline-links {
  .multiline-link {
    &:hover {
      background: color-mix(in oklab, var(--landing-yyy), black 6%);

      .iconify {
        color: var(--smoke-white);
      }

      span {
        color: var(--smoke-white);
      }
    }

    &.is-active {
      background: color-mix(in oklab, var(--landing-yyy), black 12%);
      border-color: color-mix(in oklab, var(--landing-yyy), white 6%);

      &:hover,
      &:focus {
        background: color-mix(in oklab, var(--landing-yyy), black 12%);
      }

      .iconify {
        color: var(--smoke-white);
      }

      span {
        color: var(--smoke-white);
      }
    }

    &.router-link-active {
              background: color-mix(in oklab, var(--landing-yyy), black 12%);
              border-color: color-mix(in oklab, var(--landing-yyy), white 6%);

              &:hover,
              &:focus {
                background: color-mix(in oklab, var(--landing-yyy), black 12%);
              }

              .iconify {
                color: var(--smoke-white);
              }

              span {
                color: var(--smoke-white);
              }
            }

    .iconify {
      color: var(--light-text);
    }

    span {
      color: var(--light-text);
    }
  }
}

  .multiline-links {
        display: flex;
        flex-wrap: wrap; /* Allow flex items to wrap to the next line */
        justify-content: space-between; /* Distribute items evenly across the container */
        max-width: 580px;
        margin: 5% auto; /* Center the container horizontally */

        .multiline-link {
          flex-basis: calc(25% - 8px); 
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
            height: 20px;
            width: 20px;
            color: color-mix(in oklab, var(--light-text), white 6%);
            stroke-width: 1.6px;
            transition: stroke 0.3s;
          }

          span {
            display: block;
            font-family: var(--font);
            font-size: 0.65rem;
            color: var(--muted-grey);
            text-transform: uppercase;
            transition: all 0.3s; // transition-all test
            cursor: pointer;
          }
        }
      }

      .is-dark {

        .multiline-links {
          .multiline-link {
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
      }
 
/* ==========================================================================
1. Burger Navbar
========================================================================== */

.burger {
  top:auto ;
  bottom: 15px ;
  left: 50%;
  transform: translate(-50%, -50%);
  position: fixed;
  z-index: 100;
  box-shadow: 0 0 8px 0 rgba(0, 0, 0, 0.12);
  transition: all 0.3s;
  border-radius: 50%; /* Make it rounded */
  background-color: var(--primary) !important;

  .navbar-burger {
      background: transparent !important;

      &.is-active,
      &:hover {
        background: transparent !important;
      }
      span{
        background-color: white;
      }
  }
}

/* ==========================================================================
2. Mobile Navbar Dark mode
========================================================================== */

.is-dark {
  .burger {
    background: var(--dark-sidebar);
  }

  .is-notification {
    &.is-active {
      .navbar-link {
        .iconify {
          color: var(--primary) !important;
        }
      }
    }

    .navbar-dropdown {
      background: var(--dark-sidebar) !important;
      border-color: var(--dark-sidebar) !important;

      .heading {
        border-color: color-mix(in oklab, var(--dark-sidebar), white 12%) !important;

        .heading-right {
          .notification-link {
            color: var(--primary) !important;
          }
        }
      }

      .inner {
        .notification-list {
          li {
            .notification-item {
              .user-content {
                p {
                  color: var(--dark-dark-text) !important;
                }
              }
            }
          }
        }
      }
    }
  }
}

@media (max-width: 1023px) {
  .burger {
    display: flex !important;
    .navbar-burger{
      display: block;
    }
  }
}
.mobile-overlay {
  background: rgb(0 0 0 / 30%);
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 20;
  backdrop-filter: blur(1px);
}
.mobile-main-sidebar {
  position: fixed;
  bottom: 0; /* Ancorando a barra lateral na parte inferior */
  left: 0;
  width: 100%; /* Preenchendo toda a largura */
  height: 0; /* Começando com altura zero */
  background: var(--white);
  border-top: 1px solid var(--fade-grey);
  border-right: 1px solid var(--fade-grey);
  z-index: 99;
  overflow: hidden; /* Ocultar o conteúdo que excede a altura zero */
  transition: height 0.3s, transform 0.3s; /* Adicionando transições para altura e transform */


  &.is-active {
    height: 100%; /* Quando estiver ativa, expande a altura para conteúdo variável */
    transform: translateY(0); /* Move a barra lateral para cima */
  }

  .inner {
    height: 100%;
    width: 100%;
    position: relative;

  }
}

.is-dark {
  .mobile-main-sidebar {
    background: color-mix(in oklab, var(--dark-sidebar), black 6%);
    border-color: color-mix(in oklab, var(--dark-sidebar), white 1%) !important;
  }
}

.mobile-subsidebar {
  position: fixed;
  left: 0;
  height: 100%;
  width: 280px;
  background: var(--white);
  border-top: 1px solid var(--fade-grey);
  border-right: 1px solid var(--fade-grey);
  z-index: 99;
  .inner {
    position: relative;
    height: 100%;
    width: calc(100% - 60px);
    margin-left: 60px;
    .submenu {
      height: calc(100% - 70px);
      overflow-y: auto;
      margin-top: 10px;
      padding: 0 20px 20px;
    }
   
  }
}
.is-dark {
  .mobile-subsidebar {
    background: color-mix(in oklab, var(--dark-sidebar), white 2%);
    border-color: color-mix(in oklab, var(--dark-sidebar), white 4%);
    .submenu {
      li {
        &.is-active {
          a {
            color: var(--primary) !important;
          }
        }
        &.has-children {
          &.active {
            .collapse-wrap {
              > a {
                color: var(--smoke-white);
              }
            }
          }
        }
      }
    }
  }
}


.top {
  height: 20%;  
  display: flex;
  align-items: center;
}


.center {
  height: 50%;
}
.bottom {
  height: 20%;
  display: flex;
  justify-content: center;
}

</style>
