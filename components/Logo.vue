<script setup>
const props = defineProps({
  file: {
    type: String,
    default: "logo.png",
  },
  size: {
    type: String,
    default: "100%",
  },
});
</script>

<template>
  <img :src="`/logo/${file}`" :alt="file" loading="lazy" :style="{ maxHeight: size }" class="w-auto" />
</template>
