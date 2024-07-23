<template>
  <section
    class="register-page flex flex-col md:flex-row items-stretch gap-4 md:gap-8 p-4 md:p-8 min-h-screen w-screen"
  >
    <div
      :class="{
        'rounded-xl bg-slate-200 overflow-hidden transition-all sticky top-0': true,
        'md:w-[35%] lg:w-[40%] h-64 md:h-auto': step == 1,
        'md:w-72 h-64 md:h-auto': step != 1,
      }"
    >
      <img :src="imageUrl" alt="" class="w-full h-full object-cover" />
    </div>

    <div class="grow min-w-0 md:min-w-[65%] lg:min-w-0 flex flex-col items-center justify-center">
      <header class="w-full h-16">
        <div class="flex flex-col justify-center items-center h-full gap-2">
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

      <div class="grow w-full h-full flex flex-col">
        <div class="max-w-lg mx-auto grow" v-if="step == 1">
          <h1 class="text-neutral-950 text-h2 font-semibold mb-1" @click="register('dffg')">
            {{ labels[step - 1].title }}
          </h1>
          <p class="text-neutral-600 text-body-lg">{{ labels[step - 1].description }}</p>

          <Form @submit="register" :validation-schema="schema" autocomplete="on" class="flex flex-col gap-4 mt-8">
            <FieldInput name="name" label="Nome completo" type="text" placeholder="Luana Silva" autocomplete="name" />
            <FieldInput
              name="email"
              label="E-mail"
              type="email"
              placeholder="luana.silva@email.com"
              autocomplete="email"
            />
            <FieldInput
              name="pass"
              label="Senha"
              type="password"
              placeholder="•••••••••"
              password
              autocomplete="current-password"
            />

            <Button block class="mt-2" :loading="loading"> Continuar <SvgoChevronRight /> </Button>
          </Form>

          <div class="mt-2 text-action-sm !font-light text-neutral">
            Ao continuar você automaticamente concorda com nossos
            <NuxtLink to="/policies/termos-de-uso" target="_blank" rel="noreferrer" class="text-primary font-semibold">
              Termos de uso.
            </NuxtLink>
          </div>

          <div class="flex flex-row gap-4 items-center justify-start my-6">
            <div class="border-b border-solid border-neutral-300 w-full h-0"></div>
            <div class="text-neutral-300 text-left relative text-action-sm">OU</div>
            <div class="border-b border-solid border-neutral-300 w-full h-0"></div>
          </div>

          <Button color="rounded" block :loading="loadingGoogle" @click="continueGoogle">
            <Icon name="logos:google-icon" class="text-2xl" />
            Continuar com o Google
          </Button>

          <div
            class="flex flex-row gap-2 items-center justify-center mt-14 text-action-sm text-center text-neutral-600"
          >
            <span>
              Já tem uma conta?
              <NuxtLink to="/auth/login" class="text-primary">Faça login</NuxtLink>
            </span>
          </div>
        </div>

        <section v-if="step != 1" class="register-page-steps flex flex-col h-full pb-4 grow">
          <div class="border-neutral-200 w-full relative mb-10">
            <div class="flex justify-between flex-col-reverse lg:flex-row gap-8 lg:gap-2">
              <div class="flex flex-col">
                <h1 class="text-neutral-950 text-h3 md:text-h2 font-semibold mb-1 text-center lg:text-left">
                  {{ labels[step - 1].title }}
                </h1>
                <p class="text-neutral-600 text-body md:text-body-lg text-center lg:text-left max-w-lg mx-auto">
                  {{ labels[step - 1].description }}
                </p>
              </div>

              <div class="flex items-center justify-center lg:justify-end gap-4">
                <div
                  v-for="st in steps"
                  :key="st.step"
                  class="p-3 flex gap-1.5 items-center rounded-2xl transition-all duration-500 overflow-hidden w-full h-16"
                  :class="{
                    'bg-neutral-50/50 max-w-16 outline outline-1 outline-neutral-200': step != st.step,
                    'bg-white max-w-[220px] outline outline-2 outline-primary-600': step == st.step,
                  }"
                >
                  <div class="rounded-lg size-10 flex items-center justify-center shrink-0 bg-neutral-50">
                    <Icon :name="st.icon" :class="st.color" />
                  </div>
                  <div
                    class="mr-2 h-10 flex flex-col justify-evenly transition-all duration-500 w-[150px]"
                    :class="{
                      'opacity-0': step != st.step,
                      'opacity-100': step == st.step,
                    }"
                  >
                    <div class="text-primary-400 leading-none text-sm">Etapa {{ st.step - 1 }}/{{ steps.length }}</div>
                    <div class="text-neutral-700 leading-none text-lg text-nowrap">{{ st.label }}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div v-if="step == 2" class="w-full grow flex">
            <Form
              @submit="nextStep"
              :validation-schema="schemaStep1"
              :initial-values="allValues"
              autocomplete="on"
              class="flex flex-col gap-4 grow"
            >
              <div class="grow flex items-center justify-center">
                <div class="grid grid-cols-4 gap-8 grow max-w-2xl mx-auto">
                  <div class="col-span-4">
                    <FieldInput
                      name="name"
                      label="Nome completo"
                      type="text"
                      placeholder="Luana Silva"
                      autocomplete="name"
                    />
                  </div>

                  <div class="col-span-2">
                    <FieldInput
                      name="birthDay"
                      label="Data de nascimento"
                      type="date"
                      placeholder="01/01/2000"
                      autocomplete="bday"
                    />
                  </div>
                  <div class="col-span-2">
                    <FieldInput
                      name="document"
                      label="CPF/CPNJ"
                      type="text"
                      placeholder="000.000.000-00"
                      mask="['###.###.###-##', '##.###.###/####-##']"
                      autocomplete="document"
                    />
                  </div>

                  <div class="col-span-2">
                    <FieldInput
                      name="phone"
                      label="Celular"
                      type="tel"
                      placeholder="(__) _____-____"
                      mask="(##) #####-####"
                      autocomplete="tel"
                    />
                  </div>
                  <div class="col-span-2">
                    <FieldSelect
                      name="gender"
                      label="Sexo"
                      type="text"
                      placeholder="Selecione"
                      :options="genders"
                      autocomplete="sex"
                    />
                  </div>
                </div>
              </div>
              <div class="flex justify-end">
                <Button class="!px-12" :loading="loading"> Continuar </Button>
              </div>
            </Form>
          </div>

          <div v-if="step == 3" class="w-full grow flex">
            <Form @submit="nextStep" :validation-schema="schemaStep2" class="flex flex-col gap-4 grow">
              <div class="flex items-center justify-center grow">
                <div class="flex items-start justify-center gap-10">
                  <label
                    v-for="goal in goalsList"
                    class="flex flex-col gap-1.5 items-center rounded-2xl cursor-pointer w-48 md:w-52 lg:w-56"
                  >
                    <Field type="checkbox" class="peer hidden" name="goals" :value="goal.value" />

                    <div
                      class="rounded-3xl w-full aspect-square flex items-center justify-center shrink-0 border-0 border-primary-400 peer-checked:border-2 bg-neutral-50/50 peer-hover:bg-neutral-50 peer-checked:hover:bg-primary-50 peer-checked:bg-primary-100 transition-all"
                    >
                      <Icon
                        :name="goal.icon"
                        :class="[goal.iconColor, 'scale-90 peer-checked:scale-100 transition-all']"
                      />
                    </div>
                    <div class="mt-4 gap-2 flex flex-col items-center text-center">
                      <div class="text-neutral-900 leading-none text-xl font-bold">{{ goal.label }}</div>
                      <div class="text-neutral-600 leading-none text-base">{{ goal.description }}</div>
                    </div>
                  </label>
                </div>
              </div>
              <div class="flex justify-end">
                <Button class="!px-12" :loading="loading"> Continuar </Button>
              </div>
            </Form>
          </div>

          <div v-if="step == 4" class="flex flex-col gap-4 grow">
            <div class="flex flex-col items-center justify-center grow gap-8">
              <v-otp-input
                ref="otpInput"
                v-model:value="otpInputValue"
                input-classes="otp-input"
                separator=""
                :num-inputs="6"
                :should-auto-focus="false"
                :placeholder="['_', '_', '_', '_', '_', '_']"
                @on-complete="finishCode"
                :class="[otpInputError && 'otp-error', 'otp']"
              />
              <Button tag="div" color="link" size="small" @click="newCode()" :loading="loadingCode">
                Não recebeu o código, enviar novamente.</Button
              >
            </div>

            <div class="flex justify-end">
              <Button class="!px-12" :loading="loading" @click="finishCode(otpInputValue)"> Finalizar </Button>
            </div>
          </div>

          <div v-if="step == 5" class="flex flex-col gap-4 grow">
            <div class="flex items-start justify-center gap-10 grow">
              <div class="max-w-screen-xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8 lg:py-16">
                <div class="max-w-7xl mx-auto">
                  <div class="flex flex-wrap -mx-4">
                    <div
                      v-for="plan in plans"
                      :key="plan.value"
                      :class="{ 'best-option': plan.isBest }"
                      class="w-full lg:w-1/3 px-4 mb-10 lg:mb-0"
                    >
                      <div
                        class="relative max-w-sm lg:max-w-none mx-auto rounded-3xl"
                        :class="plan.isBest ? 'bg-primary-700' : 'bg-secondary-50'"
                      >
                        <div class="pt-2 px-2">
                          <div
                            class="relative py-8 px-4 h-52 rounded-3xl overflow-hidden"
                            :class="plan.isBest ? 'bg-primary-900' : 'bg-secondary-100'"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="344"
                              height="140"
                              viewBox="0 0 344 140"
                              fill="none"
                              class="absolute bottom-0 left-0 w-full"
                              :class="plan.isBest ? 'stroke-secondary-300' : 'stroke-primary-300'"
                            >
                              <g opacity="0.05">
                                <path
                                  d="M-62 115.277L-19.7532 90.6332C26.5825 63.6041 83.8791 63.6041 130.215 90.6332L172.462 115.277L214.708 139.921C261.044 166.95 318.341 166.95 364.676 139.921L406.923 115.277"
                                  stroke="currentColor"
                                  stroke-width="2.81538"
                                  stroke-linecap="round"
                                  stroke-linejoin="round"
                                />
                                <path
                                  d="M-62 91.8307L-19.7532 67.1867C26.5825 40.1576 83.8791 40.1576 130.215 67.1867L172.462 91.8307L214.708 116.475C261.044 143.504 318.341 143.504 364.676 116.475L406.923 91.8307"
                                  stroke="currentColor"
                                  stroke-width="2.81538"
                                  stroke-linecap="round"
                                  stroke-linejoin="round"
                                />
                                <path
                                  d="M-62 68.3846L-19.7532 43.7406C26.5825 16.7115 83.8791 16.7115 130.215 43.7406L172.462 68.3846L214.708 93.0286C261.044 120.058 318.341 120.058 364.676 93.0286L406.923 68.3846"
                                  stroke="currentColor"
                                  stroke-width="2.81538"
                                  stroke-linecap="round"
                                  stroke-linejoin="round"
                                />
                                <path
                                  d="M-62 138.723L-19.7532 114.079C26.5825 87.0501 83.8791 87.0501 130.215 114.079L172.462 138.723L214.708 163.367C261.044 190.396 318.341 190.396 364.676 163.367L406.923 138.723"
                                  stroke="currentColor"
                                  stroke-width="2.81538"
                                  stroke-linecap="round"
                                  stroke-linejoin="round"
                                />
                                <path
                                  d="M-62 162.169L-19.7532 137.525C26.5825 110.496 83.8791 110.496 130.215 137.525L172.462 162.169L214.708 186.813C261.044 213.842 318.341 213.842 364.676 186.813L406.923 162.169"
                                  stroke="currentColor"
                                  stroke-width="2.81538"
                                  stroke-linecap="round"
                                  stroke-linejoin="round"
                                />
                                <path
                                  d="M-62 185.615L-19.7532 160.971C26.5825 133.942 83.8791 133.942 130.215 160.971L172.462 185.615L214.708 210.259C261.044 237.288 318.341 237.288 364.676 210.259L406.923 185.615"
                                  stroke="currentColor"
                                  stroke-width="2.81538"
                                  stroke-linecap="round"
                                  stroke-linejoin="round"
                                />
                              </g>
                            </svg>
                            <div class="relative text-center">
                              <div
                                class="inline-block py-1.5 px-5 mb-6 font-semibold rounded-full"
                                :class="
                                  plan.isBest ? 'text-primary-50 bg-primary-800' : 'text-secondary-500 bg-secondary-200'
                                "
                              >
                                <span class="sr-only">Plan</span>
                                <Icon :name="plan.icon" /> {{ plan.name }}
                              </div>
                              <div
                                class="block text-4xl font-bold"
                                :class="plan.isBest ? 'text-white' : 'text-primary-950'"
                              >
                                <span class="text-base"> R$</span> {{ plan.price }}
                                <span class="text-base font-light"> /mês</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div class="h-8 mb-7 relative">
                          <div class="absolute left-0 top-1/2 transform -translate-y-1/2 w-full">
                            <div class="w-full border-b-8 border-dotted border-white"></div>
                          </div>
                          <div
                            class="absolute top-0 left-0 transform -translate-x-1/2 w-8 h-8 bg-white rounded-full"
                          ></div>
                          <div
                            class="absolute top-0 right-0 transform translate-x-1/2 w-8 h-8 bg-white rounded-full"
                          ></div>
                        </div>
                        <div class="px-6 pb-6">
                          <ul role="list" class="mt-2 space-y-2 sm:mt-4">
                            <li
                              v-for="benefit in plan.benefits"
                              :key="benefit"
                              class="flex space-x-3 items-center"
                              :class="[
                                !benefit.included && 'line-through decoration-neutral-500',
                                plan.isBest ? 'text-white' : 'text-primary-950',
                              ]"
                            >
                              <svg
                                class="flex-shrink-0 w-4 h-4"
                                :class="[
                                  benefit.included ? 'text-secondary' : 'text-neutral-500',
                                  plan.isBest ? (benefit.included ? 'text-primary-700' : 'text-neutral-100') : '',
                                ]"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <circle
                                  v-if="benefit.included"
                                  cx="10"
                                  cy="10"
                                  r="10"
                                  fill="currentColor"
                                  class="opacity-40"
                                />
                                <path
                                  v-if="benefit.included"
                                  d="M14 7L8.50002 12.5L6.00002 10"
                                  stroke="currentColor"
                                  stroke-width="2"
                                  stroke-linecap="round"
                                  stroke-linejoin="round"
                                />

                                <circle
                                  v-if="!benefit.included"
                                  cx="10"
                                  cy="10"
                                  r="10"
                                  fill="currentColor"
                                  class="opacity-40"
                                />
                                <path
                                  v-if="!benefit.included"
                                  d="M13 7L7 13"
                                  stroke="currentColor"
                                  stroke-width="2"
                                  stroke-linecap="round"
                                  stroke-linejoin="round"
                                />
                                <path
                                  v-if="!benefit.included"
                                  d="M7 7L13 13"
                                  stroke="currentColor"
                                  stroke-width="2"
                                  stroke-linecap="round"
                                  stroke-linejoin="round"
                                />
                              </svg>

                              <span class="text-base font-normal leading-tight text-neutral">{{ benefit.name }}</span>
                            </li>
                          </ul>
                          <div class="text-center mt-10">
                            <div
                              class="cursor-pointer relative group inline-block py-3 px-8 items-center font-semibold rounded-full overflow-hidden"
                              :class="
                                plan.isBest ? 'bg-primary-100 text-primary-950' : 'bg-primary-700/70 text-primary-50'
                              "
                              @click="selectPlan(plan.id)"
                            >
                              <div
                                class="absolute top-0 right-full w-full h-full transform group-hover:translate-x-full group-hover:scale-102 transition duration-500"
                                :class="plan.isBest ? 'bg-secondary-200' : 'bg-secondary-950'"
                              ></div>
                              <div class="relative flex items-center justify-center">
                                <span class="mr-2">Continuar</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="flex justify-end gap-4">
              <Button :loading="loading" color="linkNeutral" to="/"> Continuar gratuitamente </Button>
            </div>
          </div>
        </section>
      </div>

      <div class="pt-8 flex w-full items-end justify-between">
        <p class="text-center text-xs/relaxed text-neutral-500">© Stagemed 2023. Todos os direitos reservados</p>
      </div>
    </div>
  </section>

  <div class="load-page" v-if="loading || loadingGoogle"></div>
