<template>
 <nav
    class="navbar  "
    aria-label="main navigation"
  >
    <div class="navbar-menu">
      <router-link to="/" class="navbar-brand">
          <Logo width="48px" height="48px" />
        </router-link>
      <div  class="navbar-end">
        <ColorSchema /> 
        <LanguageDropdown />
      </div>
    </div>
  </nav>
</template>
<style lang="scss">
.navbar {
      top: 15px;
      height: 65px;
      margin: 0 auto;
      background-color: var(--white);
      font-family: var(--font);
      z-index: 99;
      transition: all 0.3s;
 
    
 
      .navbar-menu {
        display: contents;
        .navbar-end {
          display: flex;
          justify-content: flex-end;
          margin-left: auto;
         .navbar-item{
          display: flex;
          align-items: center;
         }
        }
      }

      .navbar-brand {
        
          position: absolute;
          display: block;
          width: 100%;
         
      }

      .navbar-burger {
        span {
          height: 2px;
        }
      }

      .navbar-menu {
        .navbar-item {
          .nav-link {
            position: relative;
            font-family: var(--font-alt);
            font-size: 0.9rem;
            color: var(--light-text);
            text-transform: capitalize;

            &::before {
              content: '';
              position: absolute;
              top: -4px;
              left: 2px;
              width: 50%;
              -webkit-transform-origin: right center;
              -ms-transform-origin: right center;
              transform-origin: right center;
              height: 3px;
              border-radius: 50px;
              background: var(--primary);
              -webkit-transform: scale(0, 1);
              -ms-transform: scale(0, 1);
              transform: scale(0, 1);
              -webkit-transition: -webkit-transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
              transition: -webkit-transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
              transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
              transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1),
                -webkit-transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
            }

            //Hover state
            &:hover,
            &.is-active {
              color: var(--dark-text);

              &::before {
                -webkit-transform-origin: left center;
                -ms-transform-origin: left center;
                transform-origin: left center;
                -webkit-transform: scale(1, 1);
                -ms-transform: scale(1, 1);
                transform: scale(1, 1);
              }
            }

            &.active {
              &::before {
                background: var(--primary);
              }
            }
          }

          .nav-hash {
            position: relative;
            font-family: var(--font-alt);
            font-size: 0.9rem;
            color: var(--light-text);
            text-transform: capitalize;

            &::before {
              content: '';
              position: absolute;
              top: -4px;
              left: 2px;
              width: 50%;
              -webkit-transform-origin: right center;
              -ms-transform-origin: right center;
              transform-origin: right center;
              height: 3px;
              border-radius: 50px;
              background: var(--primary);
              -webkit-transform: scale(0, 1);
              -ms-transform: scale(0, 1);
              transform: scale(0, 1);
              -webkit-transition: -webkit-transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
              transition: -webkit-transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
              transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
              transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1),
                -webkit-transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
            }

            //Hover state
            &:hover,
            &.is-active.active-hash {
              color: var(--dark-text);

              &::before {
                -webkit-transform-origin: left center;
                -ms-transform-origin: left center;
                transform-origin: left center;
                -webkit-transform: scale(1, 1);
                -ms-transform: scale(1, 1);
                transform: scale(1, 1);
              }
            }

            &.active {
              &::before {
                background: var(--primary);
              }
            }
          }
        }
      }
}

.is-dark {
    .navbar {
    
      background: color-mix(in oklab, var(--landing-xxx));

      .navbar-burger {
        span {
          background: var(--smoke-white);
        }
      }

      .navbar-item {
        .nav-link {
          &:hover,
          &.is-active {
            color: var(--white) !important;
          }

          &::before {
            background: var(--primary);
          }
        }
        .nav-hash {
          &:hover,
          &.is-active.active-hash {
            color: var(--white) !important;
          }

          &::before {
            background: var(--primary);
          }
        }
      }
    }
}
</style>

