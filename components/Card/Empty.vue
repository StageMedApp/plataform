<template>
  <div id="EmptyCard">
    <img loading="lazy" v-if="img || typeObj[type].img" :src="img || typeObj[type].img" :alt="alt || typeObj[type].alt" />

    <div class="text-h4-s mt-10 text-neutral-900">{{ title || typeObj[type].title }}</div>
    <div class="text-body mt-4 text-neutral">{{ desc || typeObj[type].desc }}</div>

    <Button tag="div" size="small" class="!px-10 w-auto mt-10" v-if="action || (typeObj[type].action && !to)" @click="callback">{{ action || typeObj[type].action }}</Button>
    <Button size="small" class="!px-10 w-auto mt-10" v-if="action || (typeObj[type].action && to)" :to="to">{{ action || typeObj[type].action }}</Button>
  </div>
</template>

<script setup>
const props = defineProps({
  type: {
    type: String,
    default: "empty",
  },
  img: String,
  alt: String,
  title: String,
  desc: String,
  action: String,
  to: String,
});

const emit = defineEmits(["goAction"]);

function callback(e) {
  emit("goAction", e);
}

const typeObj = {
  empty: {
    img: "/images/empty/card.svg",
    alt: "",
    title: "Favoritos vazio",
    desc: "Você ainda não adicionou nada aos seus favoritos, Pesquise e adicione aos favoritos para ver depois.",
    action: false,
  },

  plan: {
    img: "/images/empty/plan.svg",
    alt: "",
    title: "Nenhum plano ativo",
    desc: "Você ainda não assinou nenhum plano, assine agora mesmo e acesse todos os benefícios.",
  },

  notification: {
    img: "/images/empty/notification.svg",
    alt: "",
    title: "Sem notificação",
    desc: "Assim que você receber notificação, elas apareceram aqui",
    action: false,
  },

  list: {
    img: "/images/empty/list.svg",
    alt: "",
    title: "Nenhuma estação encontrada",
    desc: "Não encontramos nenhuma estação na sua conta, inicie uma estação ou entre em contato se achar que é um erro.",
    action: "Procurar mentor",
  },

  search: {
    img: "/images/empty/list.svg",
    alt: "",
    title: "Nenhuma estação encontrada",
    desc: "Não encontramos nenhuma estação na sua conta, inicie uma estação ou entre em contato se achar que é um erro.",
  },

  message: {
    img: "/images/empty/message.svg",
    alt: "",
    title: "Envie um oi para começar",
    desc: "Inicie uma conversa de forma amigável, sempre é a melhor escolha.",
  },
};
</script>

<style lang="scss" scoped>
#EmptyCard {
  @apply mx-auto w-full max-w-lg text-center flex flex-col py-6 px-4 items-center justify-center;

  img {
    @apply mx-auto w-3/5 max-w-[150px] object-contain h-auto;
  }
}
</style>
