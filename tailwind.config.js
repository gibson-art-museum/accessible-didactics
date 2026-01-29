/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './components/**/*.{js,vue,ts}',
    './layouts/**/*.vue',
    './pages/**/*.vue',
    './plugins/**/*.{js,ts}',
    './app.vue',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: 'var(--color-primary)',
          dark: 'var(--color-primary-dark)',
        },
        text: {
          DEFAULT: 'var(--color-text)',
          light: 'var(--color-text-light)',
        },
        bg: {
          DEFAULT: 'var(--color-bg)',
          alt: 'var(--color-bg-alt)',
        },
        border: 'var(--color-border)',
        focus: 'var(--color-focus)',
        error: 'var(--color-error)',
        success: 'var(--color-success)',
      },
      fontSize: {
        'base-custom': 'var(--font-size-base)',
        'large-custom': 'var(--font-size-large)',
        'xlarge-custom': 'var(--font-size-xlarge)',
        'xxlarge-custom': 'var(--font-size-xxlarge)',
      },
    },
  },
  plugins: [],
}
