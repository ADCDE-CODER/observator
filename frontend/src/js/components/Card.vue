<script></script>

<template>
    <div class="card">
        <slot></slot>
    </div>
</template>

<style scoped>
    .card {
        background-color: var(--color-surface-container);
        box-shadow: 0 4px 12px var(--color-shadow);
        width: 25%;
        padding: 2rem;
        border-radius: 20px;
    }
</style>