<template>
  <div class="app-layout">
    <SkipLink />
    <AccessibilityControls />

    <header class="site-header" role="banner">
      <div class="container">
        <h1 class="site-title">
          <NuxtLink to="/" aria-label="Go to home page">
            Accessible NFC Tags
          </NuxtLink>
        </h1>
      </div>
    </header>

    <main id="main-content" class="site-main" role="main" tabindex="-1">
      <div class="container">
        <slot />
      </div>
    </main>

    <footer class="site-footer" role="contentinfo">
      <div class="container">
        <p>
          &copy; {{ currentYear }} Accessible NFC Tags.
          <span class="sr-only">This website provides accessible content for NFC-tagged exhibits.</span>
        </p>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
const currentYear = new Date().getFullYear()
</script>

<style scoped >
.app-layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.site-header {
  background-color: var(--color-primary, #0066cc);
  color: white;
  padding: 1.5rem 0;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

  .container {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .site-title {
    margin: 0;
    font-size: 1.5rem;
    font-weight: 700;

    a {
      color: white;
      text-decoration: none;

      &:hover {
        text-decoration: underline;
      }

      &:focus {
        outline: 3px solid white;
        outline-offset: 4px;
      }
    }
  }
}

.site-main {
  flex: 1;
  padding: 2rem 0;

  &:focus {
    outline: none;
  }
}

.site-footer {
  background-color: var(--color-bg-alt, #f5f5f5);
  border-top: 1px solid var(--color-border, #cccccc);
  padding: 2rem 0;
  margin-top: auto;

  p {
    margin: 0;
    text-align: center;
    color: var(--color-text-light, #4a4a4a);
  }
}

@media (min-width: 768px) {
  .site-header {
    .site-title {
      font-size: 2rem;
    }
  }
}
</style>
