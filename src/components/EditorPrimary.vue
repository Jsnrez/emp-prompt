<script setup>
import { ref, computed, provide } from 'vue';
import SlidePreview from './SlidePreview.vue';
import SidebarEditor from './SidebarEditor.vue';
import SimButton from './SimButton.vue'
import { usePresentationStore } from '../stores/presentationStore.js'
import SlideSelectorBelt from './SlideSelectorBelt.vue'

//Store for managing entire presentation
const store = usePresentationStore();
// Which element is being edited / moved
const selectedElementId = ref(null);

/**
 *  Computed Properties
 */
const selectedElement = computed(() => {
  if (!selectedElementId.value) return null;
  return currentSlideElements.value.find(el => el.id === selectedElementId.value) || null;
});

const currentSlideElements = computed(() => store.currentSlideElements);

/**
 * Element Method Handlers
 */
function handleSelectElement(elementId) {
  selectedElementId.value = elementId;
}
/**
 * Handles updates from sidebar and dragging via x/y coordinates
 */
function handleUpdateElement(updatePayload) {
  store.updateElement(updatePayload);
}

function handleDeleteElement(elementId) {
  store.deleteElement(elementId); // Delete in Store First
  if (selectedElementId.value === elementId) {
    selectedElementId.value = null;
  }
}

function handleAddElement(typeS) {
  const newElementId = store.addElement(typeS);
  if (newElementId) {
    selectedElementId.value = newElementId; // Update local selection
  }
}
/**
 * Slide Method Handlers
 */

function handleSelectSlide(slideId) {
  store.currentSlideId = slideId;
  selectedElementId.value = null; // Unselect element
}
provide('editorSetSlide', handleSelectSlide)

function handleCreateNewSlide() {
  store.addSlide();
  selectedElementId.value = null;
}

function handleRemoveSlide(slideId) {
  if (confirm('Are you sure you want to delete this slide?')) {
    store.deleteSlide(slideId);
    selectedElementId.value = null;
  }
}

</script>

<template>
  <div class="editor-layout">
    <div class="toolbar p-2">
      <SimButton @click="handleCreateNewSlide">Add Slide</SimButton>
      <SimButton @click="handleAddElement('text')">Add Text</SimButton>
      <SimButton @click="handleAddElement('image')">Add Image</SimButton>
    </div>
    <div class="main-area">
      <SlidePreview :slide-elements="currentSlideElements" :selected-element-id="selectedElementId"
        @select-element="handleSelectElement" @update-element-position="handleUpdateElement" />

      <SidebarEditor :selected-element="selectedElement" @update-element="handleUpdateElement"
        @delete-element="handleDeleteElement" />

    </div>
    <SlideSelectorBelt :slides="store.slides"></SlideSelectorBelt>
  </div>
</template>

<style scoped>
.editor-layout {
  display: grid;
  grid-template-rows: auto 1fr;
  overflow: hidden;
}

.toolbar {
  border-bottom: 1px solid #ccc;
  background-color: #f0f0f0;
}

.toolbar button {
  margin-right: 10px;
  padding: 5px 10px;
}
</style>