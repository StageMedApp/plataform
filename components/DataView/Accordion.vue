<template>
  <div class="accordion">
    <Disclosure v-slot="{ open }" v-for="(item, index) in list" :key="index">
      <DisclosureButton
        class="bg-card rounded-xl border-solid border-neutral-200 border p-5 flex flex-row items-center justify-between font-medium hover:bg-neutral-100 transition w-full mb-4 shadow-small"
        :class="{ 'bg-neutral-50 shadow-medium': open }"
      >
        <span class="title title--h4">{{ item.title }}</span>
        <Icon name="solar:alt-arrow-down-linear" :class="{ 'rotate-180 transform ': open }" class="text-xl transition" />
      </DisclosureButton>
      <transition
        enter-active-class="transition duration-200 ease-out"
        enter-from-class="translate-y-1 opacity-0"
        enter-to-class="translate-y-0 opacity-100"
        leave-active-class="transition duration-150 ease-in"
        leave-from-class="translate-y-0 opacity-100"
        leave-to-class="translate-y-1 opacity-0"
      >
        <DisclosurePanel class="p-4 mb-4 text-sm text-gray-500">
          <div v-html="item.content"></div>
        </DisclosurePanel>
      </transition>
    </Disclosure>
  </div>
</template>

<script setup>
import { Disclosure, DisclosureButton, DisclosurePanel } from "@headlessui/vue";

const props = defineProps({
  list: {
    type: Array,
    default: () => [],
  },
});
</script>

<style lang="scss"></style>