</template>

<script setup>
import { useUserStore } from "~~/stores/user";
import VOtpInput from "vue3-otp-input";
import * as yup from "yup";
import YupPassword from "yup-password";
import { unmask } from "~~/helpers/mask";
import { push } from "notivue";

YupPassword(yup);

definePageMeta({
  layout: "auth",
});

const store = useUserStore();
const router = useRouter();
const route = useRoute();
const config = useRuntimeConfig();

const code = route.query.cd;
const imageUrl = ref("https://images.unsplash.com/photo-1571260899304-425eee4c7efc");

if (store.loggedIn && store.current?.account?.basic?.completed && store.current?.emailVerified) router.push("/");

if (code) {
  let codes = {
    complete: "Complete seu perfil antes de continuar",
    verify: "Verifique seu e-mail antes de continuar",
  };

  push.info(codes[code]);
}

const loading = ref(false);
const loadingGoogle = ref(false);

const registerWithGoogle = ref(false);

const step = ref(Number(store.current?.account?.basic?.step) || 1);
if (Number(store.current?.account?.basic?.step >= 2)) registerWithGoogle.value = true;

/** Start register */
const schema = yup.object({
  name: yup.string().required("Informe o nome completo").min(3),
  email: yup.string().required("Informe um e-mail para continuar").email("Infome um e-mail válido para continuar"),
  pass: yup
    .string()
    .required("Este campo deve ser preenchido")
    .minLowercase(1, "Sua senha deve ter letras minúsculas Ex: abc")
    .minUppercase(1, "Sua senha deve ter letras maiúsculas Ex: ABC")
    .minNumbers(1, "Sua senha deve ter números Ex: 123")
    .minSymbols(1, "Sua senha deve ter caracteres especiais Ex: -.#")
    .min(8, "Sua senha deve ter no mínimo 8 caracteres"),
});
async function continueGoogle() {
  loadingGoogle.value = true;
  await store
    .registerGoogle()
    .then(
      async (res) => {
        registerWithGoogle.value = true;
        await store.fetchUser();
        loadingGoogle.value = false;
        step.value = 2;
      },
      (error) => {
        loadingGoogle.value = false;
        console.error(error);
        push.error("Aconteceu algo de errado ao fazer cadastro");
      }
    )
    .catch((error) => {
      loadingGoogle.value = false;
      console.error(error);
      push.error("Aconteceu algo de errado ao fazer cadastro");
    });
}

