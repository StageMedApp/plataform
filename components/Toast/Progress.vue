<script setup>
const props = defineProps({ style: String });
</script>

<template>
  <div class="absolute left-0 bottom-0 right-0 h-1 rounded bg-neutral-200 dark:bg-neutral-600" :style="props.style" />
</template>
