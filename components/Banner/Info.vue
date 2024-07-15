<script setup>
const props = defineProps({
  text: {
    type: String,
    default: "primary",
  },
  link: {
    type: Number,
    default: 0,
  },
});
</script>

<template>
  <div class="bg-primary text-neutral-50 pt-6 pb-2 mt-14">
    <div class="container flex flex-col items-center justify-center gap-2">
      <p class="text-center">
        O conteúdo deste portal é de caráter informativo. stagemed.com.br não oferece conselho médico, diagnósticos ou
        tratamentos.
      </p>
      <Button to="/avisos" color="linkWhite"> Saiba mais </Button>
    </div>
  </div>
</template>