/** Start register with Google */
function register(values) {
  loading.value = true;
  allValues.value = values;

  store
    .register(values)
    .then(
      async () => {
        await store.fetchUser();
        step.value = 2;
        loading.value = false;
      },
      (error) => {
        loading.value = false;

        if (error.code === "auth/email-already-in-use")
          push.error({
            title: "Está conta já está cadastrada",
            message: "Faça login para acessar sua conta, se esqueceu sua senha faça o procedimento para recuperar.",
          });
        else push.error("Aconteceu algo de errado ao fazer seu cadastro, tente novamente ou entre em contato.");
      }
    )
    .catch((err) => {
      console.log(err);
    });
}

/** Next Steps */
const labels = ref([
  {
    title: "Seja bem vindo 👋",
    description: "Crie sua conta em poucos minutos e começe a se preparar para novos desafios.",
  },
  {
    title: "Um pouco mais sobre você",
    description: "Nos fale um pouco mais sobre você, isso nos ajuda a enregar uma plataforma melhora para você ",
  },
  {
    title: "Onde você quer chegar?",
    description: "Escolha alguma opções abaixo que você espera alcançar com o StageMed",
  },
  {
    title: "Para finalizar seu cadastro",
    description: "Enviamos um código para seu e-mail, insira o código abaixo para completar seu cadastro",
  },
  {
    title: "O plano para a sua jornada",
    description: "Escolha o ideal para você, o plano certo te ajuda na sua jornada.",
  },
]);
const steps = ref([
  {
    icon: "material-symbols:asterisk",
    color: "text-2xl text-[#fd9644]",
    step: 2,
    label: "Conhecendo você",
  },
  {
    icon: "ri:focus-2-line",
    color: "text-2xl text-[#20bf6b]",
    step: 3,
    label: "Definindo objetivos",
  },
  {
    icon: "mage:home-security-lock-fill",
    color: "text-2xl text-[#0fb9b1]",
    step: 4,
    label: "Validar seu email",
  },
  {
    icon: "heroicons:squares-2x2-solid",
    color: "text-2xl text-[#8854d0]",
    step: 5,
    label: "Plano ideal",
  },
]);
const genders = [
  { value: "male", label: "Masculino" },
  { value: "female", label: "Feminino" },
  { value: "not_inform", label: "Prefiro não informar" },
  { value: "other", label: "Outros" },
];
const goalsList = ref([
  {
    value: "revalida",
    icon: "hugeicons:checkmark-circle-03",
    iconColor: "text-[82px] text-[#55efc4]",
    label: "Revalida",
    description: "Me preparar para aprova do revalida",
  },
  {
    value: "training",
    icon: "ph:brain",
    iconColor: "text-[82px] text-[#a29bfe]",
    label: "Treinamento",
    description: "Exercitar meus conhecimento",
  },
  {
    value: "update",
    icon: "carbon:ibm-watson-machine-learning",
    iconColor: "text-[82px] text-[#fab1a0]",
    label: "Crescimento",
    description: "Melhorar minhas práticas e crescer na carreira",
  },
  {
    value: "other",
    icon: "material-symbols:background-grid-small",
    iconColor: "text-[82px] text-[#fdcb6e]",
    label: "Outros",
    description: "Outros objectivos",
  },
]);

