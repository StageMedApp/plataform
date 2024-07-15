<script setup>
import { removeElement } from "../utils";

const props = defineProps({
  title: String,
  icon: {
    type: [Boolean, String],
  },
  message: {
    type: String,
  },
  type: {
    type: String,
    default: "info",
  },
  progress: {
    type: Boolean,
  },
  timeout: {
    type: Number,
    default: 5,
  },
  pauseOnHover: {
    type: Boolean,
    default: true,
  },
  extra: Object,
  wide: Boolean,
});
const toastRef = ref();
const active = ref(false);
const isHovering = ref(false);
let interval = undefined;
const timeLeft = ref(0);
const speed = 100;
const instance = getCurrentInstance();

const type = computed(() => (typeof props.icon === "string" ? props.icon : props.type));

const timeLeftPercent = computed(() => Math.round((((timeLeft.value * 100) / (props.timeout * 1000)) * 100) / 100));
const progressStyle = computed(() => `width: ${timeLeftPercent.value}%; transition: width 0.1s linear`);

onMounted(() => {
  active.value = true;
  if (props.timeout > 0) {
    timeLeft.value = props.timeout * 1000;
    interval = setInterval(() => updateTime(), speed);
  }
});

function updateTime() {
  if (!props.pauseOnHover || !isHovering.value) {
    timeLeft.value -= speed;
    if (timeLeft.value === 0) destroy();
  }
}

function destroy(instant = false) {
  clearInterval(interval);
  if (instant) {
    active.value = false;
    setTimeout(() => removeElement(toastRef?.value), 100);
    setTimeout(() => instance?.appContext.app.unmount(), 100);
  } else {
    setTimeout(() => (active.value = false), 100);
    setTimeout(() => removeElement(toastRef?.value), 200);
    setTimeout(() => instance?.appContext.app.unmount(), 200);
  }
}
</script>

<template>
  <div ref="toastRef" @mouseenter="isHovering = true" @mouseleave="isHovering = false">
    <transition
      enter-active-class="transform ease-out duration-300 transition"
      enter-from-class="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2"
      enter-to-class="translate-y-0 opacity-100 sm:translate-x-0"
      leave-active-class="transform ease-in duration-100 transition"
      leave-from-class="translate-y-0 opacity-100 sm:translate-y-0 sm:translate-x-0"
      leave-to-class="translate-y-1 opacity-0 sm:translate-y-0 sm:translate-x-1"
    >
      <div
        v-if="active"
        :class="{ 'max-w-sm': !wide, 'max-w-3xl': wide }"
        class="relative w-full bg-white border border-neutral-100 rounded-lg shadow-xsmall z-100 pointer-events-auto overflow-hidden"
      >
        <ToastProgress v-if="progress && timeout" :style="progressStyle" />
        <div class="p-4">
          <div v-if="type == 'callToRoom'" class="flex items-start">
            <div class="shrink-0 w-8 aspect-square relative">
              <img class="rounded-full w-full h-full object-cover" :src="extra.picture" />
            </div>

            <div class="ml-3 w-0 flex-1 pt-0.5">
              <p class="text-body-sm font-semibold">{{ extra.mentor }} lhe convidou!</p>
              <p class="text-body-sm mt-1">Você foi convidado para fazer a estacao {{ extra.station }}.</p>
              <div class="mt-4 flex gap-2">
                <Button tag="a" :href="`/rooms/${extra.room_id}`" size="tiny"> Ir para sala </Button>
                <Button color="link" size="tiny" @click="destroy(true)"> Ignorar </Button>
              </div>
            </div>
          </div>

          <div v-else-if="type == 'chat'" class="flex items-start">
            <div class="shrink-0 w-8 aspect-square relative">
              <img class="rounded-full w-full h-full object-cover" :src="extra.picture" />
            </div>

            <div class="ml-3 w-0 flex-1 pt-0.5">
              <p class="text-body-sm font-semibold">{{ extra.body.title }}</p>
              <p class="text-body-sm mt-1">{{ extra.body.content }}.</p>
              <div class="mt-4 flex gap-2">
                <Button tag="a" :href="`/chats/${extra.chatId}`" size="tiny"> Ver conversa </Button>
              </div>
            </div>

            <div class="ml-4 flex-shrink-0 flex mt-0.5">
              <Icon name="solar:close-circle-line-duotone" @click="destroy(true)" />
            </div>
          </div>

          <div v-else class="flex items-start">
            <div v-if="props.icon !== false" class="shrink-0">
              <ToastIcons :type="type" />
            </div>
            <div class="ml-3 grow pt-0.5">
              <p v-if="title" class="text-sm leading-5 font-medium">{{ title }}</p>
              <p :class="{ 'mt-1': title }" class="text-sm leading-5" v-html="message"></p>
            </div>
            <Button icon size="small" color link class="p-0.5" @click="destroy(true)">
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
    </transition>
  </div>
</template>
