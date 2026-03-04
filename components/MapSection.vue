<template>
  <section class="exhibition-map" aria-labelledby="space-map-heading">
    <h2 id="space-map-heading" class="heading-section">
      {{ heading }}
    </h2>
    <div class="map-container">
      <svg
        class="map-overlay"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 2990.575 1988.5715"
        aria-hidden="true"
      >
        <polygon
          points="2288.8651 1072.7349 2813.9561 1072.7349 2813.9561 23.7296 2288.8651 1072.7349"
          @click="navigateToExhibition"
          class="interactive-shape"
          data-room="forum"
        />
        <rect
          x="2456.6795"
          y="1301.8486"
          width="519.9532"
          height="242.6111"
          @click="navigateToExhibition"
          class="interactive-shape"
          data-room="shop"
        />
        <rect
          x="1272.1927"
          y="357.4268"
          width="774.3637"
          height="702.4807"
          @click="navigateToExhibition"
          class="interactive-shape"
          data-room="north-gallery"
        />
        <polygon
          points="941.9733 1462.7723 681.6869 1286.7594 493.1801 1566.0241 756.533 1736.0332 941.9733 1462.7723"
          @click="navigateToExhibition"
          class="interactive-shape"
          data-room="media-gallery"
        />
        <polygon
          points="1043.1335 1454.542 1315.4357 1970.572 1619.4877 1809.3018 1345.1323 1287.545 1043.1335 1454.542"
          @click="navigateToExhibition"
          class="interactive-shape"
          data-room="south-gallery"
        />
        <polygon
          points="1516.4631 1585.66 1630.8827 1803.2577 2111.775 1548.1909 2000.1325 1334.7128 1516.4631 1585.66"
          @click="navigateToExhibition"
          class="interactive-shape"
          data-room="library"
        />
        <polygon
          points="1356.5491 1281.5425 1510.7268 1574.7507 2006.1429 1318.3745 1356.5491 1281.5425"
          @click="navigateToExhibition"
          class="interactive-shape"
          data-room="salon"
        />
        <polygon
          points="684.3995 1282.7408 952.8369 1454.542 1043.1335 1454.542 1272.1927 1077.3158 970.4444 872.9802 423.2525 872.9802 423.2525 1282.7408 684.3995 1282.7408"
          @click="navigateToExhibition"
          class="interactive-shape"
          data-room="andrew-petter-hall"
        />
      </svg>
      <img
        src="/museum_map_only.png"
        alt="Museum map showing all exhibition spaces"
        class="museum-map"
      />
    </div>
  </section>
</template>

<script setup lang="ts">
import { nextTick } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const props = withDefaults(
  defineProps<{ basePath?: string; heading?: string }>(),
  {
    basePath: '/exhibitions/current',
    heading: 'Map of Exhibition Space',
  },
)

const scrollToId = (id: string) => {
  const el = document.getElementById(id)
  if (!el) return
  el.scrollIntoView()
  const heading = el.querySelector('h2, h3')
  if (heading) {
    heading.setAttribute('tabindex', '-1')
    ;(heading as HTMLElement).focus()
  }
}

const navigateToExhibition = async (event: Event) => {
  const target = event.target as SVGElement
  const id = target.getAttribute('data-room')
  if (!id) return

  await router.push(`${props.basePath}#${id}`)
  await nextTick()
  scrollToId(id)
}
</script>

<style scoped>
.exhibition-map {
  margin-bottom: 3rem;

  h2 {
    margin-bottom: 1.5rem;
    font-size: 1.75rem;
  }
}

.map-container {
  position: relative;
  width: 100%;
  padding: 40px;
  box-sizing: border-box;
}

.map-overlay {
  position: absolute;
  top: 40px;
  left: 40px;
  width: calc(100% - 80px);
  height: auto;
  z-index: 2;
}

.interactive-shape {
  cursor: pointer;
  transition: opacity 0.2s ease;
  pointer-events: auto;
  fill: #ed1c24;
  opacity: 0;
}

.interactive-shape:hover {
  opacity: 0.1;
}

.museum-map {
  width: 100%;
  height: auto;
  display: block;
  max-width: 100%;
  position: relative;
  z-index: 1;
}

@media (max-width: 768px) {
  .map-container {
    padding: 20px;
  }

  .map-overlay {
    top: 20px;
    left: 20px;
    width: calc(100% - 40px);
  }
}

@media (max-width: 480px) {
  .map-container {
    padding: 10px;
  }

  .map-overlay {
    top: 10px;
    left: 10px;
    width: calc(100% - 20px);
  }
}
</style>
