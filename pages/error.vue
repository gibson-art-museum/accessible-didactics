<template>
  <div class="error-page">
    <div class="error-content">
      <h1 class="error-title">
        <span class="error-code" aria-label="Error code">{{
          error?.statusCode || 404
        }}</span>
        <span class="sr-only">Error:</span>
        {{ errorTitle }}
      </h1>

      <p class="error-message">
        {{ errorMessage }}
      </p>

      <div class="error-actions">
        <NuxtLink to="/" class="button"> Go to Home Page </NuxtLink>

        <button
          type="button"
          class="button button-secondary"
          @click="handleBack"
        >
          Go Back
        </button>
      </div>

      <section class="error-help" aria-labelledby="help-heading">
        <h2 id="help-heading">Need Help?</h2>
        <ul>
          <li>Check that the NFC tag ID is correct</li>
          <li>Try scanning the tag again</li>
          <li>
            Browse available tags from the <NuxtLink to="/">home page</NuxtLink>
          </li>
          <li>Contact support if the problem persists</li>
        </ul>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
interface ErrorProps {
  error: {
    statusCode?: number
    statusMessage?: string
    message?: string
  }
}

const props = defineProps<ErrorProps>()

const errorTitle = computed(() => {
  const code = props.error?.statusCode || 404
  switch (code) {
    case 404:
      return 'Page Not Found'
    case 500:
      return 'Server Error'
    default:
      return 'Something Went Wrong'
  }
})

const errorMessage = computed(() => {
  const code = props.error?.statusCode || 404
  switch (code) {
    case 404:
      return "We couldn't find the NFC tag you're looking for. The tag ID might be incorrect, or the content may not exist yet."
    case 500:
      return 'An error occurred while loading the page. Please try again later.'
    default:
      return props.error?.message || 'An unexpected error occurred.'
  }
})

function handleBack() {
  if (typeof window !== 'undefined' && window.history.length > 1) {
    window.history.back()
  } else {
    navigateTo('/')
  }
}

// Set page metadata
useHead({
  title: `${errorTitle.value} - Gibson Accessible Exhibition Didactics`,
  meta: [
    {
      name: 'robots',
      content: 'noindex',
    },
  ],
})
</script>

<style scoped>
.error-page {
  min-height: 60vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem 0;
}

.error-content {
  text-align: center;
  max-width: 600px;
  margin: 0 auto;
}

.error-title {
  font-size: 1.75rem;
  margin-bottom: 1rem;
  color: var(--color-text, #1a1a1a);
}

.error-code {
  display: block;
  font-size: 4rem;
  font-weight: 800;
  color: var(--color-primary, #0066cc);
  margin-bottom: 0.5rem;
  line-height: 1;
}

.error-message {
  font-size: 1.125rem;
  color: var(--color-text-light, #4a4a4a);
  margin-bottom: 2rem;
  line-height: 1.6;
}

.error-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
  margin-bottom: 3rem;
}

.error-help {
  margin-top: 3rem;
  padding: 2rem;
  background-color: var(--color-bg-alt, #f5f5f5);
  border-radius: 8px;
  text-align: left;

  h2 {
    font-size: 1.25rem;
    margin-bottom: 1rem;
  }

  ul {
    list-style: disc;
    padding-left: 1.5rem;
    margin: 0;

    li {
      margin-bottom: 0.75rem;
      line-height: 1.6;
    }
  }

  a {
    font-weight: 600;
  }
}

@media (max-width: 640px) {
  .error-title {
    font-size: 1.5rem;
  }

  .error-code {
    font-size: 3rem;
  }

  .error-actions {
    flex-direction: column;
    align-items: stretch;

    .button {
      width: 100%;
    }
  }
}
</style>
