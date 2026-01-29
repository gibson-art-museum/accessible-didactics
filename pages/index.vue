<template>
  <div class="home-page">
    <section class="intro">
      <h1>Welcome to Accessible NFC Tags</h1>
      <p class="lead">
        Scan an NFC tag to access detailed information about exhibits and artworks.
      </p>
    </section>

    <section v-if="exhibitions && exhibitions.length > 0" class="available-exhibitions" aria-labelledby="exhibitions-heading">
      <h2 id="exhibitions-heading" class="heading-section">Exhibitions</h2>
      <p class="sr-only">This list shows all available exhibitions. Select an exhibition to view its content.</p>

      <ul class="exhibition-list">
        <li v-for="exhibition in exhibitions" :key="exhibition.exhibition_id" class="exhibition-item">
          <NuxtLink :to="`/exhibition/${exhibition.exhibition_id}`" class="exhibition-link">
            <h3>{{ exhibition.title }}</h3>
            <p v-if="exhibition.description" class="exhibition-description">
              {{ exhibition.description }}
            </p>
            <p v-if="exhibition.location" class="exhibition-location-preview">
              {{ exhibition.location }}
            </p>
            <span v-if="exhibition.works" class="works-count" aria-label="Number of works">
              {{ exhibition.works.length }} {{ exhibition.works.length === 1 ? 'work' : 'works' }}
            </span>
          </NuxtLink>
        </li>
      </ul>
    </section>

    <section v-if="tags && tags.length > 0" class="available-tags" aria-labelledby="available-heading">
      <h2 id="available-heading" class="heading-section">Individual Tags</h2>
      <p class="sr-only">This list shows individual NFC tags. Select a tag to view its content.</p>

      <ul class="tag-list">
        <li v-for="tag in tags" :key="tag.tag_id" class="tag-item">
          <NuxtLink :to="`/tag/${tag.tag_id}`" class="tag-link">
            <h3>{{ tag.title }}</h3>
            <p v-if="tag.location" class="tag-location-preview">
              {{ tag.location }}
            </p>
            <span class="tag-id-badge" aria-label="Tag ID">
              {{ tag.tag_id }}
            </span>
          </NuxtLink>
        </li>
      </ul>
    </section>

    <section class="help-section" aria-labelledby="help-heading">
      <h2 id="help-heading">How to Use</h2>
      <ol class="help-list">
        <li>
          <strong>Scan with your phone:</strong> Hold your phone near an NFC tag. Your phone will automatically open the corresponding page.
        </li>
        <li>
          <strong>Browse available tags:</strong> Use the list above to explore all available content.
        </li>
        <li>
          <strong>Adjust settings:</strong> Use the accessibility controls at the top of the page to customize your experience.
        </li>
      </ol>
    </section>
  </div>
</template>

<script setup lang="ts">
// Fetch all available exhibitions
const { data: exhibitions } = await useAsyncData('all-exhibitions', () =>
  queryContent('/exhibitions').find()
)

// Fetch all available individual tags (for backward compatibility)
const { data: tags } = await useAsyncData('all-tags', () =>
  queryContent('/tags').find()
)

// Set page metadata
useHead({
  title: 'Home - Accessible NFC Tags',
  meta: [
    {
      name: 'description',
      content: 'Access detailed, accessible information by scanning NFC tags on exhibits and artworks.'
    }
  ]
})
</script>

<style scoped >
.home-page {
  max-width: 1000px;
  margin: 0 auto;
}

.intro {
  text-align: center;
  margin-bottom: 3rem;

  h1 {
    font-size: 2rem;
    margin-bottom: 1rem;
  }

  .lead {
    font-size: 1.25rem;
    color: var(--color-text-light, #4a4a4a);
    max-width: 600px;
    margin: 0 auto;
  }
}

.available-exhibitions {
  margin-bottom: 3rem;

  h2 {
    margin-bottom: 1.5rem;
    font-size: 1.75rem;
  }
}

.exhibition-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
}

.exhibition-item {
  margin: 0;
}

.exhibition-link {
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 1.5rem;
  background: white;
  border: 2px solid var(--color-border, #cccccc);
  border-left: 4px solid var(--color-primary, #00606B);
  border-radius: 8px;
  text-decoration: none;
  color: inherit;
  transition: all 0.2s ease-in-out;

  &:hover {
    border-color: var(--color-primary, #00606B);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    transform: translateY(-2px);
  }

  &:focus {
    outline: 3px solid var(--color-focus, #00606B);
    outline-offset: 2px;
  }

  h3 {
    font-size: 1.35rem;
    margin-bottom: 0.75rem;
    color: var(--color-primary, #00606B);
  }

  .exhibition-description {
    margin-bottom: 0.75rem;
    color: var(--color-text, #1a1a1a);
    font-size: 0.95rem;
    line-height: 1.5;
    flex-grow: 1;
  }

  .exhibition-location-preview {
    margin-bottom: 0.75rem;
    color: var(--color-text-light, #4a4a4a);
    font-size: 0.9rem;
  }

  .works-count {
    display: inline-block;
    padding: 0.25rem 0.75rem;
    background-color: var(--color-secondary, #B40202);
    color: white;
    border-radius: 4px;
    font-size: 0.875rem;
    font-weight: 600;
    align-self: flex-start;
  }
}

.available-tags {
  margin-bottom: 3rem;

  h2 {
    margin-bottom: 1.5rem;
    font-size: 1.75rem;
  }
}

.tag-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
}

.tag-item {
  margin: 0;
}

.tag-link {
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 1.5rem;
  background: white;
  border: 2px solid var(--color-border, #cccccc);
  border-radius: 8px;
  text-decoration: none;
  color: inherit;
  transition: all 0.2s ease-in-out;

  &:hover {
    border-color: var(--color-primary, #0066cc);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    transform: translateY(-2px);
  }

  &:focus {
    outline: 3px solid var(--color-focus, #0066cc);
    outline-offset: 2px;
  }

  h3 {
    font-size: 1.25rem;
    margin-bottom: 0.5rem;
    color: var(--color-primary, #0066cc);
  }

  .tag-location-preview {
    margin-bottom: 1rem;
    color: var(--color-text-light, #4a4a4a);
    font-size: 0.9rem;
    flex-grow: 1;
  }

  .tag-id-badge {
    display: inline-block;
    padding: 0.25rem 0.75rem;
    background-color: var(--color-bg-alt, #f5f5f5);
    border: 1px solid var(--color-border, #cccccc);
    border-radius: 4px;
    font-size: 0.875rem;
    font-family: monospace;
    color: var(--color-text-light, #4a4a4a);
    align-self: flex-start;
  }
}

.help-section {
  margin-top: 4rem;
  padding: 2rem;
  background-color: var(--color-bg-alt, #f5f5f5);
  border-radius: 8px;

  h2 {
    font-size: 1.5rem;
    margin-bottom: 1.5rem;
  }
}

.help-list {
  padding-left: 1.5rem;

  li {
    margin-bottom: 1rem;
    line-height: 1.6;

    strong {
      color: var(--color-text, #1a1a1a);
    }
  }
}

@media (max-width: 640px) {
  .intro h1 {
    font-size: 1.5rem;
  }

  .intro .lead {
    font-size: 1rem;
  }

  .tag-list {
    grid-template-columns: 1fr;
  }
}

@media (prefers-reduced-motion: reduce) {
  .tag-link {
    transition: none;

    &:hover {
      transform: none;
    }
  }
}
</style>
