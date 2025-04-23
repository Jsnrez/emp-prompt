<script setup>
import ElementPreview from './ElementPreview.vue';

const props = defineProps({
  slideElements: {
    type: Array,
    required: true
  },
  selectedElementId: {
    type: String,
    default: null
  }
});

const emit = defineEmits(['select-element', 'update-element-position']);

function handleElementSelect(elementId) {
  emit('select-element', elementId);
}

function handleElementPositionUpdate(payload) {
  emit('update-element-position', payload);
}

</script>

<template>
  <div class="slide-preview-area">
    <ElementPreview
      v-for="element in slideElements"
      :key="element.id"
      :element="element"
      :isSelected="element.id === selectedElementId"
      @select-element="handleElementSelect"
      @update-element-position="handleElementPositionUpdate"
    />
  </div>
</template>

<style scoped>
.slide-preview-area {
  /** Position relative for drag & drop */
  position: relative;
  width: 100%;
  height: auto;
  aspect-ratio: 16 / 9;
  background-color: #f8f8f8;
  overflow: hidden;
}

</style>