<script setup>
import { Disclosure, DisclosureButton, DisclosurePanel } from "@headlessui/vue";
import { useUserStore, useGlobalStore } from "~~/stores";
import * as yup from "yup";
import { getPrice } from "~~/helpers";
import { unmask } from "~~/helpers/mask";
import dayjs from "dayjs";
import { push } from "notivue";

import "dayjs/locale/pt-br";
dayjs.locale("pt-br");

definePageMeta({
  layout: "blank",
});

const router = useRouter();
const route = useRoute();
const config = useRuntimeConfig();
const global = useGlobalStore();
const store = useUserStore();

const currentUser = computed(() => store.currentUser);

const loading = ref(false);
const loadingPix = ref(false);
const isReturn = ref(false);
const adtional = ref(null);
const paymentReturn = ref({});
const successPayment = ref(false);
const errorPayment = ref(false);
const paymentMethod = ref(null);
const step = ref(1);

const selectPlan = ref(route.query.selectPlan);
const addressFull = ref("");

if (route.query?.id) {
  loading.value = true;
  isReturn.value = true;
  step.value = 3;
  loadPayment();
}

var { data: plan } = await useAsyncData(`list-plans`, () =>
  $fetch(`${config.public.apiBase}payments/plan/${selectPlan.value}`)
);
var { data: remoteIp } = await useAsyncData(`get-user-ip`, () => $fetch(`https://api.ipify.org/?format=json`));
remoteIp = remoteIp.value.ip;

const cupom = ref("");
const cupomId = ref(null);
const discountValue = ref(0);
const cupomLoading = ref(false);
var timeoutSearch = null;
async function search(value) {
  console.log(value);

  cupomLoading.value = true;
  // let value = querySearch.value;

  clearTimeout(timeoutSearch);
  timeoutSearch = setTimeout(async () => {
    const api = `${config.public.apiBase}cupons/public/search?q=${encodeURI(value)}`;
    const { data } = await useFetch(api);

    console.log(data);

    if (data?.value.length == 1) {
      cupomId.value = data.value[0]._id;
      discountValue.value = data.value[0].discount;
    } else {
      cupomId.value = null;
      discountValue.value = 0;
    }
    cupomLoading.value = false;
  }, 450);
}
const discount = computed(() => {
  if (discountValue.value) return Number(plan.value.price) * (Number(discountValue.value) / 100);
  return 0;
});

const totalValue = computed(() => {
  return getPrice(+plan.value.price - discount.value);
});

const creditCard = ref({
  holderName: "",
  number: "",
  expiryMonth: "",
  expiryYear: "",
  ccv: "",
});
const creditCardSchema = yup.object({
  holderName: yup.string().required("Informe o nome impresso no cartão"),
  number: yup.string().required("Informe os número do cartão"),
  expiryMonth: yup.string().required("Informe o mês de vencimento"),
  expiryYear: yup.string().required("Informe o ano de vencimento"),
  ccv: yup.string().required("Infome o código de validade"),
});
const creditCardForm = ref(null);

const creditCardHolder = ref({
  address: "",
  postalCode: "",
  addressNumber: "",
  addressComplement: "",
});
const creditCardHolderSchema = yup.object({
  address: yup.string().required("Informe o endereço"),
  postalCode: yup.string().required("Informe o CEP do endereço"),
  addressNumber: yup.string().required("Informe o número do endereço"),
  addressComplement: yup.string(),
});
const creditCardHolderForm = ref(null);

async function finishPayment() {
  loading.value = true;

  const type = paymentMethod.value;

  var values = {
    name: store.current.name,
    email: store.current.email,
    cpfCnpj: unmask(store.current.document, " .-"),
    phone: unmask(store.current.phone, " +-()"),
    mobilePhone: unmask(store.current.phone, " +-()"),
  };

  const payment = {
    plan_id: plan.value.id,
    billingType: type,
    remoteIp: remoteIp,
    user: values,
  };

  if (cupomId.value) payment.cupomId = cupomId.value;

  if (type == "CREDIT_CARD") {
    let valuesCard = await creditCardForm.value.getValues();
    let valuesCardHolder = await creditCardHolderForm.value.getValues();

    payment.creditCard = valuesCard;
    payment.creditCard.number = unmask(payment.creditCard.number, " ");
    payment.creditCardHolderInfo = { ...valuesCardHolder, ...values };
    payment.creditCardHolderInfo.postalCode = unmask(payment.creditCardHolderInfo.postalCode, " -");
  }

  await $fetch(`${config.public.apiBase}payments/subscriptions`, {
    method: "POST",
    body: payment,
    headers: { Authorization: `Bearer ${store.accessToken}` },
  })
    .then((res) => {
      router.push({ path: "/checkout", query: { id: res.payment.id } });

      paymentReturn.value = res.payment;

      if (
        res.payment.status == "RECEIVED" ||
        res.payment.status == "CONFIRMED" ||
        res.payment.status == "RECEIVED_IN_CASH"
      ) {
        successPayment.value = true;
      } else if (res.payment.status == "OVERDUE" || res.payment.status == "REFUNDED") {
        errorPayment.value = true;
      }

      if (type == "PIX" || type == "BOLETO") {
        step.value = 3;
        adtional.value = res.adtional;
        isReturn.value = true;
        if (type == "PIX") loadPaymentStatus;
      }

      loading.value = false;
    })
    .catch((err) => {
      loading.value = false;
      errorPayment.value = true;
    });

  loading.value = false;
}

