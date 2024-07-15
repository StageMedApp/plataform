<script setup>
import { useUserStore } from "~~/stores";

const store = useUserStore();
const router = useRouter();
</script>

<template>
  <div class="auth-layout">
    <header class="w-full h-16 bg-card border-b-[2px] border-neutral-100">
      <div class="container flex flex-col justify-center items-center h-full gap-2">
        <div class="flex justify-between items-center w-full relative gap-6 py-2">
          <NuxtLink :to="localePath('/')" class="relative">
            <Logo file="logo_horizontal.svg" size="30px" />
          </NuxtLink>

          <div class="flex justify-start items-center gap-2">
            <Button color="link" size="small" newPage to="https://stagemed.com.br"> Fale conosco </Button>
          </div>
        </div>
      </div>
    </header>
    <main class="bg-neutral-50">
      <slot />
    </main>
  </div>
</template>

<style lang="scss">
.auth-layout {
  main {
    width: 100vw;
    height: auto;
    min-height: calc(100vh - 64px);
  }
}
</style>
