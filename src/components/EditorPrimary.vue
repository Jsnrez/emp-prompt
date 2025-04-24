<script setup>
import { ref, computed, provide } from 'vue';
import SlidePreview from './SlidePreview.vue';
import SidebarEditor from './SidebarEditor.vue';
import EditorToolbar from './EditorToolbar.vue';
import { usePresentationStore } from '../stores/presentationStore.js';
import SlideSelectorBelt from './SlideSelectorBelt.vue';

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
provide('editorUpdateElement', handleUpdateElement)

function handleDeleteElement(elementId) {
  store.deleteElement(elementId); // Delete in Store First
  if (selectedElementId.value === elementId) {
    selectedElementId.value = null;
  }
}
provide('editorDeleteElement', handleDeleteElement)

function handleAddElement(typeS) {
  const newElementId = store.addElement(typeS);
  if (newElementId) {
    selectedElementId.value = newElementId; // Update local selection
  }
}

provide('editorAddElement', handleAddElement)
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
provide('editorCreateSlide', handleCreateNewSlide)


function handleRemoveSlide(slideId) {
  if (confirm('Are you sure you want to delete this slide?')) {
    store.deleteSlide(slideId);
    selectedElementId.value = null;
  }
}
provide('editorRemoveSlide', handleRemoveSlide)

function handleSavePresentation() {
  const inputStr = "windowPresentation";

  store.savePresentation(inputStr)
}
provide('editorSavePresentation', handleSavePresentation)

function handleLoadPresentation(inputJson) {
  store.loadPresentation(inputJson)
}
provide('editorLoadPresentation', handleLoadPresentation)

</script>

<template>
  <div class="editor-layout">
    <EditorToolbar></EditorToolbar>
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
</style>