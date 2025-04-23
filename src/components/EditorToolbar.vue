<script setup>
import { inject } from 'vue';
import SimButton from './SimButton.vue'

const _handleAddElement = inject('editorAddElement');
const _handleCreateNewSlide = inject('editorCreateSlide');
const _handleDeleteSlide = inject('editorRemoveSlide');

</script>

<template>
    <div class="toolbar p-2 bg-violet-800">
        <section class="flex logo px-3 justify-center">
            <img src="/vite.svg">
        </section>
        <section class="flex slide-buttons flex-wrap justify-center align-middle pl-2">
            <div class="w-full text-center text-white title">Slides</div>
            <SimButton @click="_handleCreateNewSlide" class="flex" title="Create New Slide"><span class="material-icons">library_add</span></SimButton>
            <SimButton @click="_handleDeleteSlide" title="Delete Current Slide"><span class="material-icons">delete_forever</span></SimButton>
        </section>
        <section class="flex slide-buttons flex-wrap justify-center align-middle pl-4">
            <div class="w-full text-center text-white title">Elements</div>
            <SimButton @click="_handleAddElement('text')" title="Add Text Field"><span class="material-icons">text_fields</span></SimButton>
            <SimButton @click="_handleAddElement('image')" title="Add Image"><span class="material-icons">image</span></SimButton>
        </section>

    </div>
</template>

<style scoped>
.toolbar {
    display: flex;
    border-bottom: 1px solid #ccc;
}

.toolbar button {
    padding: 5px 10px;
    box-shadow: unset;
    border-radius: unset;
}

.toolbar .slide-buttons {
    padding-top:5px;
}
.toolbar .logo {
    /* background: #f8f8f8; */
    border-radius: 25%;
}

.toolbar .logo:hover img {
    max-width: 110%;
    transition: max-width 1s;
}

.slide-buttons .title {
    border-bottom: 1px rgb(255 255 255 / 49%) solid;
}
</style>