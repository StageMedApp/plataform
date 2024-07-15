<script setup>
import { useUserStore, useGlobalStore, useNotificationStore } from "~~/stores";
import { onAuthStateChanged } from "firebase/auth";

useHead({
  titleTemplate: (title) => (title ? `${title} | Stagemed` : "Stagemed - Treine e Revalide sua residência"),
});

const auth = useState("auth").value;
const socket = useState("socket").value;

const Toast = useState("toast").value;
const store = useUserStore();
const notification = useNotificationStore();
const global = useGlobalStore();
const router = useRouter();
const route = useRoute();

const socialShareIsOpem = computed(() => global.socialShareOpem);

var interval = undefined;

socket.on("notification", (data) => {
  if (data.type == "chat") {
    let pathArray = route.path.split("/");
    if (pathArray[pathArray.length - 1] != data.chatId) {
      Toast.chat(data);
    }
  } else Toast.callToRoom(data);
});

socket.on("notificationReload", () => {
  notification.loadNotifications();
});

onBeforeMount(async () => {
  await store.generateToken();
});

var statusLogin = null;

onMounted(async () => {
  if (!statusLogin)
    statusLogin = onAuthStateChanged(auth, async (user) => {
      console.log("change status");
      if (user) {
        await store.getAccessToken(true);

        await store.fetchUser(user, false);
        notification.loadNotifications();

        socket.emit("userLogin", store.current._id);

        reloadData();

        if (store.loggedIn && route.path == "/auth/login") router.push("/");
      } else {
        socket.emit("userLogout", store.current._id);
        await store.noUser();
        if (interval) clearInterval(interval);
      }
    });
});

function reloadData() {
  interval = setInterval(() => {
    store.getChatsPin();
  }, 2000);
}
</script>

<template>
  <div>
    <NuxtLoadingIndicator />

    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>

    <SocialShareModal v-if="socialShareIsOpem" />
  </div>
</template>
