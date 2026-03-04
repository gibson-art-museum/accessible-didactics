<template>
  <div
    class="audio-player"
    role="region"
    :aria-label="`Audio recording: ${title}`"
  >
    <!-- Screen reader announcement when track starts -->
    <div aria-live="polite" aria-atomic="true" class="sr-only">
      {{ liveAnnouncement }}
    </div>

    <div class="player-inner">
      <button
        type="button"
        class="player-play-btn"
        :aria-label="
          isPlaying ? `Pause: ${title}` : `Play audio recording: ${title}`
        "
        @click="togglePlay"
      >
        <span aria-hidden="true" class="player-icon">
          {{ isPlaying ? '⏸' : '▶' }}
        </span>
        <span class="player-play-label">{{
          isPlaying ? 'Pause' : 'Play'
        }}</span>
      </button>

      <div class="player-track">
        <div class="player-times">
          <span class="player-current-time">{{ formatTime(currentTime) }}</span>
          <span class="player-separator" aria-hidden="true"> / </span>
          <span class="player-duration">{{ formatTime(duration) }}</span>
        </div>

        <input
          type="range"
          class="player-scrubber"
          :value="currentTime"
          :max="duration || 0"
          min="0"
          step="1"
          :aria-label="`Seek in: ${title}`"
          :aria-valuetext="`${formatTimeVerbose(currentTime)} of ${formatTimeVerbose(duration)}`"
          @input="onScrub"
          @change="onScrubCommit"
        />
      </div>
    </div>

    <!-- Native audio element, visually hidden -->
    <audio
      ref="audioEl"
      :src="src"
      preload="metadata"
      @loadedmetadata="onLoadedMetadata"
      @timeupdate="onTimeUpdate"
      @ended="onEnded"
      @play="onPlay"
      @pause="onPause"
    />
  </div>
</template>

<script setup lang="ts">
interface Props {
  src: string
  title: string
}

const props = defineProps<Props>()
const emit = defineEmits<{ ended: [] }>()

const audioEl = ref<HTMLAudioElement | null>(null)
const isPlaying = ref(false)
const currentTime = ref(0)
const duration = ref(0)
const isScrubbing = ref(false)
const liveAnnouncement = ref('')

// Exposed so parent can trigger playback as part of a playlist
function play() {
  audioEl.value?.play()
}
function pause() {
  audioEl.value?.pause()
}
defineExpose({ play, pause })

function togglePlay() {
  if (!audioEl.value) return
  if (isPlaying.value) {
    audioEl.value.pause()
  } else {
    audioEl.value.play()
  }
}

function onLoadedMetadata() {
  duration.value = audioEl.value?.duration ?? 0
}

onMounted(() => {
  // loadedmetadata may have already fired before the listener was attached
  if (audioEl.value && audioEl.value.readyState >= 1) {
    duration.value = audioEl.value.duration
  }
})

function onTimeUpdate() {
  if (!isScrubbing.value) {
    currentTime.value = audioEl.value?.currentTime ?? 0
  }
}

function onPlay() {
  isPlaying.value = true
  liveAnnouncement.value = `Now playing: ${props.title}`
  // Clear after a moment so the same text can re-announce next time
  setTimeout(() => {
    liveAnnouncement.value = ''
  }, 1000)
}

function onPause() {
  isPlaying.value = false
}

function onEnded() {
  isPlaying.value = false
  currentTime.value = 0
  if (audioEl.value) audioEl.value.currentTime = 0
  emit('ended')
}

function onScrub(e: Event) {
  isScrubbing.value = true
  currentTime.value = Number((e.target as HTMLInputElement).value)
}

function onScrubCommit(e: Event) {
  const val = Number((e.target as HTMLInputElement).value)
  if (audioEl.value) audioEl.value.currentTime = val
  isScrubbing.value = false
}

function formatTime(seconds: number): string {
  if (!seconds || isNaN(seconds)) return '0:00'
  const m = Math.floor(seconds / 60)
  const s = Math.floor(seconds % 60)
  return `${m}:${s.toString().padStart(2, '0')}`
}

function formatTimeVerbose(seconds: number): string {
  if (!seconds || isNaN(seconds)) return '0 seconds'
  const m = Math.floor(seconds / 60)
  const s = Math.floor(seconds % 60)
  const parts = []
  if (m > 0) parts.push(`${m} minute${m !== 1 ? 's' : ''}`)
  if (s > 0 || m === 0) parts.push(`${s} second${s !== 1 ? 's' : ''}`)
  return parts.join(' and ')
}
</script>

<style scoped>
.audio-player {
  margin: 1.25rem 0;
  background: var(--color-bg-alt, #f5f5f5);
  border: 2px solid var(--color-border, #cccccc);
  border-radius: 8px;
  padding: 0.75rem 1rem;
}

.player-inner {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.player-play-btn {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  flex-shrink: 0;
  padding: 0.5rem 0.85rem;
  min-width: 44px;
  min-height: 44px;
  background: var(--color-primary, #00606b);
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.95rem;
  font-weight: 600;

  &:hover {
    background: var(--color-primary-dark, #004a52);
  }

  &:focus {
    outline: 3px solid var(--color-focus, #00606b);
    outline-offset: 2px;
  }
}

.player-icon {
  font-size: 1rem;
  line-height: 1;
}

.player-play-label {
  font-size: 0.875rem;
}

.player-track {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
}

.player-times {
  font-size: 0.8rem;
  color: var(--color-text-light, #4a4a4a);
  font-variant-numeric: tabular-nums;
}

.player-scrubber {
  width: 100%;
  height: 6px;
  accent-color: var(--color-primary, #00606b);
  cursor: pointer;
  min-height: 44px; /* generous touch target */
  /* vertically centre the visual track within the tall touch area */
  padding: 19px 0;
  box-sizing: border-box;
  background: transparent;

  &:focus {
    outline: 3px solid var(--color-focus, #00606b);
    outline-offset: 2px;
    border-radius: 4px;
  }
}

audio {
  display: none;
}

@media (max-width: 480px) {
  .player-play-label {
    display: none;
  }
}
</style>
