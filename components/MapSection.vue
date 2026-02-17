<template>
  <section class="exhibition-map" aria-labelledby="space-map-heading">
    <h2 id="space-map-heading" class="heading-section">
      Map of Exhibition Space
    </h2>
    <img
      src="/museum_map_only.png"
      alt="Museum map showing all exhibition spaces"
      class="museum-map"
    />
  </section>
</template>

<script setup lang="ts"></script>

<style scoped>
.exhibition-map {
  margin-bottom: 3rem;

  h2 {
    margin-bottom: 1.5rem;
    font-size: 1.75rem;
  }
}

.museum-map {
  width: 100%;
  height: auto;
  display: block;
  padding: 40px;
  box-sizing: border-box;
  max-width: 100%;
}

@media (max-width: 768px) {
  .museum-map {
    padding: 20px;
  }
}

@media (max-width: 480px) {
  .museum-map {
    padding: 10px;
  }
}
</style>
