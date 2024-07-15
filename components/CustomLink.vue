<script setup>
const props = defineProps({
  to: String,
  target: String,
  rel: String,
  noRel: String,
  raplace: Boolean,
});

const propsBind = computed(() => {
  let bind = {
    ...props,
  };

  return bind;
});
</script>

<template>
  <NuxtLink v-bind="propsBind"> <slot /> </NuxtLink>
</template>

<style scoped></style>
