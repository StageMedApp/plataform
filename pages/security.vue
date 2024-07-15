<template>
  <div class="profile-page">
    <div class="container">
      <div class="card">
        <div class="card-head">
          <h3 class="title title--card-sm">Segurança</h3>
        </div>

        <div class="grid gap-3">
          <div class="flex items-center justify-between">
            <div class="text-body">Senha</div>
            <Button color="linkNeutral" size="tiny">Alterar senha</Button>
          </div>
          <div class="flex items-center justify-between">
            <div class="text-body">E-mail</div>
            <Button color="linkSuccess" size="tiny" disabled>Verificado</Button>
          </div>
          <div class="flex items-center justify-between">
            <div class="text-body">Celular</div>
            <Button color="linkNeutral" size="tiny" disabled>Em breve</Button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useUserStore } from "~~/stores";

definePageMeta({
  title: "Segurança",
});
useHead({
  title: "Segurança",
});

const store = useUserStore();
const currentUser = computed(() => store.currentUser);
</script>
