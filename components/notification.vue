<template>
  <div class="relative">
    <Popover v-slot="{ open }">
      <PopoverButton :class="open ? '' : 'text-opacity-90'">
        <Button color="link" icon>
          <Icon name="solar:bell-line-duotone" />
          <Badge v-if="showPulse" class="absolute top-2.5 right-[13px]" color="errorDark" size="bullet" />
        </Button>
      </PopoverButton>

      <transition
        enter-active-class="transition duration-200 ease-out"
        enter-from-class="translate-y-1 opacity-0"
        enter-to-class="translate-y-0 opacity-100"
        leave-active-class="transition duration-150 ease-in"
        leave-from-class="translate-y-0 opacity-100"
        leave-to-class="translate-y-1 opacity-0"
      >
        <PopoverPanel class="absolute right-0 z-50 mt-3 w-screen max-w-md">
          <div class="overflow-hidden rounded-2xl shadow-lg border border-neutral-100"></div>
        </PopoverPanel>
      </transition>
    </Popover>
  </div>
</template>

<script setup>
import { useNotificationStore, useUserStore } from "~~/stores";
import { Popover, PopoverButton, PopoverPanel } from "@headlessui/vue";

const notify = useNotificationStore();
const store = useUserStore();
const notifications = computed(() => notify.getNotifications);
const showPulse = computed(() => notify.showPulse);

const router = useRouter();
const open = ref(false);

function viewNotify(id) {
  notify.viewNotification(id);
}

function action(id, action, type) {
  if (action.inPage) {
    router.push(action.link);
    notify.viewNotification(id, true);
  } else if (action.noLink) {
    notify.viewNotification(id, true);
  } else {
    store.get(action.link);
    notify.viewNotification(id, true);
  }

  if (action.closeModal) open.value = false;
}
</script>
