<template>
  <div class="tag-page">
    <article v-if="tag" class="tag-content" role="article">
      <header class="tag-header">
        <h1>{{ tag.title }}</h1>
        <p v-if="tag.location" class="tag-location">
          <span class="sr-only">Location:</span>
          <strong>{{ tag.location }}</strong>
        </p>
      </header>

      <TextToSpeech :text="fullText" />

      <div class="tag-body">
        <ContentRenderer :value="tag" />
      </div>

      <nav v-if="tag.related_tags && tag.related_tags.length > 0" class="related-tags" aria-label="Related content">
        <h2>Related Content</h2>
        <ul>
          <li v-for="relatedId in tag.related_tags" :key="relatedId">
            <NuxtLink :to="`/tag/${relatedId}`">
              View Tag {{ relatedId }}
            </NuxtLink>
          </li>
        </ul>
      </nav>

      <footer class="tag-footer">
        <p class="tag-meta">
          <span class="sr-only">Last updated:</span>
          <time :datetime="tag.updated_at">
            {{ formatDate(tag.updated_at) }}
          </time>
        </p>
        <NuxtLink to="/" class="back-link">
          ← Back to Home
        </NuxtLink>
      </footer>
    </article>

    <div v-else class="loading" role="status" aria-live="polite">
      <p>Loading content...</p>
    </div>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const tagId = route.params.id as string

// Fetch the tag content
const { data: tag, error } = await useAsyncData(
  `tag-${tagId}`,
  () => queryContent(`tags/${tagId}`).findOne()
)

// Handle 404 - redirect to error page if tag not found
if (error.value || !tag.value) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Tag Not Found',
    fatal: true
  })
}

// Set page metadata
useHead({
  title: tag.value?.title || 'Tag Content',
  meta: [
    {
      name: 'description',
      content: tag.value?.description || `Content for NFC tag ${tagId}`
    }
  ]
})

// Compute full text for text-to-speech
const fullText = computed(() => {
  if (!tag.value) return ''

  let text = tag.value.title + '. '

  if (tag.value.location) {
    text += `Located at ${tag.value.location}. `
  }

  // For text-to-speech, we'll use the description or excerpt if available
  // The body is an AST object in Nuxt Content, not a string
  if (tag.value.description) {
    text += tag.value.description
  } else if (tag.value.excerpt) {
    text += tag.value.excerpt
  }

  return text
})

// Format date for display
function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}
</script>

<style scoped >
.tag-page {
  min-height: 50vh;
}

.tag-content {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.tag-header {
  margin-bottom: 2rem;
  padding-bottom: 1.5rem;
  border-bottom: 2px solid var(--color-border, #cccccc);

  h1 {
    margin-bottom: 1rem;
    color: var(--color-text, #1a1a1a);
  }

  .tag-location {
    margin: 0;
    color: var(--color-text-light, #4a4a4a);
    font-size: 1.1rem;
  }
}

.tag-body {
  margin: 2rem 0;
  line-height: 1.8;

  :deep(h2) {
    margin-top: 2rem;
    margin-bottom: 1rem;
    padding-top: 1rem;
    border-top: 1px solid var(--color-border, #cccccc);
  }

  :deep(p) {
    margin-bottom: 1.5rem;
  }

  :deep(ul),
  :deep(ol) {
    margin-bottom: 1.5rem;
    padding-left: 2rem;

    li {
      margin-bottom: 0.5rem;
    }
  }
}

.related-tags {
  margin: 2rem 0;
  padding: 1.5rem;
  background-color: var(--color-bg-alt, #f5f5f5);
  border-radius: 4px;

  h2 {
    font-size: 1.25rem;
    margin-bottom: 1rem;
  }

  ul {
    list-style: none;
    padding: 0;
    margin: 0;

    li {
      margin-bottom: 0.75rem;

      a {
        display: inline-block;
        padding: 0.5rem 1rem;
        background-color: white;
        border: 2px solid var(--color-border, #cccccc);
        border-radius: 4px;
        text-decoration: none;
        transition: all 0.2s ease-in-out;

        &:hover {
          border-color: var(--color-primary, #0066cc);
          background-color: var(--color-bg-alt, #f5f5f5);
        }
      }
    }
  }
}

.tag-footer {
  margin-top: 3rem;
  padding-top: 2rem;
  border-top: 1px solid var(--color-border, #cccccc);
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;

  .tag-meta {
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
  .tag-content {
    padding: 1.5rem;
  }

  .tag-footer {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
