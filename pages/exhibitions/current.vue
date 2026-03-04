<template>
  <div class="current-exhibition-page">
    <article
      v-if="rooms && rooms.length > 0"
      class="exhibition-content"
      role="article"
    >
      <!-- Map linking to anchors on this page -->
      <MapSection
        heading="Current Exhibition Map"
        :active-rooms="rooms.map((r) => r.room_id)"
      />

      <!-- Room navigation -->
      <nav class="rooms-navigation" aria-label="Navigate between rooms">
        <h2 class="sr-only">Rooms in this Exhibition</h2>
        <ul class="rooms-nav-list">
          <li v-for="room in rooms" :key="room.room_id">
            <a :href="`#${room.room_id}`" class="room-nav-link">
              {{ room.title }}
            </a>
          </li>
        </ul>
      </nav>

      <!-- Individual rooms with anchor links -->
      <section
        v-for="(room, roomIndex) in rooms"
        :key="room.room_id"
        :id="room.room_id"
        class="room-section"
        :aria-labelledby="`room-heading-${room.room_id}`"
      >
        <header class="room-header">
          <h2 :id="`room-heading-${room.room_id}`" class="room-title">
            {{ room.title }}
          </h2>
        </header>

        <!-- Works within this room -->
        <div v-if="room.works && room.works.length > 0" class="room-works">
          <!-- Work navigation within room -->
          <nav
            v-if="room.works.length > 1"
            class="works-navigation"
            :aria-label="`Navigate between works in ${room.title}`"
          >
            <ul class="works-nav-list">
              <li v-for="(work, index) in room.works" :key="work.anchor">
                <a
                  :href="`#${room.room_id}-${work.anchor}`"
                  class="work-nav-link"
                >
                  {{ index + 1 }}. {{ work.title }}
                </a>
              </li>
            </ul>
          </nav>

          <!-- Individual works -->
          <section
            v-for="(work, workIndex) in room.works"
            :key="work.anchor"
            :id="`${room.room_id}-${work.anchor}`"
            class="work-section"
            :aria-labelledby="`work-title-${room.room_id}-${work.anchor}`"
          >
            <!-- Skip to next work -->
            <a
              v-if="workIndex < room.works.length - 1"
              :href="`#${room.room_id}-${room.works[workIndex + 1].anchor}`"
              class="skip-to-next"
            >
              Skip to next work: {{ room.works[workIndex + 1].title }}
            </a>

            <ClientOnly>
              <TextToSpeech :text="getWorkText(work)" />
            </ClientOnly>

            <header class="work-header">
              <p v-if="work.artist" class="work-artist">
                {{ work.artist }}
              </p>
              <h3
                :id="`work-title-${room.room_id}-${work.anchor}`"
                class="work-title"
              >
                <em>{{ work.title }}</em
                ><span v-if="work.year">, {{ work.year }}</span>
              </h3>
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
                <h4>Technical Details</h4>
                <p>{{ work.technical_details }}</p>
              </div>

              <div v-if="work.historical_context" class="historical-context">
                <h4>Historical Context</h4>
                <p>{{ work.historical_context }}</p>
              </div>
            </div>

            <!-- Navigation between works in this room -->
            <nav
              class="work-navigation"
              :aria-label="`Navigate to adjacent works in ${room.title}`"
            >
              <a
                v-if="workIndex > 0"
                :href="`#${room.room_id}-${room.works[workIndex - 1].anchor}`"
                class="nav-button prev-work"
              >
                ← Previous: {{ room.works[workIndex - 1].title }}
              </a>
              <a
                v-if="workIndex < room.works.length - 1"
                :href="`#${room.room_id}-${room.works[workIndex + 1].anchor}`"
                class="nav-button next-work"
              >
                Next: {{ room.works[workIndex + 1].title }} →
              </a>
            </nav>
          </section>
        </div>

        <!-- Navigation between rooms -->
        <nav class="room-navigation" aria-label="Navigate between rooms">
          <a
            v-if="roomIndex > 0"
            :href="`#${rooms[roomIndex - 1].room_id}`"
            class="nav-button prev-room"
          >
            ← {{ rooms[roomIndex - 1].title }}
          </a>
          <a
            v-if="roomIndex < rooms.length - 1"
            :href="`#${rooms[roomIndex + 1].room_id}`"
            class="nav-button next-room"
          >
            {{ rooms[roomIndex + 1].title }} →
          </a>
          <a
            v-if="roomIndex === rooms.length - 1"
            href="#top"
            class="nav-button back-to-top"
          >
            ↑ Back to Top
          </a>
        </nav>
      </section>

      <!-- Archived Exhibitions -->
      <section
        v-if="archivedExhibitions && archivedExhibitions.length > 0"
        class="archive-section"
        aria-labelledby="archive-heading"
      >
        <h2 id="archive-heading" class="archive-heading">Past Exhibitions</h2>
        <ul class="archive-list">
          <li
            v-for="archived in archivedExhibitions"
            :key="archived._path"
            class="archive-item"
          >
            <NuxtLink
              :to="`/exhibitions/${archived._path.split('/').pop()}`"
              class="archive-card"
            >
              <h3 class="archive-title">{{ archived.title }}</h3>
              <p v-if="archived.description" class="archive-description">
                {{ archived.description }}
              </p>
              <p
                v-if="archived.date_start || archived.date_end"
                class="archive-dates"
              >
                <time
                  v-if="archived.date_start"
                  :datetime="archived.date_start"
                >
                  {{ formatDate(archived.date_start) }}
                </time>
                <span v-if="archived.date_start && archived.date_end"> – </span>
                <time v-if="archived.date_end" :datetime="archived.date_end">
                  {{ formatDate(archived.date_end) }}
                </time>
              </p>
            </NuxtLink>
          </li>
        </ul>
      </section>

      <footer class="exhibition-footer">
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

