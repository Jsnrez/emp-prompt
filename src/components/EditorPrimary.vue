<script setup>
import { ref, computed } from 'vue';
import SlidePreview from './SlidePreview.vue';
import SidebarEditor from './SidebarEditor.vue';
import SimButton from './SimButton.vue'

const slideElements = ref([
  {
    id: '1', type: 'text', content: '# Click me to \n\nedit.',
    x: 50, y: 50, width: 300, height: 100
  },
  {
    id: '2', type: 'image', src: 'https://placehold.co/600x400',
    x: 400, y: 200, width: 300, height: 150
  }
]);
const selectedElementId = ref(null);

/**
 *  Computed Properties
 */
const selectedElement = computed(() => {
  return slideElements.value.find(el => el.id === selectedElementId.value) || null;
});

/**
 * Methods
 */
function handleSelectElement(elementId) {
  selectedElementId.value = elementId;
}
/**
 * Handles updates from sidebar and dragging via x/y coordinates
 */
function handleUpdateElement(updatePayload) {
  const elementIndex = slideElements.value.findIndex(el => el.id === updatePayload.id);
  if (elementIndex !== -1) {
    const payload = { ...updatePayload };
    if (payload.x !== undefined) payload.x = Math.round(payload.x);
    if (payload.y !== undefined) payload.y = Math.round(payload.y);

    // Assign values
    slideElements.value[elementIndex] = {
      ...slideElements.value[elementIndex],
      ...payload
    };
  }
}

function handleDeleteElement(elementId) {
    slideElements.value = slideElements.value.filter(el => el.id !== elementId);
    // Unselect Deleted Element
    if (selectedElementId.value === elementId) {
        selectedElementId.value = null;
    }
}
function addTextElement() {
    const date = new Date();
    const newTextElement = {
        id: date.toISOString(),
        type: 'text',
        content: 'New Text Block',
        x: 20,
        y: 20,
        width: 200,
        height: 50
    };
    slideElements.value.push(newTextElement);
    selectedElementId.value = newTextElement.id;
}

function addImageElement() {
  const date = new Date();
    const newImageElement = {
        id: date.toISOString(),
        type: 'image',
        src: 'https://placehold.co/600x400',
        x: 50,
        y: 40,
        width: 150,
        height: 150
    };
    slideElements.value.push(newImageElement);
    selectedElementId.value = newImageElement.id;
}

</script>

<template>
  <div class="editor-layout">
    <div class="toolbar p-2">
      <SimButton @click="addTextElement">Add Text</SimButton>
      <SimButton @click="addImageElement">Add Image</SimButton>
    </div>
    <div class="main-area">
      <SlidePreview :slide-elements="slideElements" :selected-element-id="selectedElementId"
        @select-element="handleSelectElement" @update-element-position="handleUpdateElement" />
      <SidebarEditor :selected-element="selectedElement" @update-element="handleUpdateElement"
        @delete-element="handleDeleteElement" />
    </div>
  </div>
</template>

<style scoped>
.editor-layout {
  display: grid;
  grid-template-rows: auto 1fr;
  height: 100vh;
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