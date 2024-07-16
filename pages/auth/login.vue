<template>
  <section
    class="register-page flex flex-col-reverse md:flex-row items-stretch gap-4 md:gap-8 p-4 md:p-8 min-h-screen w-screen"
  >
    <div class="grow min-w-0 md:min-w-[65%] lg:min-w-0 flex flex-col items-center justify-center">
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

      <div class="grow">
        <div class="max-w-md mx-auto">
          <h1 class="text-neutral-950 text-h2 font-semibold mb-1">Faça seu login 👋</h1>
          <p class="text-neutral-600 text-body-lg">
            Hoje é um novo dia. O seu dia. Vamos treinar e alcançar a novos horizontes.
          </p>

          <Form @submit="login" :validation-schema="schema" autocomplete="on" class="flex flex-col gap-4 mt-8">
            <FieldInput
              name="email"
              label="E-mail"
              type="email"
              placeholder="lucas.lopes@email.com"
              autocomplete="email"
            />
            <FieldInput
              name="pass"
              label="Senha"
              type="password"
              password
              placeholder="•••••••••"
              autocomplete="current-password"
            />

            <Button block class="mt-2" :loading="loading"> Entrar </Button>
          </Form>

          <div class="flex flex-row justify-end">
            <Button to="/auth/reset-password" class="mt-2 mr-0" color="link" size="tiny">Esqueceu sua senha?</Button>
          </div>

          <div class="flex flex-row gap-4 items-center justify-start my-6">
            <div class="border-b border-solid border-neutral-300 w-full h-0"></div>
            <div class="text-neutral-300 text-left relative text-action-sm">OU</div>
            <div class="border-b border-solid border-neutral-300 w-full h-0"></div>
          </div>

          <Button color="rounded" block :loading="loadingGoogle" @click="continueGoogle">
            <Icon name="logos:google-icon" class="text-2xl" />
            Entre com o Google
          </Button>

          <div class="rounded-md pt-2 pr-3 pb-2 pl-3 flex flex-row gap-2 items-center justify-center mt-14">
            <div class="text-center relative text-action-sm text-neutral-600">
              <span>
                Não tem cadastro?

                <NuxtLink to="/auth/register" class="text-primary"> Crie sua conta gratuitamente </NuxtLink>
              </span>
            </div>
          </div>
        </div>
      </div>

      <div class="pt-8 flex w-full items-end justify-between">
        <p class="text-center text-xs/relaxed text-neutral-500">© Stagemed 2023. Todos os direitos reservados</p>
        <p class="text-center text-xs/relaxed text-neutral-500">
          Desenvolvido por
          <a href="https://nocsistemas.com" target="_blank" rel="noopener noreferrer">Noc sistemas</a>
        </p>
      </div>
    </div>

    <div class="image-side rounded-xl bg-slate-200 overflow-hidden md:w-[35%] lg:w-[40%] h-64 md:h-auto">
      <img :src="imageUrl" alt="" class="w-full h-full object-cover object-top md:object-center" />
    </div>

    <div class="load-page grow min-h-64" v-if="loading || loadingGoogle"></div>
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
const loadingGoogle = ref(false);

const imageUrl = ref("https://images.unsplash.com/photo-1571260899304-425eee4c7efc");

const schema = yup.object({
  email: yup.string().required("Informe um e-mail para continuar").email("Infome um e-mail válido para continuar"),
  pass: yup.string().required("Informe a sua senha de acesso para continuar"),
});

function login(values) {
  loading.value = true;

  store.login(values).then(
    () => {
      router.push("/");
    },
    (error) => {
      loading.value = false;
      console.error(error);
      Toast.error("E-mail ou senha inválido");
    }
  );
}
async function continueGoogle() {
  loadingGoogle.value = true;
  store
    .loginGoogle(false)
    .then(
      () => {
        router.push("/");
      },
      (error) => {
        loadingGoogle.value = false;
        console.error(error);
        Toast.error("Aconteceu algo de errado ao fazer login");
      }
    )
    .catch((error) => {
      loadingGoogle.value = false;
      console.error(error);
      Toast.error("Aconteceu algo de errado ao fazer login");
    });
}
</script>
