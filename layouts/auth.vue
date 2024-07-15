<script setup>
import { useUserStore } from "~~/stores";

const store = useUserStore();
const router = useRouter();

if (store.loggedIn) {
  if (!store.current?.account?.basic?.completed || !store.current?.emailVerified) router.push("/auth/register");
  else router.push("/");
}
</script>

<template>
  <main class="auth-layout bg-white">
    <slot />
  </main>
</template>

<style lang="scss">
.auth-layout {
  main {
    width: 100vw;
    height: auto;
  }
}
</style>