const getFormatedDate = (currentDate) => {
  return currentDate.split("/").reverse().join("-");
};
const allValues = ref({
  ...store.current,
});

const schemaStep1 = yup.object({
  name: yup.string().required("Informe o nome completo").min(3),
  birthDay: yup
    .date()
    .max(getFormatedDate(new Date().toLocaleDateString()), "Você precisa ter mais de 18 anos para continuar")
    .required("Este campo deve ser preenchido"),
  document: yup.string().required("Este campo deve ser preenchido"),
  phone: yup.string().required("Este campo deve ser preenchido"),
  gender: yup.string().required("Este campo deve ser preenchido"),
});

const schemaStep2 = yup.object({
  goals: yup.array().of(yup.string()).required("Escolha pelo menos 1 (uma) meta"),
});

async function nextStep(values) {
  console.log("testesetsts");
  loading.value = true;

  if (values.document) values.document = unmask(values.document, " .-/");
  if (values.phone) values.phone = unmask(values.phone, " ()-");

  values.step = step.value;
  if (step.value == 3) values.finish = true;

  store
    .path("users/next", values)
    .then(
      async () => {
        await store.fetchUser();
        step.value += 1;
        loading.value = false;
      },
      (error) => {
        push.error("Aconteceu algo de errado ao fazer cadastro");
        console.error("Erro ao fazer salvar step", error);
      }
    )
    .catch((err) => {
      console.log(err);
      loading.value = false;
    });
}

