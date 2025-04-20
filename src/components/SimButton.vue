<script></script>

<template>
    <button class="bg-purple-700 hover:bg-purple-500 text-white px-2.5 py-1 my-buttons" type="button">
        <slot></slot>
    </button>
</template>

<style>
.my-buttons {
    border-radius: 0.25rem;
    box-shadow: 0 0 0.5rem rgba(0, 0, 0, 0.3);
    cursor: pointer;
}

.my-buttons:active {
    transform: translateY(1.5px);
    /* Consider translate borderstyle for impression */
}
</style>