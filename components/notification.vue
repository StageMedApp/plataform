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
          <div class="overflow-hidden rounded-2xl shadow-lg border border-neutral-100">
            <div class="relative grid gap-8 bg-card p-6 max-h-[580px] overflow-y-auto overflow-x-hidden">
              <div v-if="isLoading" class="animate-pulse h-1.5 w-full bg-green-600 absolute top-0 left-0"></div>

              <CardEmpty type="notification" v-if="notifications.length == 0" />

              <div v-else v-for="n in notifications" :key="n._id" class="flex items-start gap-4">
                <img class="h-10 mt-0.5 rounded-full" v-if="n.body.picture" :src="n.body.picture" />

                <div class="flex-1">
                  <strong class="block font-medium text-gray-900"> {{ n.body.title }} </strong>
                  <p class="mt-0.5 text-sm text-gray-700">{{ n.body.content }}</p>

                  <div v-if="n.body?.actions" class="flex items-center gap-2 mt-2">
                    <Button
                      @click="action(n._id, n.body?.actions?.accept, 'accept')"
                      v-if="n.body?.actions?.accept"
                      size="tiny"
                      >{{ n.body?.actions?.accept.text }}</Button
                    >
                    <Button
                      @click="action(n._id, n.body?.actions?.decline, 'decline')"
                      v-if="n.body?.actions?.decline"
                      size="tiny"
                      color="linkError"
                      >{{ n.body?.actions?.decline.text }}</Button
                    >
                  </div>
                </div>

                <Button
                  v-if="!n.read_at && n.show_read"
                  size="small"
                  color="linkNeutral"
                  icon
                  class="!p-2"
                  @click="viewNotify(n._id)"
                >
                  <Icon name="solar:eye-bold-duotone" size="1.5em" />
                </Button>
              </div>
            </div>
          </div>
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
