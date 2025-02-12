<template>
  <section class="reset-pass-page flex flex-col items-center justify-center py-10 px-4 h-full">
    <header class="w-full h-16">
      <div class="container flex flex-col justify-center items-center h-full gap-2">
        <div class="flex justify-between items-center w-full relative gap-6 pb-8">
          <NuxtLink :to="localePath('/')" class="relative">
            <Logo file="logo_horizontal.svg" size="30px" />
          </NuxtLink>

          <div class="flex justify-start items-center gap-2">
            <Button color="link" size="small" newPage to="https://stagemed.com.br"> Fale conosco </Button>
          </div>
        </div>
      </div>
    </header>

    <div class="bg-card rounded-2xl w-full max-w-xl pt-14 px-4 md:px-10 pb-8 mx-auto grow">
      <h1 class="text-neutral-950 text-h2 font-semibold mb-1 text-center">Recupere sua senha 🫣</h1>
      <p class="text-neutral-600 text-body-lg text-center">
        Esqueceu sua senha? Não se preocupe, te ajudamos a recuperar, basta informar o email cadastrado.
      </p>

      <Form
        v-if="!successSend"
        @submit="getReset"
        :validation-schema="schema"
        autocomplete="on"
        class="flex flex-col gap-6 mt-8"
      >
        <FieldInput name="email" label="E-mail" type="email" placeholder="seu.email@email.com" autocomplete="email" />

        <Button block class="mt-2" :loading="loading"> Enviar e-mail </Button>
      </Form>

      <div v-else class="mt-10 p-4 border border-success-100 bg-success-50 rounded-xl">
        <div v-if="successSend" class="w-full text-center mb-12">
          <div class="text-h4-s text-success-800">E-mail enviado</div>
          <div class="text-body text-success-700 mt-2">
            Enviamos um e-mail com instruções para você recuperar sua senha.
          </div>
        </div>

        <Button :disabled="disabledNewReset" size="small" color="linkError" class="mx-auto" @click="newReset" round
          >Não recebi meu código</Button
        >

        <div v-if="seconds" class="w-full text-center text-body-sm text-neutral-600">
          Aguarde {{ seconds }} segundos
        </div>
      </div>

      <div class="rounded-md pt-2 pr-3 pb-2 pl-3 flex flex-row gap-2 items-center justify-center mt-14">
        <div class="text-center relative text-action-sm text-neutral-600">
          <span>
            Não tem cadastro?

            <NuxtLink to="/auth/register" class="text-primary"> Crie sua conta gratuitamente </NuxtLink>
          </span>
        </div>
      </div>
    </div>

    <div class="pt-8 flex w-full justify-center">
      <p class="text-center text-xs/relaxed text-neutral-500">© Stagemed 2023. Todos os direitos reservados</p>
    </div>
  </section>
</template>

<script setup>
import { useUserStore } from "~~/stores";
import * as yup from "yup";
import { push } from "notivue";

definePageMeta({
  layout: "auth",
});

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
        push.success("E-mail de recuperação enviado");
      },
      (error) => {
        push.error("Nao conseguimos enviar o email de recuperação");
      }
    )
    .catch((error) => {
      loading.value = false;
      console.error(error.code);
      console.error(error.message);
      push.error("Ocorreu um erro interno, tente novamente mais tarde");
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
