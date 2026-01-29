<template>
  <div class="text-to-speech">
    <button
      v-if="isSupported"
      type="button"
      class="tts-button"
      :class="{ 'is-speaking': isSpeaking }"
      :aria-pressed="isSpeaking"
      @click="toggleSpeech"
      :aria-label="isSpeaking ? 'Stop reading aloud' : 'Read content aloud'"
    >
      <span aria-hidden="true">{{ isSpeaking ? '⏸' : '🔊' }}</span>
      <span>{{ isSpeaking ? 'Stop Reading' : 'Read Aloud' }}</span>
    </button>
    <p v-else class="tts-unavailable">
      <span class="sr-only">Text-to-speech is not available in your browser.</span>
    </p>
  </div>
</template>

<script setup lang="ts">
interface Props {
  text: string
}

const props = defineProps<Props>()

const isSpeaking = ref(false)
const isSupported = ref(false)
let utterance: SpeechSynthesisUtterance | null = null

onMounted(() => {
  // Check if Web Speech API is supported
  isSupported.value = 'speechSynthesis' in window
})

function toggleSpeech() {
  if (!isSupported.value) return

  if (isSpeaking.value) {
    stopSpeech()
  } else {
    startSpeech()
  }
}

function startSpeech() {
  if (!props.text || !isSupported.value) return

  // Stop any ongoing speech
  window.speechSynthesis.cancel()

  // Create new utterance
  utterance = new SpeechSynthesisUtterance(props.text)
  utterance.lang = 'en-US'
  utterance.rate = 0.9 // Slightly slower for better comprehension
  utterance.pitch = 1

  utterance.onstart = () => {
    isSpeaking.value = true
  }

  utterance.onend = () => {
    isSpeaking.value = false
  }

  utterance.onerror = () => {
    isSpeaking.value = false
    console.error('Speech synthesis error')
  }

  window.speechSynthesis.speak(utterance)
}

function stopSpeech() {
  if (!isSupported.value) return
  window.speechSynthesis.cancel()
  isSpeaking.value = false
}

// Clean up on component unmount
onUnmounted(() => {
  stopSpeech()
})

// Watch for text changes and stop speaking
watch(() => props.text, () => {
  if (isSpeaking.value) {
    stopSpeech()
  }
})
</script>

<style scoped >
.text-to-speech {
  margin: 1rem 0;
}

.tts-button {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  min-height: 44px;
  padding: 0.75rem 1.25rem;
  font-size: 1rem;
  font-weight: 600;
  color: white;
  background-color: var(--color-primary, #0066cc);
  border: 2px solid var(--color-primary, #0066cc);
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
}

.tts-button:hover {
  background-color: var(--color-primary-dark, #004d99);
  border-color: var(--color-primary-dark, #004d99);
}

.tts-button.is-speaking {
  background-color: var(--color-error, #cc0000);
  border-color: var(--color-error, #cc0000);
}

.tts-button span[aria-hidden='true'] {
  font-size: 1.25rem;
}

.tts-unavailable {
  color: var(--color-text-light, #4a4a4a);
  font-style: italic;
}

@media (prefers-reduced-motion: reduce) {
  .tts-button {
    transition: none;
  }
}
</style>