// Fetch current exhibition (single file with all rooms)
const { data: exhibition } = await useAsyncData('current-exhibition', () =>
  queryContent('/exhibitions/current').findOne(),
)
const rooms = computed(() => exhibition.value?.rooms ?? [])

// Fetch archived exhibitions
const { data: archivedExhibitions } = await useAsyncData(
  'archived-exhibitions',
  () => queryContent('/archive').sort({ date_end: -1 }).find(),
)

// Set page metadata
useHead({
  title: 'Current Exhibition – Gibson Accessible Exhibition Didactics',
  meta: [
    {
      name: 'description',
      content:
        'Current exhibition at the SFU Goldcorp Centre for the Arts. Browse rooms and artworks.',
    },
  ],
})

// Get full text for a work for text-to-speech
function getWorkText(work: any): string {
  let text = ''
  if (work.artist) text += `${work.artist}. `
  text += work.title
  if (work.year) text += `, ${work.year}`
  text += '. '
  if (work.materials) text += `${work.materials}. `
  if (work.collection) text += `${work.collection}. `
  if (work.location) text += `Located at ${work.location}. `
  if (work.description) text += work.description + ' '
  if (work.technical_details) text += work.technical_details + ' '
  if (work.historical_context) text += work.historical_context
  return text
}

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
.current-exhibition-page {
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
  border-bottom: 2px solid var(--color-border, #cccccc);
}

/* Room navigation */
.rooms-navigation {
  margin: 2rem 0;
  padding: 1.5rem;
  background-color: var(--color-bg-alt, #f5f5f5);
  border-radius: 4px;
  border-left: 4px solid var(--color-primary, #00606b);
}

.rooms-nav-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;

  li {
    margin: 0;
  }
}

.room-nav-link {
  display: inline-block;
  padding: 0.5rem 1rem;
  background-color: white;
  border: 2px solid var(--color-border, #cccccc);
  border-radius: 4px;
  text-decoration: none;
  color: var(--color-primary, #00606b);
  font-weight: 500;
  transition: all 0.2s ease-in-out;

  &:hover {
    border-color: var(--color-primary, #00606b);
    background-color: var(--color-bg-alt, #f5f5f5);
  }

  &:focus {
    outline: 3px solid var(--color-focus, #00606b);
    outline-offset: 2px;
  }
}

/* Room sections */
.room-section {
  margin: 3rem 0;
  padding: 2rem;
  border: 2px solid var(--color-border, #cccccc);
  border-radius: 8px;
  scroll-margin-top: 2rem;

  &:target {
    border-color: var(--color-primary, #00606b);
    background-color: var(--color-bg-alt, #f5f5f5);
  }
}

.room-header {
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid var(--color-border, #cccccc);
}

.room-title {
  font-size: 1.5rem;
  color: var(--color-text, #1a1a1a);
  margin: 0;
}

/* Works navigation within room */
.works-navigation {
  margin: 1.5rem 0;
  padding: 1rem 1.5rem;
  background-color: white;
  border: 1px solid var(--color-border, #cccccc);
  border-radius: 4px;
}

.works-nav-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;

  li {
    margin: 0;
  }
}

.work-nav-link {
  display: block;
  padding: 0.4rem 0.75rem;
  text-decoration: none;
  color: var(--color-primary, #00606b);
  font-weight: 500;
  border-radius: 4px;
  transition: background-color 0.2s ease-in-out;

  &:hover {
    background-color: var(--color-bg-alt, #f5f5f5);
  }

  &:focus {
    outline: 3px solid var(--color-focus, #00606b);
    outline-offset: 2px;
  }
}

/* Work sections */
.work-section {
  margin: 2rem 0;
  padding: 1.5rem;
  border: 1px solid var(--color-border, #cccccc);
  border-radius: 6px;
  scroll-margin-top: 2rem;

  &:target {
    border-color: var(--color-primary, #00606b);
    background-color: #f0faf9;
  }
}

.skip-to-next {
  display: inline-block;
  margin-bottom: 1rem;
  padding: 0.5rem 1rem;
  background-color: var(--color-primary, #00606b);
  color: white;
  text-decoration: none;
  border-radius: 4px;
  font-size: 0.9rem;
  font-weight: 500;

  &:focus {
    outline: 3px solid var(--color-focus, #00606b);
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
    font-size: 1.5rem;
    margin-bottom: 0.5rem;
    color: var(--color-text, #1a1a1a);
    font-weight: 400;

    em {
      font-style: italic;
    }
  }

  .work-materials,
  .work-collection {
    font-size: 1rem;
    color: var(--color-text-light, #4a4a4a);
    margin-bottom: 0.25rem;
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

    h4 {
      font-size: 1rem;
      margin-bottom: 0.5rem;
      color: var(--color-text, #1a1a1a);
    }
  }
}

.work-navigation,
.room-navigation {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid var(--color-border, #cccccc);
  flex-wrap: wrap;
}

.nav-button {
  padding: 0.75rem 1.5rem;
  background-color: var(--color-primary, #00606b);
  color: white;
  text-decoration: none;
  border-radius: 4px;
  font-weight: 500;
  transition: all 0.2s ease-in-out;

  &:hover {
    background-color: var(--color-primary-dark, #004d54);
  }

  &:focus {
    outline: 3px solid var(--color-focus, #00606b);
    outline-offset: 2px;
  }
}

.prev-work,
.prev-room {
  margin-right: auto;
}

.next-work,
.next-room,
.back-to-top {
  margin-left: auto;
}

/* Archive section */
.archive-section {
  margin-top: 4rem;
  padding-top: 3rem;
  border-top: 2px solid var(--color-border, #cccccc);
}

.archive-heading {
  font-size: 1.5rem;
  margin-bottom: 1.5rem;
  color: var(--color-text, #1a1a1a);
}

.archive-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.archive-card {
  display: block;
  padding: 1.5rem;
  background: var(--color-bg-alt, #f5f5f5);
  border: 1px solid var(--color-border, #cccccc);
  border-left: 4px solid var(--color-primary, #00606b);
  border-radius: 6px;
  text-decoration: none;
  color: inherit;
  transition:
    border-color 0.2s ease-in-out,
    box-shadow 0.2s ease-in-out;

  &:hover {
    border-color: var(--color-primary, #00606b);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }

  &:focus {
    outline: 3px solid var(--color-focus, #00606b);
    outline-offset: 2px;
  }
}

.archive-title {
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: var(--color-text, #1a1a1a);
}

.archive-description {
  color: var(--color-text-light, #4a4a4a);
  margin-bottom: 0.75rem;
}

.archive-dates {
  font-size: 0.9rem;
  color: var(--color-text-light, #4a4a4a);
  margin-bottom: 1rem;
}

.archive-rooms {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  font-size: 0.95rem;
  color: var(--color-text-light, #4a4a4a);
}

.exhibition-footer {
  margin-top: 3rem;
  padding-top: 2rem;
  border-top: 2px solid var(--color-border, #cccccc);

  .back-link {
    font-weight: 600;
    text-decoration: none;
    color: var(--color-primary, #00606b);

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

  .room-section,
  .work-section {
    padding: 1.25rem;
  }

  .rooms-nav-list {
    flex-direction: column;
  }

  .work-navigation,
  .room-navigation {
    flex-direction: column;

    .nav-button {
      width: 100%;
      text-align: center;
    }

    .prev-work,
    .prev-room,
    .next-work,
    .next-room,
    .back-to-top {
      margin: 0;
    }
  }
}

@media (prefers-reduced-motion: reduce) {
  .skip-to-next,
  .nav-button,
  .room-nav-link,
  .work-nav-link {
    transition: none;
  }
}
</style>
