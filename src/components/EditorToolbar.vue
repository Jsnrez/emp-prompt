<script setup>
import { inject } from 'vue';
import SimButton from './SimButton.vue'

const _handleAddElement = inject('editorAddElement');
const _handleCreateNewSlide = inject('editorCreateSlide');
</script>

<template>
    <div class="toolbar p-2">
        <SimButton @click="_handleCreateNewSlide">Add Slide</SimButton>
        <SimButton @click="_handleAddElement('text')">Add Text</SimButton>
        <SimButton @click="_handleAddElement('image')">Add Image</SimButton>
    </div>
</template>

<style scoped>
.toolbar {
  border-bottom: 1px solid #ccc;
  background-color: #f0f0f0;
}

.toolbar button {
  margin-right: 10px;
  padding: 5px 10px;
}
</style>