/** Codes validation */
const loadingCode = ref(false);
const otpInput = ref();
const otpInputValue = ref("");
const otpInputError = ref(false);

function finishCode(value) {
  loading.value = true;

  store
    .post("users/otp", { code: value })
    .then(async (res) => {
      step.value += 1;
      loading.value = false;
    })
    .catch((err) => {
      loading.value = false;
      console.error(err);
      otpInputError.value = true;
    });
}

function newCode() {
  loadingCode.value = true;

  store
    .get("users/otp")
    .then((res) => {
      push.success("Novo código enviado para o seu email");
    })
    .catch((err) => {
      console.log(err);
      push.error("Não conseguimos enviar um novo código para o seu email");
    });

  loadingCode.value = false;
}

const clearInput = () => {
  otpInput.value?.clearInput();
};

/** Payment select */
const { data: plans } = await useAsyncData(`list-plans`, () => $fetch(`${config.public.apiBase}payments/plan/all`));

function selectPlan(id) {
  router.push({
    path: "/checkout",
    query: { selectPlan: id, isYearly: false },
  });
}
</script>

<style lang="scss">
.otp {
  gap: 12px;
}

.otp.otp-error input {
  @apply bg-error-50 border-error-300 placeholder:text-error-300 text-error-900 focus:ring-error-200 focus:border-error-200;
}

.otp-input {
  @apply border border-neutral-300 rounded-[20%]  text-base md:text-lg lg:text-2xl text-center p-3 size-14 md:size-16 lg:size-20;
  line-height: 150%;
  letter-spacing: 0.5px;
}

.otp-input::-webkit-inner-spin-button,
.otp-input::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
input::placeholder {
  @apply text-neutral-300;
}

.register-page {
}
</style>
