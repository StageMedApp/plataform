<template>
  <div class="profile-history">
    <div class="container">
      <div v-if="showHistory" class="card mb-6">
        <div class="card-head">
          <div>
            <h3 class="title title--card-sm">Histórico</h3>
            <p class="subtitle subtitle--card-sm">Suas estações feitas anteriormente aparecerão aqui.</p>
          </div>

          <FieldInput hiddenLabel v-model="searchValue" name="search" size="small" placeholder="Pesquise um histórico" />
        </div>

        <Vue3EasyDataTable
          table-class-name="user-table"
          :theme-color="'#4685eb'"
          buttons-pagination
          :search-field="searchField"
          :search-value="searchValue"
          :headers="headers"
          :items="history"
          rows-of-page-separator-message="de"
          rows-per-page-message="Histórico por página"
        >
          <template #item-datas.media="{ datas }">
            {{ datas.media ? Number(datas.media).toFixed(1) : "-" }}
          </template>

          <template #item-datas.time="{ datas }">
            <time>{{ datas.time ? ("00" + datas.time[0]).slice(-2) + ":" + ("00" + datas.time[1]).slice(-2) : "-" }}</time>
          </template>

          <template #item-created_at="{ created_at }">
            <time>{{ getDayRelative(created_at) }}</time>
          </template>

          <template #item-actions="item">
            <div class="w-full flex items-center justify-end">
              <Button v-if="item.finished_at" size="tiny" @click="viewHis(item)"> Ver Mais <Icon name="solar:alt-arrow-right-outline" /> </Button>
              <Button v-if="!item.finished_at" disabled color="linkError" size="tiny"> Não foi concluída</Button>
            </div>
          </template>

          <template #empty-message>
            <CardEmpty type="list" to="/" />
          </template>
        </Vue3EasyDataTable>
      </div>

      <div v-if="!showHistory && station && selected">
        <Button @click="showHistory = true" size="small" color="link"> <Icon name="solar:arrow-left-line-duotone" size="20" /> Voltar</Button>
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-20">
          <div class="lg:col-span-8">
            <div class="card mb-6">
              <div class="card-head">
                <div class="flex gap-2 items-center">
                  <h3 class="title title--card">Você fez uma estação de {{ station.area }} - {{ station.name }}</h3>
                </div>
              </div>

              <div class="mx-auto w-full rounded-2xl bg-white">
                <Disclosure v-slot="{ open }">
                  <DisclosureButton
                    class="flex w-full justify-between rounded-lg bg-primary-100 px-4 py-2 text-left text-sm font-medium text-primary-900 hover:bg-primary-200 focus:outline-none focus-visible:ring focus-visible:ring-primary-500 focus-visible:ring-opacity-75"
                  >
                    <span>Cenário da estação</span>
                    <Icon name="solar:alt-arrow-down-outline" :class="open ? 'rotate-180 transform' : ''" class="h-5 w-5 text-primary-500 transition" />
                  </DisclosureButton>
                  <DisclosurePanel class="px-4 pt-4 pb-2 text-sm text-gray-500">
                    <div class="prose prose-sm" v-html="station.clinicalCase.scenario"></div>
                  </DisclosurePanel>
                </Disclosure>

                <Disclosure as="div" class="mt-2" v-slot="{ open }">
                  <DisclosureButton
                    class="flex w-full justify-between rounded-lg bg-primary-100 px-4 py-2 text-left text-sm font-medium text-primary-900 hover:bg-primary-200 focus:outline-none focus-visible:ring focus-visible:ring-primary-500 focus-visible:ring-opacity-75"
                  >
                    <span>Detalhes </span>
                    <Icon name="solar:alt-arrow-down-outline" :class="open ? 'rotate-180 transform' : ''" class="h-5 w-5 text-primary-500 transition" />
                  </DisclosureButton>
                  <DisclosurePanel class="px-4 pt-4 pb-2 text-sm text-gray-500">
                    <div class="prose prose-sm" v-html="station.clinicalCase.description"></div>
                  </DisclosurePanel>
                </Disclosure>

                <Disclosure as="div" class="mt-2" v-slot="{ open }">
                  <DisclosureButton
                    class="flex w-full justify-between rounded-lg bg-primary-100 px-4 py-2 text-left text-sm font-medium text-primary-900 hover:bg-primary-200 focus:outline-none focus-visible:ring focus-visible:ring-primary-500 focus-visible:ring-opacity-75"
                  >
                    <span>Nos próximos 10 minutos realize</span>
                    <Icon name="solar:alt-arrow-down-outline" :class="open ? 'rotate-180 transform' : ''" class="h-5 w-5 text-primary-500 transition" />
                  </DisclosureButton>
                  <DisclosurePanel class="px-4 pt-4 pb-2 text-sm text-gray-500">
                    <div class="prose prose-sm" v-html="station.clinicalCase.actions"></div>
                  </DisclosurePanel>
                </Disclosure>

                <Disclosure as="div" class="mt-2" v-slot="{ open }">
                  <DisclosureButton
                    class="flex w-full justify-between rounded-lg bg-primary-100 px-4 py-2 text-left text-sm font-medium text-primary-900 hover:bg-primary-200 focus:outline-none focus-visible:ring focus-visible:ring-primary-500 focus-visible:ring-opacity-75"
                  >
                    <span>Instrução para o ator</span>
                    <Icon name="solar:alt-arrow-down-outline" :class="open ? 'rotate-180 transform' : ''" class="h-5 w-5 text-primary-500 transition" />
                  </DisclosureButton>
                  <DisclosurePanel class="px-4 pt-4 pb-2 text-sm text-gray-500">
                    <div class="prose prose-sm" v-html="station.clinicalCase.instruction"></div>
                  </DisclosurePanel>
                </Disclosure>
              </div>
            </div>

            <div v-for="(file, itemIdx) in station.clinicalCase.impresso">
              <div class="card !px-4 !py-3 mt-6">
                <div class="mx-auto w-full rounded-2xl bg-white">
                  <Disclosure v-slot="{ open }">
                    <DisclosureButton class="flex w-full items-center justify-between text-left">
                      <div class="card-head !m-0 grow">
                        <h3 class="title title--card-sm">Impresso - {{ file.title }}</h3>
                      </div>

                      <Icon name="solar:alt-arrow-down-outline" :class="open ? 'rotate-180 transform' : ''" class="h-5 w-5 text-primary-500 transition" />
                    </DisclosureButton>
                    <DisclosurePanel class="px-4 pt-4 pb-2 text-sm text-gray-500 flex flex-col gap-4 relative">
                      <div v-if="file.description" class="prose prose-sm" v-html="file.description"></div>
                      <div v-if="file.images" class="grid grid-cols-[repeat(auto-fill,minmax(350px,1fr))] gap-4">
                        <img class="w-full h-auto" v-for="(image, idx) in file.images" :src="image" :key="idx" @click="showImg(idx, file.images)" />
                      </div>
                    </DisclosurePanel>
                  </Disclosure>
                </div>
              </div>
            </div>

            <div class="card mt-6">
              <div class="card-head !mb-4">
                <div>
                  <h3 class="title title--card-sm">Avaliações</h3>
                </div>
              </div>
              <div class="divide-y">
                <div
                  v-for="(item, idx) in selected.assessment"
                  class="flex items-center justify-between gap-4 py-3 px-2"
                  :class="[
                    item.points.i != null && Number(item.points.i) == Number(item.value) && 'bg-error-50',
                    item.points.p != null && Number(item.points.p) == Number(item.value) && 'bg-warning-50',
                    item.points.a != null && Number(item.points.a) == Number(item.value) && 'bg-success-50',
                  ]"
                >
                  <div>
                    {{ item.title }}
                  </div>

                  <div class="flex items-center gap-1 pointer-events-none">
                    <Button icon size="tiny" :color="item.points.i != null && Number(item.points.i) === Number(item.value) ? 'linkError' : 'link'" class="!p-0.5" @click="setPoint(idx, item.points.i)">
                      <Icon size="1.75em" name="solar:close-square-line-duotone" />
                    </Button>
                    <Button
                      icon
                      size="tiny"
                      :color="item.points.p != null && Number(item.points.p) === Number(item.value) ? 'linkWarning' : 'link'"
                      class="!p-0.5"
                      @click="setPoint(idx, item.points.p)"
                    >
                      <Icon size="1.75em" name="solar:minus-square-line-duotone" />
                    </Button>
                    <Button
                      icon
                      size="tiny"
                      :color="item.points.a != null && Number(item.points.a) === Number(item.value) ? 'linkSuccess' : 'link'"
                      class="!p-0.5"
                      @click="setPoint(idx, item.points.a)"
                    >
                      <Icon size="1.75em" name="solar:check-square-line-duotone" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="lg:col-span-4">
            <div class="card" v-if="selected && history?.length > 0">
              <div class="card-head !mb-2">
                <h3 class="title title--card-sm">Mentor</h3>
              </div>

              <div class="flex items-center space-x-4">
                <div class="flex-shrink-0">
                  <img :src="selected.usersInfo.mentorpicture" class="w-8 h-8 rounded-full" />
                </div>
                <div class="flex-1 min-w-0">
                  <p class="text-sm font-medium text-gray-900 truncate">{{ selected.usersInfo.mentorName }}</p>
                </div>
              </div>
            </div>

            <div class="card mt-6" v-if="selected && history?.length > 0">
              <div class="card-head">
                <div>
                  <h3 class="title title--card-sm">Detalhes</h3>
                  <p class="subtitle subtitle--card-sm">{{ selected.usersInfo.station }}</p>
                </div>
              </div>

              <div class="mb-4 prose">
                <ul>
                  <li>
                    Você levou
                    <span class="m-0 font-semibold font-mono">
                      {{ selected.datas.time ? ("00" + selected.datas.time[0]).slice(-2) + ":" + ("00" + selected.datas.time[1]).slice(-2) : "-" }}
                    </span>
                    para concluir essa estação
                  </li>
                  <li v-if="selected.datas?.media">
                    Sua pontuação foi de <span class="m-0 font-semibold font-mono">{{ selected.datas.media.toFixed(1) }}</span>
                  </li>
                  <li v-if="selected.datas?.maxNote">
                    Sua maior nota foi em <span class="m-0 font-semibold font-mono">{{ selected.datas.maxNoteArea }}</span> com
                    <span class="m-0 font-semibold font-mono">{{ selected.datas.maxNote.toFixed(1) }}%</span> de acerto
                  </li>
                  <li v-if="selected.datas?.minNote && Number(selected.datas.minNote) <= 99">
                    Seu ponto de atenção foi em <span class="m-0 font-semibold font-mono">{{ selected.datas.minNoteArea }}</span> com
                    <span class="m-0 font-semibold font-mono">{{ selected.datas.minNote.toFixed(1) }}%</span> de acerto
                  </li>
                </ul>
              </div>

              <div class="flex flex-col gap-1 mt-5 w-full" v-for="item in listItens" :key="item">
                <div class="block text-sm font-medium text-gray-700">{{ types[item] }}</div>

                <span class="relative block rounded-full bg-gray-200">
                  <span class="absolute inset-0 flex items-center justify-center text-[10px]/4">
                    <span class="font-bold text-white"> {{ (selected.datas?.result && selected.datas?.result[item]) || 0 }}% </span>
                  </span>

                  <span class="block h-4 rounded-full bg-indigo-600 text-center transition" :style="{ width: ((selected.datas?.result && selected.datas?.result[item]) || 0) + '%' }"> </span>
                </span>
              </div>
            </div>

            <!-- Chat text -->
            <div class="card-sm mt-6 !p-0 card-chat">
              <div class="card-head py-4 px-6">
                <h3 class="title title--card-sm">Conversa</h3>
              </div>

              <div class="max-h-80 h-80 grow justify-end pb-4 overflow-auto w-full p-2">
                <div class="flex flex-col gap-3">
                  <div class="chat" :class="[msg.user == currentUser._id && 'chat-end']" v-for="msg in messages">
                    <div class="chat-bubble">
                      <time class="chat-time">{{ msg.time }}</time> {{ msg.text }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="load-page" v-if="loading"></div>
  </div>
</template>

<script setup>
import Vue3EasyDataTable from "vue3-easy-data-table";
import "vue3-easy-data-table/dist/style.css";
import { Dialog, DialogPanel, TransitionChild, TransitionRoot, Popover, PopoverButton, PopoverPanel, Disclosure, DisclosureButton, DisclosurePanel } from "@headlessui/vue";
import { useUserStore } from "~~/stores";
import dayjs from "dayjs";
import "dayjs/locale/pt-br";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);
dayjs.locale("pt-br");

