<template>
  <section class="reset-pass-page flex items-center justify-center py-10 px-4 h-full">
    <div class="bg-card rounded-lg border-solid border-neutral-200 border w-full max-w-xl pt-14 px-4 md:px-10 pb-8 mx-auto shadow-xsmall">
      <h1 class="text-neutral-900 text-center title title--h4 font-semibold mb-2">Recupere sua senha</h1>
      <p class="text-neutral-600 text-center text-body-lg">Você precisa estar logado em uma conta para ter acesso aos dados de contato do profissional.</p>

      <Form v-if="!successSend" @submit="getReset" :validation-schema="schema" autocomplete="on" class="flex flex-col gap-6 mt-8">
        <FieldInput name="email" label="E-mail" type="email" placeholder="seu.email@email.com" autocomplete="email" />

        <Button block class="mt-2" :loading="loading"> Enviar e-mail </Button>
      </Form>

      <div v-else class="mt-10 p-4 border border-success-200 bg-success-50 rounded-md">
        <div v-if="successSend" class="w-full text-center mb-12">
          <div class="text-h4-s text-success-800">E-mail enviado</div>
          <div class="text-body text-success-700 mt-2">Enviamos um e-mail com instruções para recuperação de senha.</div>
        </div>

        <Button :disabled="disabledNewReset" size="small" color="linkError" class="mx-auto" @click="newReset" round>Não recebi meu código</Button>
        <div class="w-full text-center text-body-sm text-neutral-600">Aguarde {{ seconds }} segundos antes</div>
      </div>

      <div class="rounded-md pt-2 pr-3 pb-2 pl-3 flex flex-row gap-2 items-center justify-center mt-20">
        <div class="text-center relative text-action-sm text-neutral-600">
          <span>Ainda, não tem uma conta? <NuxtLink to="/auth/register" class="text-primary"> Cadastre-se aqui</NuxtLink></span>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { useUserStore } from "~~/stores";
import * as yup from "yup";

definePageMeta({
  layout: "auth",
});

const Toast = useState("toast").value;
const store = useUserStore();
const router = useRouter();

const loading = ref(false);
const successSend = ref(false);
const seconds = ref(45);
const disabledNewReset = ref(true);

const schema = yup.object({
  email: yup.string().required("Informe um e-mail para continuar").email("Infome um e-mail válido para continuar"),
});

function getReset(values) {
  loading.value = true;

  store
    .resetPassword(values.email)
    .then(
      () => {
        loading.value = false;
        successSend.value = true;
        countDown();
        Toast.success("E-mail de recuperação enviado");
      },
      (error) => {
        Toast.error("Nao conseguimos enviar o email de recuperação");
      }
    )
    .catch((error) => {
      loading.value = false;
      console.error(error.code);
      console.error(error.message);
      Toast.error("Ocorreu um erro interno, tente novamente mais tarde");
    });
}

function countDown() {
  if (seconds.value > 0) {
    setTimeout(() => {
      --seconds.value;
      countDown();
    }, 1000);
  } else if (seconds.value == 0) {
    disabledNewReset.value = false;
  }
}
function newReset() {
  disabledNewReset.value = true;
  successSend.value = false;
  loading.value = false;
  seconds.value = 45;
}
</script>

<style lang="scss"></style>
