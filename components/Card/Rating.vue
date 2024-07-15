<template>
  <div class="flex flex-row flex-nowrap gap-4 pt-4">
    <div class="bg-primary-50 rounded-full w-10 h-10 relative flex items-center justify-center flex-none overflow-hidden">
      <img loading="lazy" :src="rate.picture" referrerpolicy="no-referrer" :alt="rate.name" class="object-cover object-center h-full w-full" />
    </div>

    <div class="flex flex-col gap-4 items-stretch justify-stretch grow">
      <div class="flex flex-col gap-2 items-start justify-start">
        <div class="flex flex-row items-center justify-between relative w-full">
          <div class="text-neutral-900 title title--h4 font-bold">{{ rate.name }}</div>
        </div>

        <DataViewStars :rating="rate.rate" />

        <div v-if="false" class="flex flex-row gap-2 items-start justify-start relative">
          <Badge size="small">Pontual</Badge>
          <Badge size="small">Organização</Badge>
          <Badge size="small">atenção</Badge>
        </div>
      </div>

      <div class="text-neutral-600 text-left text-body-sm">
        {{ rate.review }}
      </div>

      <div class="text-neutral-600 text-right text-h6">{{ formatDateMin(rate.created_at) }}</div>
    </div>
  </div>
</template>

<script setup>
import { formatDateMin } from "~/helpers";

const props = defineProps({
  type: {
    type: String,
    default: "therapist",
  },
  rate: Object,
});
</script>