definePageMeta({
  title: "Histórico",
});
useHead({
  title: "Histórico",
});

const config = useRuntimeConfig();
const store = useUserStore();
const currentUser = computed(() => store.currentUser);
const user = store.current;

const { data: history } = await useAsyncData(`list-history`, () =>
  $fetch(`${config.public.apiBase}users-stations/user/${user._id}`, {
    headers: { Authorization: `Bearer ${store.accessToken}` },
  })
);

const loading = ref(false);
const showHistory = ref(true);

const searchField = ["usersInfo.station", "area", "created_at"];
const searchValue = ref("");
const headers = [
  { text: "Estação", value: "usersInfo.station", sortable: true, width: 200 },
  { text: "Área", value: "area", sortable: true },
  { text: "Data", value: "created_at", sortable: true },
  { text: "Tempo", value: "datas.time", sortable: true },
  { text: "Nota", value: "datas.media", sortable: true },
  { text: "", value: "actions" },
];

const listItens = ["an", "ef", "lb", "im", "dg", "cd"];
const types = {
  an: "Anamnese",
  ef: "Exame Físico",
  lb: "Laboratório",
  im: "Imagem",
  dg: "Diagnóstico",
  cd: "Conduta",
};

const selected = ref({});
const station = ref({});

async function viewHis(his) {
  loading.value = true;

  selected.value = his;

  let stationAux = await store.get("stations/public/" + his.station_id);
  station.value = stationAux.data;

  loading.value = false;
  showHistory.value = false;
}

