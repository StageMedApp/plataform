<script setup lang="ts">
import type { NotivueItem } from "notivue";

export interface Invite {
  mode: string;
  extra: any;
}

const props = defineProps<{
  item: NotivueItem<Invite>;
}>();
</script>

<template>
  <div
    class="w-full max-w-xs p-4 text-gray-500 bg-white rounded-lg shadow"
    :role="item.ariaRole"
    :aria-live="item.ariaLive"
  >
    <div class="flex">
      <div class="shrink-0 w-8 aspect-square relative">
        <img class="rounded-full w-full h-full object-cover" :src="item.props.extra.picture" />
      </div>

      <div class="ml-3 w-0 flex-1 pt-0.5">
        <p class="text-body-sm font-semibold">{{ item.props.extra.mentor }} lhe convidou!</p>
        <p class="text-body-sm mt-1">Você foi convidado para fazer a estação {{ item.props.extra.station }}.</p>
        <div class="mt-4 flex gap-2">
          <Button tag="a" :href="`/rooms/${item.props.extra.room_id}`" size="tiny"> Ir para sala </Button>
          <Button color="link" size="tiny" @click="item.clear"> Ignorar </Button>
        </div>
      </div>
    </div>
  </div>
</template>
