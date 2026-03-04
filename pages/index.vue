<template>
  <div class="home-page">
    <section class="help-section" aria-labelledby="help-heading">
      <h2 id="help-heading">How to Use</h2>
      <ol class="help-list">
        <li>
          <strong>Scan with your phone:</strong> Hold your phone near an NFC
          tag. Your phone will automatically open the corresponding page.
        </li>
        <li>
          <strong>Browse exhibitions:</strong> Use the list below to explore all
          available exhibitions and content.
        </li>
        <li>
          <strong>Adjust settings:</strong> Use the accessibility controls at
          the top of the page to customize your experience.
        </li>
      </ol>
    </section>

    <!-- Current Exhibition -->
    <section
      class="current-exhibition"
      aria-labelledby="current-exhibition-heading"
    >
      <h2 id="current-exhibition-heading" class="heading-section">
        Current Exhibition
      </h2>
      <div class="exhibition-card current-card">
        <div class="exhibition-card-body">
          <h3
            class="exhibition-card-title"
            v-html="
              currentExhibition?.display_title || currentExhibition?.title
            "
          />
          <p
            v-if="currentExhibition?.description"
            class="exhibition-card-description"
          >
            {{ currentExhibition.description }}
          </p>
          <p
            v-if="currentExhibition?.date_start || currentExhibition?.date_end"
            class="exhibition-card-dates"
          >
            <time
              v-if="currentExhibition.date_start"
              :datetime="currentExhibition.date_start"
            >
              {{ formatDate(currentExhibition.date_start) }}
            </time>
            <span
              v-if="currentExhibition.date_start && currentExhibition.date_end"
            >
              –
            </span>
            <time
              v-if="currentExhibition.date_end"
              :datetime="currentExhibition.date_end"
            >
              {{ formatDate(currentExhibition.date_end) }}
            </time>
          </p>
        </div>
        <div class="exhibition-card-footer">
          <NuxtLink to="/exhibitions/current" class="exhibition-card-btn">
            View Exhibition
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- Past Exhibitions -->
    <section
      v-if="archivedExhibitions && archivedExhibitions.length > 0"
      class="past-exhibitions"
      aria-labelledby="past-exhibitions-heading"
    >
      <h2 id="past-exhibitions-heading" class="heading-section">
        Past Exhibitions
      </h2>
      <ul class="archive-list">
        <li
          v-for="exhibition in archivedExhibitions"
          :key="exhibition._path"
          class="archive-item"
        >
          <div class="exhibition-card">
            <div class="exhibition-card-body">
              <h3 class="exhibition-card-title">{{ exhibition.title }}</h3>
              <p
                v-if="exhibition.description"
                class="exhibition-card-description"
              >
                {{ exhibition.description }}
              </p>
              <p
                v-if="exhibition.date_start || exhibition.date_end"
                class="exhibition-card-dates"
              >
                <time
                  v-if="exhibition.date_start"
                  :datetime="exhibition.date_start"
                >
                  {{ formatDate(exhibition.date_start) }}
                </time>
                <span v-if="exhibition.date_start && exhibition.date_end">
                  –
                </span>
                <time
                  v-if="exhibition.date_end"
                  :datetime="exhibition.date_end"
                >
                  {{ formatDate(exhibition.date_end) }}
                </time>
              </p>
            </div>
            <div class="exhibition-card-footer">
              <NuxtLink
                :to="`/exhibitions/${exhibition._path.split('/').pop()}`"
                class="exhibition-card-btn"
              >
                View Exhibition
              </NuxtLink>
            </div>
          </div>
        </li>
      </ul>
    </section>
  </div>
</template>

<script setup lang="ts">
// Fetch current exhibition
const { data: currentExhibition } = await useAsyncData(
  'current-exhibition-rooms-index',
  () => queryContent('/exhibitions/current').findOne(),
)

// Fetch archived exhibitions
const { data: archivedExhibitions } = await useAsyncData(
  'archived-exhibitions-index',
  () => queryContent('/archive').sort({ date_end: -1 }).find(),
)

function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

// Set page metadata
useHead({
  title: 'Home - Gibson Accessible Exhibition Didactics',
  meta: [
    {
      name: 'description',
      content:
        'Access detailed, accessible information by scanning NFC tags on exhibits and artworks.',
    },
  ],
})
</script>

<style scoped>
.home-page {
  max-width: 1000px;
  margin: 0 auto;
}

/* Current exhibition section */
.current-exhibition {
  margin-bottom: 3rem;
}

/* Shared exhibition card */
.exhibition-card {
  background: white;
  border: 2px solid var(--color-border, #cccccc);
  border-left: 4px solid var(--color-primary, #00606b);
  border-radius: 8px;
  overflow: hidden;
}

.current-card {
  border-left-width: 4px;
}

.exhibition-card-body {
  padding: 1.75rem 1.75rem 1.25rem;
}

.exhibition-card-title {
  font-size: 1.35rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  color: var(--color-text, #1a1a1a);
}

.exhibition-card-description {
  font-size: 1rem;
  line-height: 1.6;
  color: var(--color-text, #1a1a1a);
  margin-bottom: 0.75rem;
}

.exhibition-card-dates {
  font-size: 0.95rem;
  color: var(--color-text-light, #4a4a4a);
  margin-bottom: 1.25rem;
}

.exhibition-card-footer {
  padding: 1rem 1.75rem 1.5rem;
  border-top: 1px solid var(--color-border, #cccccc);
  background: var(--color-bg-alt, #f5f5f5);
}

.exhibition-card-btn {
  display: inline-block;
  padding: 0.75rem 1.75rem;
  background-color: var(--color-primary, #00606b);
  color: white;
  text-decoration: none;
  border-radius: 4px;
  font-weight: 600;
  font-size: 1rem;
  transition: background-color 0.2s ease-in-out;

  &:hover {
    background-color: var(--color-primary-dark, #004d54);
  }

  &:focus {
    outline: 3px solid var(--color-focus, #00606b);
    outline-offset: 2px;
  }
}

/* Past exhibitions section */
.past-exhibitions {
  margin-bottom: 3rem;
}

.archive-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.help-section {
  margin-bottom: 3rem;
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
</style>
