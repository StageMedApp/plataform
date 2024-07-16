<template>
  <div class="profile-page-settings">
    <div class="container">
      <div class="card mb-6">
        <div class="card-head">
          <h3 class="title title--card-sm">Planos</h3>
        </div>

        <div v-if="currentUser.plan == 'disabled'">
          <CardEmpty type="plan" />

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
                        <div class="block text-4xl font-bold" :class="plan.isBest ? 'text-white' : 'text-primary-950'">
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
                    <div class="absolute top-0 left-0 transform -translate-x-1/2 w-8 h-8 bg-white rounded-full"></div>
                    <div class="absolute top-0 right-0 transform translate-x-1/2 w-8 h-8 bg-white rounded-full"></div>
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
                        :class="plan.isBest ? 'bg-primary-100 text-primary-950' : 'bg-primary-700/70 text-primary-50'"
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

        <div class="my-plan" v-else>
          <div class="card-plan">
            <div class="text-body-sm -mt-4 -mb-1 flex gap-1 items-end">
              <Badge v-if="user.planDetails?.isFree" size="small" color="successDark">Free</Badge>
              Você {{ user.planDetails?.isFree ? "recebeu" : "assinou" }} o
            </div>
            <div class="plan-name">
              <div class="flex items-center justify-start gap-2">
                {{ currentPlan.name }}
                <Icon :name="currentPlan.icon" />
              </div>

              <span v-if="activity?.data?.length > 0">Próximo vencimento em {{ activity.data[0].dueDate }}</span>
            </div>

            <div class="plan-subtitle">Esses são seus benefícios</div>

            <ul role="list" class="space-y-5 my-7">
              <li
                v-for="benefit in currentPlan.benefits"
                :key="benefit"
                class="flex space-x-3 items-center"
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
          </div>
        </div>
      </div>

      <div class="card">
        <div class="card-head">
          <div>
            <h3 class="title title--card-sm">Atividades</h3>
            <p class="subtitle subtitle--card-sm">Veja todas as atividades da sua conta.</p>
          </div>
        </div>

        <div v-if="!currentUser.payment_id || !activity || activity.data?.length <= 0">
          <CardEmpty type="plan" />
        </div>

        <div class="overflow-x-auto" v-if="activity?.data?.length > 0">
          <table class="w-full divide-y-2 divide-neutral-200 bg-white text-sm">
            <thead class="text-left">
              <tr>
                <th class="whitespace-nowrap px-4 py-2 font-medium text-neutral-900">Order</th>
                <th class="whitespace-nowrap px-4 py-2 font-medium text-neutral-900">Data</th>
                <th class="whitespace-nowrap px-4 py-2 font-medium text-neutral-900">Status</th>
                <th class="whitespace-nowrap px-4 py-2 font-medium text-neutral-900">Valor</th>
              </tr>
            </thead>

            <tbody class="divide-y divide-neutral-200" v-for="item in activity.data">
              <tr>
                <td class="whitespace-nowrap px-4 py-2 font-medium text-neutral-900">#{{ item.invoiceNumber }}</td>
                <td class="whitespace-nowrap px-4 py-2 text-neutral-700">
                  {{ dayjs(item.created_at).format("DD/MM/YYYY") }}
                </td>
                <td class="whitespace-nowrap px-4 py-2 text-neutral-700">{{ item.status }}</td>
                <td class="whitespace-nowrap px-4 py-2 text-neutral-700">{{ getPrice(item.value) }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <div class="load-page" v-if="load.page"></div>
  </div>
</template>

<script setup>
import { useUserStore } from "~~/stores";
import { getPrice } from "~~/helpers";
import dayjs from "dayjs";

definePageMeta({
  title: "Pagamentos",
});
useHead({
  title: "Pagamentos",
});

const config = useRuntimeConfig();
const store = useUserStore();
const user = store.current;
const router = useRouter();
const Toast = useState("toast").value;

const currentUser = computed(() => store.currentUser);

const { data: plans } = await useAsyncData(`list-plans`, () => $fetch(`${config.public.apiBase}payments/plan/all`));
const { data: activity } = await useAsyncData(`load-list`, () =>
  $fetch(`${config.public.apiBase}payments/pays`, {
    headers: { Authorization: `Bearer ${user.accessToken}` },
  })
);

const currentPlan = ref(plans.value.find((plan) => plan.id == user.plan) || {});

const load = ref({
  page: false,
  notification: false,
  visibility: false,
});
const edit = ref({
  notification: false,
  visibility: false,
});

const isYearly = ref(false);

function planPrice(price) {
  let convertedPrice = isYearly.value ? price * 11 : price;
  price = convertedPrice.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });

  return isYearly.value ? "Por " + price : price;
}
function planPriceOld(price) {
  let convertedPrice = isYearly.value ? price * 12 : price;
  price = convertedPrice.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });

  return isYearly.value ? "De " + price : price;
}

function selectPlan(id) {
  router.push({
    path: "/checkout",
    query: { selectPlan: id, isYearly: isYearly.value },
  });
}
</script>

<style lang="scss">
.profile-page-settings {
  margin: 0 0 70px;

  .form-only-toggle {
    .form .n-form {
      gap: 0;
      .n-form-item.n-form-item--left-labelled {
        grid-template-areas: "label blank";
        grid-template-columns: 1fr auto;
        align-items: center;
        gap: 0 32px;
        padding: 8px;
        &:nth-child(odd) {
          background: #a4a4a40d;
        }
        .n-form-item-label {
          margin: 0 !important;
          opacity: 0.86;
        }
        .n-form-item-label {
          margin: 0 !important;
        }
      }
    }
  }

  ul.options-account {
    list-style: none;
    padding: 0;
    margin: 0;
    li {
      padding: 8px 12px !important;
      margin-bottom: 12px !important;
      display: flex;
      flex-wrap: nowrap;
      align-items: center;
      position: relative;
      border-radius: var(--border-radius);
      transition: all 0.25s;
      gap: 20px;
      > div {
        flex-grow: 1;
      }
      &.delete-account {
        background: rgba(var(--color-danger-rgb), 0.15);
      }
      &:hover {
        background: var(--color-light);
      }
    }
  }
}
</style>
