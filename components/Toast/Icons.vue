<template>
  <div v-if="props.type === 'success'" class="border-2 border-green-200 rounded-full w-6 h-6 flex items-center justify-center">
    <Icon name="solar:info-circle-bold-duotone" icon="mdi-check" class="h-4 w-4 text-green-400" />
  </div>
  <div v-else-if="props.type === 'info'" class="border-2 border-blue-200 rounded-full w-6 h-6 flex items-center justify-center">
    <Icon name="solar:info-circle-bold-duotone" icon="bi-info-lg" class="h-4 w-4 text-blue-400" />
  </div>
  <div v-else-if="props.type === 'warning'" class="border-2 border-yellow-200 rounded-full w-6 h-6 flex items-center justify-center">
    <Icon name="solar:info-circle-bold-duotone" class="h-4 w-4 text-yellow-400" />
  </div>
  <div v-else-if="props.type === 'danger'" class="border-2 border-red-200 rounded-full w-6 h-6 flex items-center justify-center">
    <Icon name="solar:info-circle-bold-duotone" class="h-4 w-4 text-red-400" />
  </div>
  <div v-else-if="props.type === 'denied'" class="rounded-full w-6 h-6 flex items-center justify-center">
    <Icon name="solar:info-circle-bold-duotone" icon="mdi-cancel" class="h-4 w-4 text-red-400" />
  </div>
  <div v-else class="rounded-full w-6 h-6 flex items-center justify-center">
    <Icon name="solar:info-circle-bold-duotone" :icon="type" class="h-4 w-4 text-red-400" />
  </div>
</template>

<script lang="ts" setup>
const props = defineProps({
  type: String,
});
</script>
