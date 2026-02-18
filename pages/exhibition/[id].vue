<template>
  <div class="exhibition-page">
    <article v-if="exhibition" class="exhibition-content" role="article">
      <header class="exhibition-header">
        <h1 class="heading-section">{{ exhibition.title }}</h1>
        <p v-if="exhibition.description" class="exhibition-description">
          {{ exhibition.description }}
        </p>
        <!-- <p v-if="exhibition.location" class="exhibition-location">
          <span class="sr-only">Location:</span>
          <strong>{{ exhibition.location }}</strong>
        </p> -->
      </header>

      <!-- Navigation between works -->
      <nav
        v-if="works && works.length > 1"
        class="works-navigation"
        aria-label="Navigate between works in exhibition"
      >
        <h2 class="sr-only">Works in this Exhibition</h2>
        <ul class="works-nav-list">
          <li v-for="(work, index) in works" :key="work.anchor">
            <a :href="`#${work.anchor}`" class="work-nav-link">
              {{ index + 1 }}. {{ work.title }}
            </a>
          </li>
        </ul>
      </nav>

      <!-- Individual works with anchor links -->
      <section
        v-for="(work, index) in works"
        :key="work.anchor"
        :id="work.anchor"
        class="work-section"
        :aria-labelledby="`work-title-${work.anchor}`"
      >
        <!-- Skip link to next work -->
        <a
          v-if="index < works.length - 1"
          :href="`#${works[index + 1].anchor}`"
          class="skip-to-next"
        >
          Skip to next work: {{ works[index + 1].title }}
        </a>

        <ClientOnly>
          <TextToSpeech :text="getWorkText(work)" />
        </ClientOnly>

        <header class="work-header">
          <p v-if="work.artist" class="work-artist">
            {{ work.artist }}
          </p>
          <h2 :id="`work-title-${work.anchor}`" class="work-title">
            <em>{{ work.title }}</em
            ><span v-if="work.year">, {{ work.year }}</span>
          </h2>
          <p v-if="work.materials" class="work-materials">
            {{ work.materials }}
          </p>
          <p v-if="work.collection" class="work-collection">
            {{ work.collection }}
          </p>
          <p v-if="work.location" class="work-location">
            <span class="sr-only">Location:</span>
            {{ work.location }}
          </p>
        </header>

        <div class="work-body">
          <p v-if="work.description">{{ work.description }}</p>
          <div v-if="work.content" v-html="work.content"></div>

          <div v-if="work.technical_details" class="technical-details">
            <h3>Technical Details</h3>
            <p>{{ work.technical_details }}</p>
          </div>

          <div v-if="work.historical_context" class="historical-context">
            <h3>Historical Context</h3>
            <p>{{ work.historical_context }}</p>
          </div>
        </div>

        <!-- Navigation to previous/next work -->
        <nav class="work-navigation" aria-label="Navigate to adjacent works">
          <a
            v-if="index > 0"
            :href="`#${works[index - 1].anchor}`"
            class="nav-button prev-work"
          >
            ← Previous: {{ works[index - 1].title }}
          </a>
          <a
            v-if="index < works.length - 1"
            :href="`#${works[index + 1].anchor}`"
            class="nav-button next-work"
          >
            Next: {{ works[index + 1].title }} →
          </a>
          <a
            v-if="index === works.length - 1"
            href="#top"
            class="nav-button back-to-top"
          >
            ↑ Back to Top
          </a>
        </nav>
      </section>

      <footer class="exhibition-footer">
        <p v-if="exhibition.updated_at" class="exhibition-meta">
          <span class="sr-only">Last updated:</span>
          <time :datetime="exhibition.updated_at">
            {{ formatDate(exhibition.updated_at) }}
          </time>
        </p>
        <NuxtLink to="/" class="back-link"> ← Back to Home </NuxtLink>
      </footer>
    </article>

    <div v-else class="loading" role="status" aria-live="polite">
      <p>Loading exhibition content...</p>
    </div>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const exhibitionId = route.params.id as string

// Fetch the exhibition content
const { data: exhibition, error } = await useAsyncData(
  `exhibition-${exhibitionId}`,
  () => queryContent(`exhibitions/${exhibitionId}`).findOne(),
)

// Handle 404 - redirect to error page if exhibition not found
if (error.value || !exhibition.value) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Exhibition Not Found',
    fatal: true,
  })
}

// Extract works from exhibition
const works = computed(() => {
  if (!exhibition.value || !exhibition.value.works) return []
  return exhibition.value.works
})

// Set page metadata
useHead({
  title: exhibition.value?.title || 'Exhibition',
  meta: [
    {
      name: 'description',
      content: exhibition.value?.description || `Exhibition: ${exhibitionId}`,
    },
  ],
})

// Scroll to anchor on mount if present
onMounted(() => {
  const hash = route.hash
  if (hash) {
    setTimeout(() => {
      const element = document.querySelector(hash)
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' })
        // Focus the heading for screen readers
        const heading = element.querySelector('h2')
        if (heading) {
          heading.setAttribute('tabindex', '-1')
          heading.focus()
        }
      }
    }, 100)
  }
})

// Get full text for a work for text-to-speech
function getWorkText(work: any): string {
  let text = ''

  if (work.artist) {
    text += `${work.artist}. `
  }

  text += work.title

  if (work.year) {
    text += `, ${work.year}`
  }

  text += '. '

  if (work.materials) {
    text += `${work.materials}. `
  }

  if (work.collection) {
    text += `${work.collection}. `
  }

  if (work.location) {
    text += `Located at ${work.location}. `
  }

  if (work.description) {
    text += work.description + ' '
  }

  if (work.technical_details) {
    text += work.technical_details + ' '
  }

  if (work.historical_context) {
    text += work.historical_context
  }

  return text
}

