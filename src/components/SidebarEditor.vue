<script setup>
import SimButton from './SimButton.vue';


const props = defineProps({
  selectedElement: {
    type: [Object, null],
    default: null
  }
});

const emit = defineEmits(['update-element', 'delete-element']);

function updateElement(property, value) {
  if (!props.selectedElement) return;

  // Convert numeric input values from strings
  const numericProps = ['x', 'y', 'width', 'height'];
  const updatedValue = numericProps.includes(property) ? Number(value) : value;

  emit('update-element', {
    id: props.selectedElement.id,
    [property]: updatedValue
  });
}

function deleteElement() {
  // TODO: Add a custom modal element for confirmation
  if (!props.selectedElement) return;
  if (confirm('Are you sure you want to delete this element?')) {
    emit('delete-element', props.selectedElement.id);
  }
}

</script>

<template>
  <div class="sidebar-editor">
    <div v-if="selectedElement">
      <p>Editing Element ID: {{ selectedElement.id }} (Type: {{ selectedElement.type }})</p>

      <div class="form-field">
        <label>Position X:</label>
        <input type="number" :value="selectedElement.x" @input="updateElement('x', $event.target.value)" /> px
      </div>
      <div class="form-field">
        <label>Position Y:</label>
        <input type="number" :value="selectedElement.y" @input="updateElement('y', $event.target.value)" /> px
      </div>
      <div class="form-field">
        <label>Width:</label>
        <input type="number" :value="selectedElement.width" @input="updateElement('width', $event.target.value)" /> px
      </div>
      <div class="form-field">
        <label>Height:</label>
        <input type="number" :value="selectedElement.height" @input="updateElement('height', $event.target.value)" /> px
      </div>

      <hr />

      <div v-if="selectedElement.type === 'text'">
        <label>Markdown Content:</label>
        <textarea :value="selectedElement.content" @input="updateElement('content', $event.target.value)"
          rows="10"></textarea>
      </div>

      <div v-if="selectedElement.type === 'image'">
        <div class="form-field">
          <label>Image URL:</label>
          <input type="text" :value="selectedElement.src" @input="updateElement('src', $event.target.value)" />
        </div>
      </div>

      <hr />

      <SimButton @click="deleteElement" class="bg-red-600 hover:bg-red-400" color="red">Delete Element</SimButton>

    </div>
    <div v-else>
      <p>Select an element on the slide to edit its properties.</p>
    </div>
  </div>
</template>

<style scoped>
.sidebar-editor {
  padding: 15px;
  border-left: 1px solid #ccc;
  min-width: 250px;
  background-color: #fdfdfd;
}

.form-field {
  margin-bottom: 10px;
}

.form-field label {
  display: block;
  margin-bottom: 3px;
  font-weight: bold;
}

.form-field input[type="number"],
.form-field input[type="text"],
.form-field textarea {
  width: 95%;
  padding: .4em;
  border: 1px solid #a9a9a9;
  border-radius: 3px;
}

textarea {
  width: 95%;
  padding: .4em;
}
</style>