async function loadPayment() {
  await $fetch(`${config.public.apiBase}payments/pays/${route.query.id}/status`, {
    headers: { Authorization: `Bearer ${store.accessToken}` },
  })
    .then((res) => {
      loadingPix.value = true;
      paymentReturn.value = res.payment;
      if (
        res.payment.status == "RECEIVED" ||
        res.payment.status == "CONFIRMED" ||
        res.payment.status == "RECEIVED_IN_CASH"
      ) {
        successPayment.value = true;
        loading.value = false;
      } else if (res.payment.status == "OVERDUE" || res.payment.status == "REFUNDED") {
        errorPayment.value = true;
        loading.value = false;
      } else {
        $fetch(`${config.public.apiBase}payments/pays/${route.query.id}`, {
          headers: { Authorization: `Bearer ${store.accessToken}` },
        })
          .then((res) => {
            loading.value = false;
            adtional.value = res.adtional;
            paymentReturn.value = res.payment;
            if (
              res.payment.status == "RECEIVED" ||
              res.payment.status == "CONFIRMED" ||
              res.payment.status == "RECEIVED_IN_CASH"
            ) {
              successPayment.value = true;
              loading.value = false;
            } else if (res.payment.status == "OVERDUE" || res.payment.status == "REFUNDED") {
              errorPayment.value = true;
              loading.value = false;
            } else {
              loadPaymentStatus;
              loading.value = false;
            }
          })
          .catch((err) => {
            loading.value = false;
            console.log(err);
            push.error("Erro ao recuperar informações dessa transação!");
          });
      }
    })
    .catch((err) => {
      loading.value = false;
      console.log(err);
      push.error("Erro ao recuperar informações dessa transação!");
    });
}

async function loadPaymentStatus() {
  await $fetch(`${config.public.apiBase}payments/pays/${route.query.id}/status`, {
    headers: { Authorization: `Bearer ${store.accessToken}` },
  })
    .then((res) => {
      loadingPix.value = true;
      paymentReturn.value = res.payment;
      if (
        res.payment.status == "RECEIVED" ||
        res.payment.status == "CONFIRMED" ||
        res.payment.status == "RECEIVED_IN_CASH"
      ) {
        successPayment.value = true;
      } else if (res.payment.status == "OVERDUE" || res.payment.status == "REFUNDED") {
        errorPayment.value = true;
      } else {
        setTimeout(() => {
          loadPaymentStatus;
        }, 3000);
      }
    })
    .catch((err) => {
      loading.value = false;
      push.error("Pagamento não concluido!");
    });
}

async function nextStep() {
  const type = paymentMethod.value;

  let creditCardHolderValid = await creditCardHolderForm.value.validate();
  let valuesCardHolder = await creditCardHolderForm.value.getValues();

  if (creditCardHolderValid.valid) {
    addressFull.value = `${valuesCardHolder.address}, ${valuesCardHolder.addressNumber} - ${valuesCardHolder.postalCode}`;

    if (type == "PIX") step.value = 2;
    else if (type == "BOLETO") step.value = 2;
    else if (type == "CREDIT_CARD") {
      let creditCardValid = await creditCardForm.value.validate();
      if (creditCardValid.valid) step.value = 2;
    } else {
      push.error("Escola um médoto de pagamento para continuar");
    }
  }
}

function reset() {
  location.reload();
}
</script>

