<script setup>
// Renders slide in Fullscreen Presentations
import ElementPreview from "./ElementPreview.vue";

const props = defineProps({
  slideElements: {
    type: Array,
    required: true,
  },
});
</script>

<template>
  <div class="slide-preview-area">
    <ElementPreview
      v-for="element in slideElements"
      :key="element.id"
      :element="element"
    />
  </div>
</template>

<style scoped>
.slide-preview-area {
  position: relative;
  width: 100%;
  height: auto;
  aspect-ratio: 16 / 9;
  background-color: #f8f8f8;
  overflow: hidden;
}
@media screen and (min-width: 1700px) {
  .slide-preview-area {
    width: 85%;
  }
}
</style>
