<script setup>
import { ref, inject } from 'vue';
import SimButton from './SimButton.vue'

const _handleAddElement = inject('editorAddElement');
const _handleCreateNewSlide = inject('editorCreateSlide');
const _handleDeleteSlide = inject('editorRemoveSlide');
const _handleSavePresentation = inject('editorSavePresentation');
const _handleLoadPresentation = inject('editorLoadPresentation');

// Ref for save file input
const fileInput = ref(null);
// Activates hidden field for browser
function triggerFileInputClick() {
    fileInput.value.click();
}

// Handler for when a file is selected
function handleFileSelected(event) {
    const files = event.target.files;
    // Exit if no file was selected or the dialog was cancelled
    if (!files || files.length === 0) {
        return;
    }

    const file = files[0];

    // Exit if the file type is not application/json
    if (file.type !== "application/json") {
        alert("Please select a valid .json file.");
        // Reset input if the type is wrong
        if (fileInput.value) {
            fileInput.value.value = null;
        }
        return;
    }

    // File is valid and selected
    const reader = new FileReader();

    //Define Events for when the file is loaded or an error occurs

    reader.onload = (e) => {
        try {
            const jsonContent = e.target.result;
            const parsedData = JSON.parse(jsonContent);
            _handleLoadPresentation(parsedData);
        } catch (error) {
            console.error("Error parsing JSON file:", error);
            alert("Failed to parse JSON file. Please ensure it's valid JSON.");
        } finally {
             // Always reset the file input value after processing (success or parse error)
             if (fileInput.value) {
                fileInput.value.value = null;
             }
        }
    };

    reader.onerror = (error) => {
        console.error("Error reading file:", error);
        alert("Failed to read the selected file.");
         if (fileInput.value) {
            fileInput.value.value = null;
         }
    };
    // Actually reading the file
    reader.readAsText(file);
}

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
            <SimButton @click="_handleSavePresentation" title="Save Presentation"><span class="material-icons">download</span></SimButton>
            <SimButton @click="triggerFileInputClick" title="Load Saved Presentation"><span class="material-icons">upload</span></SimButton>
        </section>
        <section class="flex slide-buttons flex-wrap justify-center align-middle pl-4">
            <div class="w-full text-center text-white title">Elements</div>
            <SimButton @click="_handleAddElement('text')" title="Add Text Field"><span class="material-icons">text_fields</span></SimButton>
            <SimButton @click="_handleAddElement('image')" title="Add Image"><span class="material-icons">image</span></SimButton>
        </section>
        <input type="file" id="fileInput" accept=".json" ref="fileInput" class="hidden" @change="handleFileSelected">
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