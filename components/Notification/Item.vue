<script setup lang="ts">
import type { NotivueItem } from "notivue";

export interface ItemNotification {
  mode: string;
  icon: string | boolean;
  extra: any;
}

const props = defineProps<{
  item: NotivueItem<ItemNotification>;
}>();
</script>

<template>
  <div
    class="relative w-full bg-white border border-neutral-100 rounded-lg shadow-xsmall z-100 pointer-events-auto overflow-hidden"
    :role="item.ariaRole"
    :aria-live="item.ariaLive"
  >
    <div class="p-4">
      <div v-if="item.props.mode == 'chat'" class="flex items-start">
        <div class="shrink-0 w-8 aspect-square relative">
          <img class="rounded-full w-full h-full object-cover" :src="item.props.extra.picture" />
        </div>

        <div class="ml-3 w-0 flex-1 pt-0.5">
          <p class="text-body-sm font-semibold">{{ item.props.extra.body.title }}</p>
          <p class="text-body-sm mt-1">{{ item.props.extra.body.content }}.</p>
          <div class="mt-4 flex gap-2">
            <Button tag="a" :href="`/chats/${item.props.extra.chatId}`" size="tiny"> Ver conversa </Button>
          </div>
        </div>

        <div class="ml-4 flex-shrink-0 flex mt-0.5">
          <Icon name="solar:close-circle-line-duotone" @click="item.clear" />
        </div>
      </div>

      <div v-else class="flex items-start">
        <div v-if="item.props.icon !== false" class="shrink-0">
          <Icon :name="item.props.mode" />
        </div>
        <div class="ml-3 grow pt-0.5">
          <p v-if="item.title" class="text-sm leading-5 font-medium">{{ item.title }}</p>
          <p :class="{ 'mt-1': item.title }" class="text-sm leading-5" v-html="item.message"></p>
        </div>
        <Button icon size="small" link class="p-0.5" @click="item.clear">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24">
            <g fill="none" stroke="currentColor" stroke-width="1.5">
              <circle cx="12" cy="12" r="10" opacity=".5" />
              <path stroke-linecap="round" d="m14.5 9.5l-5 5m0-5l5 5" />
            </g>
          </svg>
        </Button>
      </div>
    </div>
  </div>
</template>