function getDayRelative(date) {
  return dayjs().to(dayjs(date));
}
</script>

<style lang="scss">
.user-table {
  .vue3-easy-data-table__header {
    overflow: visible;
    tr th .header .header-text {
      @apply text-base whitespace-nowrap  px-4 py-2 font-medium text-gray-900;
    }
  }

  --easy-table-border: none;
  --easy-table-row-border: none;

  --easy-table-header-font-size: 1em !important;
  --easy-table-header-height: auto !important;

  --easy-table-header-item-padding: 0 6px 6px;

  --easy-table-body-row-font-color: #8593a3;
  --easy-table-body-row-background-color: transparent;
  --easy-table-body-row-height: auto;
  --easy-table-body-row-font-size: 1em;

  --easy-table-body-row-hover-font-color: var(--color-primary);
  --easy-table-body-row-hover-background-color: #f0f6fe;

  --easy-table-body-item-padding: 4px 8px;

  --easy-table-footer-background-color: transparent;
  --easy-table-footer-font-size: 14px;
  --easy-table-footer-padding: 12px 0;
  --easy-table-footer-height: auto;

  --easy-table-rows-per-page-selector-width: 70px;
  --easy-table-rows-per-page-selector-option-padding: 10px;
  --easy-table-rows-per-page-selector-z-index: 1;

  --easy-table-scrollbar-track-color: transparent;
  --easy-table-scrollbar-color: transparent;
  --easy-table-scrollbar-thumb-color: #444c5a;
  --easy-table-scrollbar-corner-color: transparent;

  --easy-table-loading-mask-background-color: #1b2750;
}
</style>