// Format date for display
function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}
</script>

<style scoped>
.exhibition-page {
  min-height: 50vh;
}

.exhibition-content {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.heading-section {
  margin-bottom: 1.5rem;
  font-size: 1.75rem;
  color: var(--color-text, #1a1a1a);
}

.exhibition-header {
  margin-bottom: 2rem;
  padding-bottom: 1.5rem;

  .exhibition-description {
    margin-bottom: 1rem;
    font-size: 1.1rem;
    line-height: 1.6;
  }

  .exhibition-location {
    margin: 0;
    color: var(--color-text-light, #4a4a4a);
    font-size: 1rem;
  }
}

.works-navigation {
  margin: 2rem 0;
  padding: 1.5rem;
  background-color: var(--color-bg-alt, #f5f5f5);
  border-radius: 4px;
  border-left: 4px solid var(--color-primary, #0066cc);
}

.works-nav-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;

  li {
    margin: 0;
  }

  .work-nav-link {
    display: block;
    padding: 0.5rem 1rem;
    background-color: white;
    border: 2px solid var(--color-border, #cccccc);
    border-radius: 4px;
    text-decoration: none;
    color: var(--color-primary, #0066cc);
    font-weight: 500;
    transition: all 0.2s ease-in-out;

    &:hover {
      border-color: var(--color-primary, #0066cc);
      background-color: var(--color-bg-alt, #f5f5f5);
    }

    &:focus {
      outline: 3px solid var(--color-focus, #0066cc);
      outline-offset: 2px;
    }
  }
}

.work-section {
  margin: 3rem 0;
  padding: 2rem;
  border: 2px solid var(--color-border, #cccccc);
  border-radius: 8px;
  scroll-margin-top: 2rem;

  &:target {
    border-color: var(--color-primary, #0066cc);
    background-color: var(--color-bg-alt, #f5f5f5);
  }
}

.skip-to-next {
  display: inline-block;
  margin-bottom: 1rem;
  padding: 0.5rem 1rem;
  background-color: var(--color-primary, #0066cc);
  color: white;
  text-decoration: none;
  border-radius: 4px;
  font-size: 0.9rem;
  font-weight: 500;

  &:hover {
    background-color: var(--color-primary-dark, #004d99);
  }

  &:focus {
    outline: 3px solid var(--color-focus, #0066cc);
    outline-offset: 2px;
  }
}

.work-header {
  margin-bottom: 1.5rem;

  .work-artist {
    font-size: 1.1rem;
    font-weight: 600;
    color: var(--color-text, #1a1a1a);
    margin-bottom: 0.25rem;
  }

  .work-title {
    font-size: 1.75rem;
    margin-bottom: 0.5rem;
    color: var(--color-text, #1a1a1a);
    font-weight: 400;

    em {
      font-style: italic;
    }
  }

  .work-materials {
    font-size: 1rem;
    color: var(--color-text-light, #4a4a4a);
    margin-bottom: 0.25rem;
  }

  .work-collection {
    font-size: 1rem;
    color: var(--color-text-light, #4a4a4a);
    margin-bottom: 0.5rem;
  }

  .work-location {
    font-size: 0.95rem;
    color: var(--color-text-light, #4a4a4a);
    margin: 0;
  }
}

.work-body {
  margin: 1.5rem 0;
  line-height: 1.8;

  p {
    margin-bottom: 1rem;
  }

  .technical-details,
  .historical-context {
    margin-top: 1.5rem;
    padding: 1rem;
    padding-left: 0;
    /* background-color: var(--color-bg-alt, #f5f5f5); */
    border-radius: 4px;

    h3 {
      font-size: 1.1rem;
      margin-bottom: 0.5rem;
      color: var(--color-text, #1a1a1a);
    }
  }
}

.work-navigation {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid var(--color-border, #cccccc);
  flex-wrap: wrap;

  .nav-button {
    padding: 0.75rem 1.5rem;
    background-color: var(--color-primary, #0066cc);
    color: white;
    text-decoration: none;
    border-radius: 4px;
    font-weight: 500;
    transition: all 0.2s ease-in-out;

    &:hover {
      background-color: var(--color-primary-dark, #004d99);
    }

    &:focus {
      outline: 3px solid var(--color-focus, #0066cc);
      outline-offset: 2px;
    }
  }

  .prev-work {
    margin-right: auto;
  }

  .next-work,
  .back-to-top {
    margin-left: auto;
  }
}

.exhibition-footer {
  margin-top: 3rem;
  padding-top: 2rem;
  border-top: 2px solid var(--color-border, #cccccc);
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;

  .exhibition-meta {
    margin: 0;
    color: var(--color-text-light, #4a4a4a);
    font-size: 0.9rem;
  }

  .back-link {
    font-weight: 600;
    text-decoration: none;
    color: var(--color-primary, #0066cc);

    &:hover {
      text-decoration: underline;
    }
  }
}

.loading {
  text-align: center;
  padding: 3rem;
  color: var(--color-text-light, #4a4a4a);
}

@media (max-width: 640px) {
  .exhibition-content {
    padding: 1.5rem;
  }

  .work-section {
    padding: 1.5rem;
  }

  .work-navigation {
    flex-direction: column;

    .nav-button {
      width: 100%;
      text-align: center;
    }

    .prev-work,
    .next-work,
    .back-to-top {
      margin: 0;
    }
  }

  .exhibition-footer {
    flex-direction: column;
    align-items: flex-start;
  }
}

@media (prefers-reduced-motion: reduce) {
  .skip-to-next,
  .nav-button,
  .work-nav-link {
    transition: none;
  }
}
</style>