<template>
  <div class="checkout-page bg-neutral-50 relative grid h-full">
    <div v-if="!successPayment && !errorPayment" class="h-full">
      <section v-if="step != 3" class="min-h-[calc(100vh_-_64px)]">
        <div class="container">
          <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div v-show="step == 1" class="lg:col-span-8 py-10">
              <div
                class="bg-white rounded-2xl border-neutral-200 border w-full relative shadow-small flex flex-col p-3"
              >
                <div class="shrink-0 w-full relative flex gap-6 p-4">
                  <div
                    class="shrink-0 h-14 aspect-square rounded-2xl overflow-hidden flex items-center justify-center"
                    :style="{ backgroundColor: plan.color }"
                  >
                    <Icon :name="plan.icon" size="28px" class="drop-shadow-md" />
                  </div>

                  <div class="flex flex-col gap-2 grow">
                    <div class="text-neutral-900 text-left title title--h4">{{ plan.name }}</div>
                  </div>

                  <div
                    class="text-neutral-900 text-right"
                    style="font: var(--heading-5-semibold, 600 16px/24px 'Plus Jakarta Sans', sans-serif)"
                  >
                    {{ getPrice(plan.price) }}
                  </div>
                </div>

                <div class="px-3.5 pb-3">
                  <Disclosure v-slot="{ open }">
                    <DisclosureButton class="flex w-full items-center justify-between text-left">
                      Detalhes do plano
                      <Icon
                        name="solar:alt-arrow-down-outline"
                        :class="open ? 'rotate-180 transform' : ''"
                        class="h-5 w-5 text-primary-500 transition"
                      />
                    </DisclosureButton>
                    <DisclosurePanel class="px-2 pt-4 pb-2 text-sm text-neutral-500 flex flex-col gap-4 relative">
                      <ul role="list" class="space-y-5">
                        <li
                          v-for="benefit in plan.benefits"
                          :key="benefit"
                          class="flex gap-3 items-center"
                          :class="[!benefit.included && 'line-through decoration-neutral-500']"
                        >
                          <svg
                            class="flex-shrink-0 w-4 h-4"
                            :class="[benefit.included ? 'text-secondary' : 'text-neutral-400']"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z"
                            />
                          </svg>
                          <span class="text-base font-normal leading-tight text-neutral">{{ benefit.name }}</span>
                        </li>
                      </ul>
                    </DisclosurePanel>
                  </Disclosure>
                </div>
              </div>

              <h3 class="text-neutral-900 text-left relative text-h5 font-semibold mb-3 mt-10">Seu endereço</h3>
              <div class="bg-white rounded-2xl border-neutral-200 border w-full relative shadow-xsmall flex flex-col">
                <div class="py-6 px-8 flex flex-row gap-3 items-center justify-start">
                  <div class="bg-neutral-50 rounded-full w-12 aspect-square flex items-center justify-center shrink-0">
                    <Icon name="solar:map-point-line-duotone" size="1.75em" class="text-primary text-xl" />
                  </div>

                  <div class="flex flex-col items-start justify-center grow">
                    <div class="flex text-neutral-900 text-body">Endereço da assinatura</div>
                    <div class="flex text-neutral-600 text-body-sm">Usado para uso interno do banco</div>
                  </div>
                </div>
                <Form
                  ref="creditCardHolderForm"
                  :validation-schema="creditCardHolderSchema"
                  :initial-values="creditCardHolder"
                  autocomplete="on"
                  class="grid grid-cols-3 gap-3 py-6 px-8"
                >
                  <FieldInput
                    size="small"
                    name="address"
                    type="text"
                    label="Endereço"
                    placeholder="Rua são cristovao, Sao paulo"
                    autocomplete="cc-name"
                    class="col-span-3"
                  />

                  <FieldInput
                    size="small"
                    mask="#####-###"
                    name="postalCode"
                    type="text"
                    label="CEP"
                    placeholder="00000-000"
                  />
                  <FieldInput size="small" name="addressNumber" type="text" label="Número" placeholder="25a" />
                  <FieldInput
                    size="small"
                    name="addressComplement"
                    type="text"
                    label="Complemento"
                    placeholder="Final da rua"
                  />
                </Form>
              </div>

              <h3 class="text-neutral-900 text-left relative text-h5 font-semibold mb-3 mt-10">Dados do cartão</h3>
              <div
                class="bg-white rounded-2xl border-neutral-200 border w-full relative shadow-xsmall divide-y flex flex-col"
              >
                <div>
                  <input type="radio" v-model="paymentMethod" value="PIX" id="paymentMethodPix" class="peer hidden" />
                  <label
                    for="paymentMethodPix"
                    class="py-6 px-8 flex flex-row gap-3 items-center justify-start cursor-pointer"
                  >
                    <div class="bg-white rounded-full border-solid border-primary-500 border shrink-0 w-5 h-5 p-1">
                      <div v-if="paymentMethod == 'PIX'" class="bg-primary rounded-full shrink-0 w-full h-full"></div>
                    </div>

                    <div
                      class="bg-neutral-50 rounded-full w-12 aspect-square flex items-center justify-center shrink-0"
                    >
                      <svg
                        class="shrink-0 relative overflow-visible"
                        style=""
                        width="24"
                        height="24"
                        viewBox="0 0 32 32"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M20.5996 22.0264L16.5862 18.0131C16.4396 17.8664 16.2662 17.8397 16.1729 17.8397C16.0796 17.8397 15.9062 17.8664 15.7596 18.0131L11.7329 22.0397C11.2796 22.4931 10.5729 23.2264 8.21289 23.2264L13.1596 28.1597C13.9096 28.9088 14.9262 29.3295 15.9862 29.3295C17.0462 29.3295 18.0629 28.9088 18.8129 28.1597L23.7729 23.2131C22.5596 23.2131 21.5462 22.9731 20.5996 22.0264ZM11.7329 9.95974L15.7596 13.9864C15.8662 14.0931 16.0262 14.1597 16.1729 14.1597C16.3196 14.1597 16.4796 14.0931 16.5862 13.9864L20.5729 9.99974C21.5196 9.01307 22.5996 8.7864 23.8129 8.7864L18.8529 3.83974C18.1029 3.09067 17.0862 2.66992 16.0262 2.66992C14.9662 2.66992 13.9496 3.09067 13.1996 3.83974L8.25289 8.77307C10.5996 8.77307 11.3196 9.5464 11.7329 9.95974Z"
                          fill="#28CA9E"
                        />
                        <path
                          d="M28.1464 13.1338L25.1464 10.1204H23.4664C22.7464 10.1204 22.0264 10.4137 21.5331 10.9337L17.5331 14.9337C17.1597 15.3071 16.6664 15.4937 16.1731 15.4937C15.6651 15.4866 15.1788 15.2864 14.8131 14.9337L10.7864 10.8937C10.2797 10.3871 9.5864 10.0938 8.85307 10.0938H6.89307L3.83974 13.1604C3.09067 13.9104 2.66992 14.9271 2.66992 15.9871C2.66992 17.0471 3.09067 18.0637 3.83974 18.8137L6.89307 21.8804H8.8664C9.5864 21.8804 10.2797 21.5871 10.7997 21.0804L14.8264 17.0538C15.1997 16.6804 15.6931 16.4937 16.1864 16.4937C16.6797 16.4937 17.1731 16.6804 17.5464 17.0538L21.5597 21.0671C22.0664 21.5737 22.7597 21.8671 23.4931 21.8671H25.1731L28.1731 18.8538C28.9253 18.0902 29.3447 17.06 29.3397 15.9882C29.3347 14.9165 28.9057 13.8902 28.1464 13.1338Z"
                          fill="#28CA9E"
                        />
                      </svg>
                    </div>

                    <div class="flex flex-col items-start justify-center shrink-0 relative">
                      <div class="text-neutral-900 text-left relative text-body">Pix</div>
                      <div class="text-neutral-600 text-left relative text-body-sm">Aprovação imediata</div>
                    </div>
                  </label>
                </div>

                <div>
                  <input
                    type="radio"
                    v-model="paymentMethod"
                    value="CREDIT_CARD"
                    id="paymentMethodCard"
                    class="peer hidden"
                  />
                  <label
                    for="paymentMethodCard"
                    class="py-6 px-8 flex flex-row gap-3 items-center justify-start cursor-pointer"
                  >
                    <div class="bg-white rounded-full border-solid border-primary-500 border shrink-0 w-5 h-5 p-1">
                      <div
                        v-if="paymentMethod == 'CREDIT_CARD'"
                        class="bg-primary rounded-full shrink-0 w-full h-full"
                      ></div>
                    </div>

                    <div
                      class="bg-neutral-50 rounded-full w-12 aspect-square flex items-center justify-center shrink-0"
                    >
                      <Icon name="solar:card-line-duotone" size="1.75em" />
                    </div>

                    <div class="flex flex-col items-start justify-center shrink-0 relative">
                      <div class="text-neutral-900 text-left relative text-body">Cartão de crédito/débito</div>
                      <div class="text-neutral-600 text-left relative text-body-sm">Aprovação a depender do banco</div>
                    </div>
                  </label>

                  <Form
                    v-show="paymentMethod == 'CREDIT_CARD'"
                    ref="creditCardForm"
                    :validation-schema="creditCardSchema"
                    :initial-values="creditCard"
                    autocomplete="on"
                    class="grid grid-cols-3 gap-3 py-6 px-8"
                  >
                    <FieldInput
                      size="small"
                      name="holderName"
                      type="text"
                      label="Nome impresso no cartão"
                      placeholder="MaRia Antenor da Silva"
                      autocomplete="cc-name"
                      class="col-span-3"
                    />
                    <FieldInput
                      size="small"
                      mask="#### #### #### ####"
                      name="number"
                      type="text"
                      label="Número do cartão"
                      placeholder="#### #### #### ####"
                      autocomplete="cc-number"
                      class="col-span-3"
                    />
                    <FieldInput
                      size="small"
                      mask="##"
                      name="expiryMonth"
                      type="text"
                      label="Mes de validade"
                      placeholder="12"
                      autocomplete="cc-exp-month"
                    />
                    <FieldInput
                      size="small"
                      mask="####"
                      name="expiryYear"
                      type="text"
                      label="Ano de validade"
                      placeholder="2030"
                      autocomplete="cc-exp-year"
                    />
                    <FieldInput
                      size="small"
                      mask="###"
                      name="ccv"
                      type="text"
                      label="CVV"
                      placeholder="***"
                      autocomplete="cc-csc"
                    />
                  </Form>
                </div>

                <div>
                  <input
                    type="radio"
                    v-model="paymentMethod"
                    value="BOLETO"
                    id="paymentMethodBoleto"
                    class="peer hidden"
                  />
                  <label
                    for="paymentMethodBoleto"
                    class="py-6 px-8 flex flex-row gap-3 items-center justify-start cursor-pointer"
                  >
                    <div class="bg-white rounded-full border-solid border-primary-500 border shrink-0 w-5 h-5 p-1">
                      <div
                        v-if="paymentMethod == 'BOLETO'"
                        class="bg-primary rounded-full shrink-0 w-full h-full"
                      ></div>
                    </div>

                    <div
                      class="bg-neutral-50 rounded-full w-12 aspect-square flex items-center justify-center shrink-0"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 32 32" fill="none">
                        <path
                          d="M2 6H4V28H2V6ZM12 6H14V26H12V6ZM6 6H10V26H6V6ZM16 6H20V26H16V6ZM22 6H26V26H22V6ZM28 6H30V28H28V6Z"
                          fill="#353B41"
                        />
                      </svg>
                    </div>

                    <div class="flex flex-col items-start justify-center shrink-0 relative">
                      <div class="text-neutral-900 text-left relative text-body">Boleto bancario</div>
                      <div class="text-neutral-600 text-left relative text-body-sm">Aprovação em 1 ou 2 dias úteis</div>
                    </div>
                  </label>
                </div>
              </div>
            </div>

            <div v-show="step == 2" class="lg:col-span-8 py-10">
              <h3 class="text-neutral-900 text-left relative text-h5 font-semibold pt-4">
                Revise e finalize sua assinatura
              </h3>

              <div class="flex flex-col gap-3">
                <div
                  class="bg-white rounded-2xl border-neutral-200 border w-full relative shadow-xsmall divide-y flex flex-col"
                >
                  <div class="py-6 px-8 flex flex-row items-center justify-between w-full relative overflow-hidden">
                    <div class="flex flex-row gap-4 items-center">
                      <div
                        class="bg-neutral-50 rounded-full w-12 aspect-square flex items-center justify-center shrink-0"
                      >
                        <Icon name="solar:map-point-line-duotone" size="1.75em" class="text-primary text-xl" />
                      </div>

                      <div class="flex flex-col items-start justify-center grow">
                        <div class="flex text-neutral-900 text-body">Endereço</div>
                        <div class="flex text-neutral-600 text-body-sm">{{ addressFull }}</div>
                      </div>
                    </div>
                    <Button color="link" size="small" @click="step = 1"> Alterar </Button>
                  </div>
                </div>

                <div
                  class="bg-white rounded-2xl border-neutral-200 border w-full relative shadow-xsmall divide-y flex flex-col"
                >
                  <div class="py-6 px-8 flex flex-row items-center justify-between w-full relative overflow-hidden">
                    <div class="flex flex-row gap-4 items-center">
                      <div
                        class="bg-neutral-50 rounded-full w-12 aspect-square flex items-center justify-center shrink-0"
                      >
                        <Icon
                          name="solar:map-point-line-duotone"
                          size="1.75em"
                          v-if="paymentMethod == 'CREDIT_CARD'"
                          class="text-primary text-xl"
                        />
                        <svg
                          v-if="paymentMethod == 'PIX'"
                          class="shrink-0 relative overflow-visible"
                          width="24"
                          height="24"
                          viewBox="0 0 32 32"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M20.5996 22.0264L16.5862 18.0131C16.4396 17.8664 16.2662 17.8397 16.1729 17.8397C16.0796 17.8397 15.9062 17.8664 15.7596 18.0131L11.7329 22.0397C11.2796 22.4931 10.5729 23.2264 8.21289 23.2264L13.1596 28.1597C13.9096 28.9088 14.9262 29.3295 15.9862 29.3295C17.0462 29.3295 18.0629 28.9088 18.8129 28.1597L23.7729 23.2131C22.5596 23.2131 21.5462 22.9731 20.5996 22.0264ZM11.7329 9.95974L15.7596 13.9864C15.8662 14.0931 16.0262 14.1597 16.1729 14.1597C16.3196 14.1597 16.4796 14.0931 16.5862 13.9864L20.5729 9.99974C21.5196 9.01307 22.5996 8.7864 23.8129 8.7864L18.8529 3.83974C18.1029 3.09067 17.0862 2.66992 16.0262 2.66992C14.9662 2.66992 13.9496 3.09067 13.1996 3.83974L8.25289 8.77307C10.5996 8.77307 11.3196 9.5464 11.7329 9.95974Z"
                            fill="#28CA9E"
                          />
                          <path
                            d="M28.1464 13.1338L25.1464 10.1204H23.4664C22.7464 10.1204 22.0264 10.4137 21.5331 10.9337L17.5331 14.9337C17.1597 15.3071 16.6664 15.4937 16.1731 15.4937C15.6651 15.4866 15.1788 15.2864 14.8131 14.9337L10.7864 10.8937C10.2797 10.3871 9.5864 10.0938 8.85307 10.0938H6.89307L3.83974 13.1604C3.09067 13.9104 2.66992 14.9271 2.66992 15.9871C2.66992 17.0471 3.09067 18.0637 3.83974 18.8137L6.89307 21.8804H8.8664C9.5864 21.8804 10.2797 21.5871 10.7997 21.0804L14.8264 17.0538C15.1997 16.6804 15.6931 16.4937 16.1864 16.4937C16.6797 16.4937 17.1731 16.6804 17.5464 17.0538L21.5597 21.0671C22.0664 21.5737 22.7597 21.8671 23.4931 21.8671H25.1731L28.1731 18.8538C28.9253 18.0902 29.3447 17.06 29.3397 15.9882C29.3347 14.9165 28.9057 13.8902 28.1464 13.1338Z"
                            fill="#28CA9E"
                          />
                        </svg>

                        <svg
                          v-if="paymentMethod == 'BOLETO'"
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 32 32"
                          fill="none"
                        >
                          <path
                            d="M2 6H4V28H2V6ZM12 6H14V26H12V6ZM6 6H10V26H6V6ZM16 6H20V26H16V6ZM22 6H26V26H22V6ZM28 6H30V28H28V6Z"
                            fill="#353B41"
                          />
                        </svg>
                      </div>

                      <div class="flex flex-col items-start justify-center shrink-0 relative">
                        <div class="text-neutral-900 text-left relative text-body">
                          {{
                            paymentMethod == "CREDIT_CARD"
                              ? "Cartão de crédito/débito"
                              : paymentMethod == "PIX"
                              ? "Pix"
                              : "Boleto"
                          }}
                        </div>
                        <div class="text-neutral-600 text-left relative text-body-sm">Você pagará {{ totalValue }}</div>
                      </div>
                    </div>
                    <Button color="link" size="small" @click="step = 1"> Alterar </Button>
                  </div>
                </div>

                <div
                  class="bg-white rounded-2xl border-neutral-200 border w-full relative shadow-xsmall divide-y flex flex-col"
                >
                  <div class="py-6 px-8 flex flex-row items-center justify-between w-full relative overflow-hidden">
                    <div class="flex flex-row gap-4 items-center">
                      <div
                        class="bg-neutral-50 rounded-full w-12 aspect-square flex items-center justify-center shrink-0"
                      >
                        <Icon name="solar:document-linear" size="1.75em" class="text-primary text-xl" />
                      </div>

                      <div class="flex flex-col items-start justify-center grow">
                        <div class="flex text-neutral-900 text-body">Dados para Nota Fiscal eletrônica</div>
                        <div class="flex text-neutral-600 text-body-sm">
                          {{ currentUser.name }} - {{ currentUser.document }}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="lg:col-span-4 bg-white py-10 lg:min-h-[calc(100vh_-_64px)]">
              <div class="w-full py-4 px-6 sticky top-20">
                <div class="w-full">
                  <div class="text-neutral-900 text-left text-body font-semibold">Resumo de Assinatura</div>
                </div>

                <div class="mt-5 flex flex-col gap-2 border-b border-neutral-200 pb-4">
                  <div class="flex items-center justify-between">
                    <div class="text-neutral-600 text-left text-body font-semibold">Assinatura {{ plan.name }}</div>
                    <div class="text-neutral-600 text-right text-body font-semibold">{{ getPrice(+plan.price) }}</div>
                  </div>

                  <div class="flex items-center justify-between mt-1">
                    <div class="text-neutral-600 text-left text-body font-semibold">Descontos</div>
                    <div class="text-neutral-600 text-right text-body font-semibold">-{{ getPrice(discount) }}</div>
                  </div>

                  <div class="px-1 mt-2">
                    <Disclosure v-slot="{ open }">
                      <DisclosureButton class="flex w-full items-center justify-between text-left">
                        Adicionar Cupom
                        <Icon
                          :name="open ? 'solar:minus-circle-outline' : 'solar:add-circle-outline'"
                          :class="open ? 'rotate-180 transform' : ''"
                          class="h-5 w-5 transition text-neutral-600"
                        />
                      </DisclosureButton>
                      <DisclosurePanel class="px-2 pt-4 pb-2 text-sm text-neutral-500 flex flex-col gap-4 relative">
                        <FieldInput
                          size="small"
                          name="cupom"
                          :loading="cupomLoading"
                          hidden-label
                          :value="cupom"
                          @update:model-value="search"
                        />
                      </DisclosurePanel>
                    </Disclosure>
                  </div>
                </div>

                <div class="flex items-center justify-between mt-5 mb-3">
                  <div class="text-neutral-900 text-left text-h4 font-semibold">Total</div>
                  <div class="text-neutral-900 text-right text-h4 font-semibold">{{ totalValue }}</div>
                </div>

                <Button v-if="step == 1" size="small" block class="mt-20" @click="nextStep()"> Continuar </Button>
                <Button v-if="step == 2" size="small" block class="mt-20" @click="finishPayment">
                  Finalizar assinatura
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section v-if="step == 3 && isReturn" class="min-h-[calc(100vh_-_64px)]">
        <div class="min-h-[calc(100vh_-_64px)] flex flex-col items-stretch">
          <div class="bg-success-400 pt-12 pb-20 px-4 -mb-12">
            <div class="flex flex-row items-center gap-4 w-full max-w-3xl mx-auto">
              <div class="bg-neutral-50 rounded-full w-12 aspect-square flex items-center justify-center shrink-0">
                <svg
                  v-if="paymentMethod == 'PIX' || paymentReturn.billingType == 'PIX'"
                  class="shrink-0 relative overflow-visible"
                  width="24"
                  height="24"
                  viewBox="0 0 32 32"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M20.5996 22.0264L16.5862 18.0131C16.4396 17.8664 16.2662 17.8397 16.1729 17.8397C16.0796 17.8397 15.9062 17.8664 15.7596 18.0131L11.7329 22.0397C11.2796 22.4931 10.5729 23.2264 8.21289 23.2264L13.1596 28.1597C13.9096 28.9088 14.9262 29.3295 15.9862 29.3295C17.0462 29.3295 18.0629 28.9088 18.8129 28.1597L23.7729 23.2131C22.5596 23.2131 21.5462 22.9731 20.5996 22.0264ZM11.7329 9.95974L15.7596 13.9864C15.8662 14.0931 16.0262 14.1597 16.1729 14.1597C16.3196 14.1597 16.4796 14.0931 16.5862 13.9864L20.5729 9.99974C21.5196 9.01307 22.5996 8.7864 23.8129 8.7864L18.8529 3.83974C18.1029 3.09067 17.0862 2.66992 16.0262 2.66992C14.9662 2.66992 13.9496 3.09067 13.1996 3.83974L8.25289 8.77307C10.5996 8.77307 11.3196 9.5464 11.7329 9.95974Z"
                    fill="#28CA9E"
                  />
                  <path
                    d="M28.1464 13.1338L25.1464 10.1204H23.4664C22.7464 10.1204 22.0264 10.4137 21.5331 10.9337L17.5331 14.9337C17.1597 15.3071 16.6664 15.4937 16.1731 15.4937C15.6651 15.4866 15.1788 15.2864 14.8131 14.9337L10.7864 10.8937C10.2797 10.3871 9.5864 10.0938 8.85307 10.0938H6.89307L3.83974 13.1604C3.09067 13.9104 2.66992 14.9271 2.66992 15.9871C2.66992 17.0471 3.09067 18.0637 3.83974 18.8137L6.89307 21.8804H8.8664C9.5864 21.8804 10.2797 21.5871 10.7997 21.0804L14.8264 17.0538C15.1997 16.6804 15.6931 16.4937 16.1864 16.4937C16.6797 16.4937 17.1731 16.6804 17.5464 17.0538L21.5597 21.0671C22.0664 21.5737 22.7597 21.8671 23.4931 21.8671H25.1731L28.1731 18.8538C28.9253 18.0902 29.3447 17.06 29.3397 15.9882C29.3347 14.9165 28.9057 13.8902 28.1464 13.1338Z"
                    fill="#28CA9E"
                  />
                </svg>

                <svg
                  v-if="paymentMethod == 'BOLETO' || paymentReturn.billingType == 'BOLETO'"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 32 32"
                  fill="none"
                >
                  <path
                    d="M2 6H4V28H2V6ZM12 6H14V26H12V6ZM6 6H10V26H6V6ZM16 6H20V26H16V6ZM22 6H26V26H22V6ZM28 6H30V28H28V6Z"
                    fill="#353B41"
                  />
                </svg>
              </div>

              <div class="text-neutral-900 text-h4 grow">
                Muito bem! Agora basta pagar <strong>{{ getPrice(paymentReturn.value || 0) }}</strong> via
                <span class="lowercase">{{ paymentReturn.billingType }}</span> para finalizar sua compra.
              </div>
            </div>
          </div>

          <div class="px-4 pb-6" v-if="adtional">
            <div
              v-if="paymentMethod == 'PIX' || paymentReturn.billingType == 'PIX'"
              class="bg-white rounded-2xl border-neutral-200 border shadow-xsmall p-8 md:p-10 w-full max-w-3xl mx-auto"
            >
              <h3 class="text-neutral-900 relative text-h4 font-semibold mb-4">Passo a passo para pagar</h3>

              <ul class="list-decimal pl-10 text-neutral-600 text-body-sm flex flex-col gap-1 mb-6">
                <li>Abra o aplicativo de seu app de pagamentos ou Internet Banking.</li>
                <li>Escolhar “Pix”.</li>
                <li>Escaneie o cógido abaixo e faça o pagamento:</li>
              </ul>

              <img
                class="w-52 aspect-square mx-auto"
                :src="`data:image/png;base64,${adtional?.encodedImage}`"
                alt="Pix QRCODE"
              />

              <div class="flex flex-row gap-2 items-center justify-center mt-3">
                <SvgoClock class="txet-xl" />
                <div class="text-neutral-700 relative text-body-sm">Seu código vence em 30 min</div>
              </div>

              <div class="divider !mt-10 !mb-6"></div>

              <h3 class="text-neutral-900 relative text-h4 font-semibold mb-2">
                Você também pode copiar o código abaixo e utilizar o Pix Copia e Cola
              </h3>

              <div class="text-neutral-600 text-body-sm mb-3">
                Escolha pagar via Pix pelo seu Internet Banking ou app de pagamentos. Depois, cole o seguinte código:
              </div>

              <div
                class="rounded-md border-neutral-300 border pl-4 flex flex-row gap-4 items-center justify-between w-full"
              >
                <div class="w-1 text-neutral-600 text-body-sm truncate grow">{{ adtional.payload }}</div>
                <Button class="shrink-0" color="link" size="small" @click="global.copyToClipboard(adtional.payload)"
                  >Copiar</Button
                >
              </div>

              <div class="flex items-center justify-center mt-6">
                <Button color="link" disabled loading class="mx-auto"> Aguardando pagamento </Button>
              </div>
            </div>

            <div
              v-if="paymentMethod == 'BOLETO' || paymentReturn.billingType == 'BOLETO'"
              class="bg-white rounded-2xl border-neutral-200 border shadow-xsmall p-8 md:p-10 w-full max-w-3xl mx-auto"
            >
              <h3 class="text-neutral-900 relative text-h4 font-semibold mb-4">Passo a passo para pagar</h3>

              <ul class="list-decimal pl-10 text-neutral-600 text-body-sm flex flex-col gap-1 mb-6">
                <li>Abra o aplicativo de seu app de pagamentos ou Internet Banking.</li>
                <li>Escolhar pagar boleto.</li>
                <li>Escaneie o cógido abaixo e faça o pagamento:</li>
              </ul>

              <div class="flex items-center justify-center">
                <BarcodeGenerator
                  v-if="adtional.barCode"
                  :value="adtional.barCode"
                  :displayValue="false"
                  :lineColor="'#1b1d21'"
                  :width="3"
                  :height="80"
                  :elementTag="'img'"
                />
              </div>

              <div class="divider !mt-10 !mb-6"></div>

              <h3 class="text-neutral-900 relative text-h4 font-semibold mb-2">
                Você também pode copiar o código abaixo e colar manualmente no aplicativo
              </h3>

              <div class="text-neutral-600 text-body-sm mb-3">
                Escolha pagar Boleto pelo seu Internet Banking ou app de pagamentos. Depois, cole o seguinte código:
              </div>

              <div
                class="rounded-md border-neutral-300 border pl-4 flex flex-row gap-4 items-center justify-between w-full"
              >
                <div class="w-1 text-neutral-600 text-body-sm truncate grow overflow-hidden">
                  {{ adtional.identificationField }}
                </div>
                <Button
                  class="shrink-0"
                  color="link"
                  size="small"
                  @click="global.copyToClipboard(adtional.identificationField)"
                  >Copiar</Button
                >
              </div>

              <div class="flex items-center justify-center mt-6">
                <Button color="link" to="/payments/activity" class="mx-auto"> Ver detalhes </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>

    <section v-if="successPayment">
      <div class="min-h-[calc(100vh_-_64px)] flex flex-col items-stretch">
        <div class="bg-success-400 h-44 px-4 -mb-12"></div>

        <div class="px-4">
          <div
            class="bg-white rounded-2xl border-neutral-200 border shadow-xsmall p-8 md:p-10 w-full max-w-3xl mx-auto"
          >
            <SvgoCheckCircle class="text-[52px] mx-auto text-success-600" />

            <h3 class="text-neutral-900 relative text-h4 font-semibold mt-10 mb-4 w-full text-center">
              Pagamento concluido com sucesso
            </h3>

            <div class="text-neutral-600 text-body-sm mt-10 mb-3">
              Seu pagamento já foi efetuado, em breve você receberá um e-mail com informações sobre a transação.
              Enquanto isso, fica de olho nas próximas etapas:
            </div>

            <ul class="list-disc pl-10 text-neutral-600 text-body-sm flex flex-col gap-1 mb-6">
              <li>Você receberá e-mails sobre o andamento do seu pedido</li>
              <li>Você pode acompanhar seu plano pelo seu prefil</li>
              <li>Em breve você poderá usar todos os recursos do Stagemed</li>
            </ul>

            <div class="flex items-center justify-center mt-6">
              <Button color="link" to="/payment/activity" class="mx-auto"> Ir para meu perfil </Button>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section v-if="errorPayment">
      <div class="min-h-[calc(100vh_-_64px)] flex flex-col items-stretch">
        <div class="bg-error-400 h-44 px-4 -mb-12"></div>

        <div class="px-4">
          <div
            class="bg-white rounded-2xl border-neutral-200 border shadow-xsmall p-8 md:p-10 w-full max-w-3xl mx-auto"
          >
            <SvgoXCircle class="text-[52px] mx-auto text-error-600" />

            <h3 class="text-neutral-900 relative text-h4 font-semibold mt-10 mb-4 w-full text-center">
              Erro ao fazer pagamento
            </h3>

            <div class="text-neutral-600 text-body-sm mt-10 mb-3">
              Tivemos um erro ao processar o seu pagamento, verifique abaixa as possiveis soluções:
            </div>

            <ul class="list-disc pl-10 text-neutral-600 text-body-sm flex flex-col gap-1 mb-6">
              <li>Seu cartão pode não ter limite suficiente</li>
              <li>Seu banco pode ter bloqueado a transação</li>
              <li>Nosso sistema não conseguiu processar seu pedidio</li>
            </ul>

            <div class="flex items-center justify-center mt-6">
              <Button color="link" class="mx-auto" @click="reset()"> Refazer a compra </Button>
            </div>
          </div>
        </div>
      </div>
    </section>

    <div class="load-page" v-if="loading"></div>
  </div>
</template>
