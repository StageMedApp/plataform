<template>
  <div class="profile-page">
    <div class="container">
      <div class="card mb-6">
        <div class="card-head">
          <h3 class="title title--card-sm">Notificações</h3>
        </div>

        <div class="relative grid gap-8 bg-card p-6 max-h-[580px] overflow-y-auto overflow-x-hidden">
          <div v-if="isLoading" class="animate-pulse h-1.5 w-full bg-green-600 absolute top-0 left-0"></div>

          <CardEmpty type="notification" v-if="notifications.length == 0" />

          <div v-else v-for="n in notifications" :key="n._id" class="flex items-start gap-4">
            <img class="h-10 mt-0.5 rounded-full" v-if="n.body.picture" :src="n.body.picture" />

            <div class="flex-1">
              <strong class="block font-medium text-neutral-900"> {{ n.body.title }} </strong>
              <p class="mt-0.5 text-sm text-neutral-700">{{ n.body.content }}</p>

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
    </div>
  </div>
</template>

<script setup>
import { useNotificationStore, useUserStore } from "~~/stores";
import { Popover, PopoverButton, PopoverPanel } from "@headlessui/vue";

definePageMeta({
  title: "Notificações",
});
useHead({
  title: "Notificações",
});

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
