<template>
  <nav class="bg-bg-alt border-b border-border p-3" aria-label="Accessibility settings">
    <div class="flex flex-wrap gap-2 max-w-4xl mx-auto justify-center">
      <button
        type="button"
        class="control-button"
        :class="{ 'control-button-active': isHighContrast }"
        :aria-pressed="isHighContrast"
        @click="toggleHighContrast"
        aria-label="Toggle high contrast mode"
      >
        <span aria-hidden="true" class="text-xl font-bold">{{ isHighContrast ? '◐' : '○' }}</span>
        <span class="control-label">High Contrast</span>
      </button>

      <button
        type="button"
        class="control-button"
        @click="increaseFontSize"
        :disabled="fontSize === 'xxlarge'"
        :aria-label="`Increase text size. Current size: ${getFontSizeLabel()}`"
      >
        <span aria-hidden="true" class="text-xl font-bold">A+</span>
        <span class="control-label">{{ fontSize === 'xxlarge' ? 'Max Size' : 'Larger Text' }}</span>
      </button>

      <button
        type="button"
        class="control-button"
        @click="decreaseFontSize"
        :disabled="fontSize === 'normal'"
        :aria-label="`Decrease text size. Current size: ${getFontSizeLabel()}`"
      >
        <span aria-hidden="true" class="text-xl font-bold">A-</span>
        <span class="control-label">{{ fontSize === 'normal' ? 'Min Size' : 'Smaller Text' }}</span>
      </button>

      <button
        type="button"
        class="control-button"
        @click="resetSettings"
        aria-label="Reset all accessibility settings to default"
      >
        <span aria-hidden="true" class="text-xl font-bold">↺</span>
        <span class="control-label">Reset</span>
      </button>
    </div>
  </nav>
</template>

<script setup lang="ts">
const isHighContrast = ref(false)
const fontSize = ref<'normal' | 'large' | 'xlarge' | 'xxlarge'>('normal')

// Load saved preferences on mount
onMounted(() => {
  if (typeof window !== 'undefined') {
    isHighContrast.value = localStorage.getItem('highContrast') === 'true'
    fontSize.value = (localStorage.getItem('fontSize') as any) || 'normal'
    applySettings()
  }
})

function toggleHighContrast() {
  isHighContrast.value = !isHighContrast.value
  saveAndApply()
}

function increaseFontSize() {
  if (fontSize.value === 'normal') {
    fontSize.value = 'large'
  } else if (fontSize.value === 'large') {
    fontSize.value = 'xlarge'
  } else if (fontSize.value === 'xlarge') {
    fontSize.value = 'xxlarge'
  }
  saveAndApply()
}

function decreaseFontSize() {
  if (fontSize.value === 'xxlarge') {
    fontSize.value = 'xlarge'
  } else if (fontSize.value === 'xlarge') {
    fontSize.value = 'large'
  } else if (fontSize.value === 'large') {
    fontSize.value = 'normal'
  }
  saveAndApply()
}

function resetSettings() {
  isHighContrast.value = false
  fontSize.value = 'normal'
  saveAndApply()
}

function getFontSizeLabel() {
  switch (fontSize.value) {
    case 'normal': return 'Normal (18px)'
    case 'large': return 'Large (22px)'
    case 'xlarge': return 'Extra Large (26px)'
    case 'xxlarge': return 'Extra Extra Large (32px)'
    default: return 'Normal'
  }
}

function saveAndApply() {
  if (typeof window !== 'undefined') {
    localStorage.setItem('highContrast', String(isHighContrast.value))
    localStorage.setItem('fontSize', fontSize.value)
    applySettings()
  }
}

function applySettings() {
  if (typeof document !== 'undefined') {
    const body = document.body

    // High contrast
    if (isHighContrast.value) {
      body.classList.add('high-contrast')
    } else {
      body.classList.remove('high-contrast')
    }

    // Font size
    body.classList.remove('large-text', 'extra-large-text', 'extra-extra-large-text')
    if (fontSize.value === 'large') {
      body.classList.add('large-text')
    } else if (fontSize.value === 'xlarge') {
      body.classList.add('large-text', 'extra-large-text')
    } else if (fontSize.value === 'xxlarge') {
      body.classList.add('large-text', 'extra-large-text', 'extra-extra-large-text')
    }
  }
}
</script>

<style scoped>
.control-button {
  @apply inline-flex flex-col items-center justify-center gap-1 min-h-11 min-w-11 px-3 py-2 text-sm;
  @apply bg-white text-text border-2 border-border rounded cursor-pointer transition-all duration-200;
}

.control-button:hover {
  @apply bg-bg-alt border-primary;
}

.control-button-active {
  @apply bg-primary text-white border-primary;
}

.control-button:disabled {
  @apply opacity-50 cursor-not-allowed bg-bg-alt text-text-light border-border;
}

.control-button:disabled:hover {
  @apply bg-bg-alt border-border;
}

.control-label {
  @apply text-xs font-medium whitespace-nowrap;
}

@media (min-width: 640px) {
  .control-button {
    @apply flex-row gap-2 px-4;
  }

  .control-label {
    @apply text-sm;
  }
}

@media (prefers-reduced-motion: reduce) {
  .control-button {
    @apply transition-none;
  }
}
</style>
