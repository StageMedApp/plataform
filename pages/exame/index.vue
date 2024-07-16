<template>
  <div class="profile-history">
    <div class="container">
      <div v-if="showHistory" class="card mb-6">
        <div class="card-head">
          <div>
            <h3 class="title title--card-sm">Provas</h3>
          </div>

          <div class="flex justify-end items-center gap-2">
            <Button size="small" color="link" title="Criar uma nova prova customizada" @click="newExameModal = true">
              <Icon name="solar:document-medicine-line-duotone" /> Criar prova
            </Button>
            <Button size="small" title="Iniciar uma prova criada por nossos professores">
              <Icon name="solar:documents-line-duotone" /> Iniciar prova
            </Button>
          </div>
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
            <time>{{
              datas.time ? ("00" + datas.time[0]).slice(-2) + ":" + ("00" + datas.time[1]).slice(-2) : "-"
            }}</time>
          </template>

          <template #item-created_at="{ created_at }">
            <time>{{ getDayRelative(created_at) }}</time>
          </template>

          <template #item-actions="item">
            <div class="w-full flex items-center justify-end">
              <Button v-if="item.finished_at" size="tiny" @click="viewHis(item)">
                Ver Mais <Icon name="solar:alt-arrow-right-outline" />
              </Button>
              <Button v-if="!item.finished_at" disabled color="linkError" size="tiny"> Não foi concluída</Button>
            </div>
          </template>

          <template #empty-message>
            <CardEmpty type="list" to="/" />
          </template>
        </Vue3EasyDataTable>
      </div>

      <div v-if="!showHistory && station && selected">
        <Button @click="showHistory = true" size="small" color="link">
          <Icon name="solar:arrow-left-line-duotone" size="20" /> Voltar</Button
        >
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
                    class="flex w-full justify-between rounded-2xl bg-primary-100 px-4 py-2 text-left text-sm font-medium text-primary-900 hover:bg-primary-200 focus:outline-none focus-visible:ring focus-visible:ring-primary-500 focus-visible:ring-opacity-75"
                  >
                    <span>Cenário da estação</span>
                    <Icon
                      name="solar:alt-arrow-down-outline"
                      :class="open ? 'rotate-180 transform' : ''"
                      class="h-5 w-5 text-primary-500 transition"
                    />
                  </DisclosureButton>
                  <DisclosurePanel class="px-4 pt-4 pb-2 text-sm text-neutral-500">
                    <div class="prose prose-sm" v-html="station.clinicalCase.scenario"></div>
                  </DisclosurePanel>
                </Disclosure>

                <Disclosure as="div" class="mt-2" v-slot="{ open }">
                  <DisclosureButton
                    class="flex w-full justify-between rounded-2xl bg-primary-100 px-4 py-2 text-left text-sm font-medium text-primary-900 hover:bg-primary-200 focus:outline-none focus-visible:ring focus-visible:ring-primary-500 focus-visible:ring-opacity-75"
                  >
                    <span>Detalhes </span>
                    <Icon
                      name="solar:alt-arrow-down-outline"
                      :class="open ? 'rotate-180 transform' : ''"
                      class="h-5 w-5 text-primary-500 transition"
                    />
                  </DisclosureButton>
                  <DisclosurePanel class="px-4 pt-4 pb-2 text-sm text-neutral-500">
                    <div class="prose prose-sm" v-html="station.clinicalCase.description"></div>
                  </DisclosurePanel>
                </Disclosure>

                <Disclosure as="div" class="mt-2" v-slot="{ open }">
                  <DisclosureButton
                    class="flex w-full justify-between rounded-2xl bg-primary-100 px-4 py-2 text-left text-sm font-medium text-primary-900 hover:bg-primary-200 focus:outline-none focus-visible:ring focus-visible:ring-primary-500 focus-visible:ring-opacity-75"
                  >
                    <span>Nos próximos 10 minutos realize</span>
                    <Icon
                      name="solar:alt-arrow-down-outline"
                      :class="open ? 'rotate-180 transform' : ''"
                      class="h-5 w-5 text-primary-500 transition"
                    />
                  </DisclosureButton>
                  <DisclosurePanel class="px-4 pt-4 pb-2 text-sm text-neutral-500">
                    <div class="prose prose-sm" v-html="station.clinicalCase.actions"></div>
                  </DisclosurePanel>
                </Disclosure>

                <Disclosure as="div" class="mt-2" v-slot="{ open }">
                  <DisclosureButton
                    class="flex w-full justify-between rounded-2xl bg-primary-100 px-4 py-2 text-left text-sm font-medium text-primary-900 hover:bg-primary-200 focus:outline-none focus-visible:ring focus-visible:ring-primary-500 focus-visible:ring-opacity-75"
                  >
                    <span>Instrução para o ator</span>
                    <Icon
                      name="solar:alt-arrow-down-outline"
                      :class="open ? 'rotate-180 transform' : ''"
                      class="h-5 w-5 text-primary-500 transition"
                    />
                  </DisclosureButton>
                  <DisclosurePanel class="px-4 pt-4 pb-2 text-sm text-neutral-500">
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

                      <Icon
                        name="solar:alt-arrow-down-outline"
                        :class="open ? 'rotate-180 transform' : ''"
                        class="h-5 w-5 text-primary-500 transition"
                      />
                    </DisclosureButton>
                    <DisclosurePanel class="px-4 pt-4 pb-2 text-sm text-neutral-500 flex flex-col gap-4 relative">
                      <div v-if="file.description" class="prose prose-sm" v-html="file.description"></div>
                      <div v-if="file.images" class="grid grid-cols-[repeat(auto-fill,minmax(350px,1fr))] gap-4">
                        <img
                          class="w-full h-auto"
                          v-for="(image, idx) in file.images"
                          :src="image"
                          :key="idx"
                          @click="showImg(idx, file.images)"
                        />
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
                    <Button
                      icon
                      size="tiny"
                      :color="
                        item.points.i != null && Number(item.points.i) === Number(item.value) ? 'linkError' : 'link'
                      "
                      class="!p-0.5"
                      @click="setPoint(idx, item.points.i)"
                    >
                      <Icon size="1.75em" name="solar:close-square-line-duotone" />
                    </Button>
                    <Button
                      icon
                      size="tiny"
                      :color="
                        item.points.p != null && Number(item.points.p) === Number(item.value) ? 'linkWarning' : 'link'
                      "
                      class="!p-0.5"
                      @click="setPoint(idx, item.points.p)"
                    >
                      <Icon size="1.75em" name="solar:minus-square-line-duotone" />
                    </Button>
                    <Button
                      icon
                      size="tiny"
                      :color="
                        item.points.a != null && Number(item.points.a) === Number(item.value) ? 'linkSuccess' : 'link'
                      "
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
                  <p class="text-sm font-medium text-neutral-900 truncate">{{ selected.usersInfo.mentorName }}</p>
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
                      {{
                        selected.datas.time
                          ? ("00" + selected.datas.time[0]).slice(-2) + ":" + ("00" + selected.datas.time[1]).slice(-2)
                          : "-"
                      }}
                    </span>
                    para concluir essa estação
                  </li>
                  <li v-if="selected.datas?.media">
                    Sua pontuação foi de
                    <span class="m-0 font-semibold font-mono">{{ selected.datas.media.toFixed(1) }}</span>
                  </li>
                  <li v-if="selected.datas?.maxNote">
                    Sua maior nota foi em
                    <span class="m-0 font-semibold font-mono">{{ selected.datas.maxNoteArea }}</span> com
                    <span class="m-0 font-semibold font-mono">{{ selected.datas.maxNote.toFixed(1) }}%</span> de acerto
                  </li>
                  <li v-if="selected.datas?.minNote && Number(selected.datas.minNote) <= 99">
                    Seu ponto de atenção foi em
                    <span class="m-0 font-semibold font-mono">{{ selected.datas.minNoteArea }}</span> com
                    <span class="m-0 font-semibold font-mono">{{ selected.datas.minNote.toFixed(1) }}%</span> de acerto
                  </li>
                </ul>
              </div>

              <div class="flex flex-col gap-1 mt-5 w-full" v-for="item in listItens" :key="item">
                <div class="block text-sm font-medium text-neutral-700">{{ types[item] }}</div>

                <span class="relative block rounded-full bg-neutral-200">
                  <span class="absolute inset-0 flex items-center justify-center text-[10px]/4">
                    <span class="font-bold text-white">
                      {{ (selected.datas?.result && selected.datas?.result[item]) || 0 }}%
                    </span>
                  </span>

                  <span
                    class="block h-4 rounded-full bg-indigo-600 text-center transition"
                    :style="{ width: ((selected.datas?.result && selected.datas?.result[item]) || 0) + '%' }"
                  >
                  </span>
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

    <!-- Modal new exame -->
    <TransitionRoot as="template" :show="newExameModal">
      <Dialog as="div" class="relative z-10" @close="closeNewExameModa">
        <TransitionChild
          as="template"
          enter="ease-out duration-300"
          enter-from="opacity-0"
          enter-to="opacity-100"
          leave="ease-in duration-200"
          leave-from="opacity-100"
          leave-to="opacity-0"
        >
          <div class="fixed inset-0 bg-neutral-500 bg-opacity-75 transition-opacity" />
        </TransitionChild>

        <div class="fixed inset-0 z-10 overflow-y-auto">
          <div class="flex min-h-full min-w-full items-center justify-center p-6 sm:p-0">
            <TransitionChild
              as="template"
              enter="ease-out duration-300"
              enter-from="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enter-to="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leave-from="opacity-100 translate-y-0 sm:scale-100"
              leave-to="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <DialogPanel
                class="relative transform overflow-hidden rounded-2xl bg-card text-left shadow-xl transition-all h-screen w-full md:max-w-[80vw] md:max-h-[80vh] max-h-[90vh] flex flex-col"
              >
                <div class="size-full grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div class="md:col-span-2 p-4">
                    <h3 class="title title--card-sm mb-1">Provas</h3>
                    <p class="subtitle subtitle--card-sm !mb-10">Crie sua prova, defina suas</p>

                    <div class="relative mb-6">
                      <label for="labels-range-input">Quantidade de questões</label>
                      <input
                        id="labels-range-input"
                        type="range"
                        value="20"
                        min="10"
                        max="100"
                        step="10"
                        :value="exameConfig.quetionsQtd"
                        class="w-full h-2 bg-neutral-200 rounded-lg appearance-none cursor-pointer"
                      />
                      <div class="flex justify-between items-center">
                        <span class="text-sm text-neutral-500"> 10 </span>
                        <span class="text-sm text-neutral-500"> 20 </span>
                        <span class="text-sm text-neutral-500"> 30 </span>
                        <span class="text-sm text-neutral-500"> 40 </span>
                        <span class="text-sm text-neutral-500"> 50 </span>
                        <span class="text-sm text-neutral-500"> 60 </span>
                        <span class="text-sm text-neutral-500"> 70 </span>
                        <span class="text-sm text-neutral-500"> 80 </span>
                        <span class="text-sm text-neutral-500"> 90 </span>
                        <span class="text-sm text-neutral-500"> 100 </span>
                      </div>
                    </div>

                    <label for="labels-range-input">Escolha as materias</label>

                    <div class="flex flex-wrap -m-2">
                      <div v-for="item in categorias" class="w-full sm:w-1/2 md:w-1/3 p-2">
                        <div class="p-4 h-full bg-white border hover:border-neutral-200 rounded-lg cursor-pointer">
                          <div class="flex flex-wrap items-center justify-between -m-2">
                            <div class="w-auto p-2">
                              <div class="flex flex-wrap items-center -m-1.5">
                                <div class="w-auto">
                                  <Icon :name="item.icon" size="24px" />
                                </div>
                                <div class="flex-1 px-2">
                                  <h3 class="font-heading font-semibold">{{ item.name }}</h3>
                                  <p class="text-xs text-neutral-500">{{ item.short }}</p>
                                </div>
                              </div>
                            </div>
                            <div class="w-auto p-1 flex gap-2 items-center bg-neutral-200/50 rounded-xl">
                              <div v-if="exameConfig.quetions[item.id]" @click="removeCat(item)">
                                <Icon name="solar:minus-square-line-duotone" size="20px" />
                              </div>
                              <span v-if="exameConfig.quetions[item.id]">{{ exameConfig.quetions[item.id] }}</span>
                              <div @click="addCat(item)">
                                <Icon name="solar:add-square-line-duotone" size="20px" />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div class="bg-neutral-100 flex flex-col rounded-2xl">
                    <div class="pt-4 px-4 text-sm font-bold text-neutral-800">Previw da prova</div>
                    <div class="grow flex flex-col gap-2 p-4">
                      Sua prova terá {{ exameConfig.quetionsQtd }} questões, elas serão divididas nas materias abaixo

                      <div
                        v-for="(item, index) in exameConfig.quetions"
                        :key="index"
                        class="flex items-center w-full p-3 py-1 pl-4 pr-1 leading-tight transition-all rounded-lg outline-none text-start hover:bg-blue-gray-50 hover:bg-opacity-80 hover:text-blue-gray-900 focus:bg-blue-gray-50 focus:bg-opacity-80 focus:text-blue-gray-900 active:bg-blue-gray-50 active:bg-opacity-80 active:text-blue-gray-900"
                      >
                       
                        {{ index }}
                        {{ (item / exameConfig.quetionsTotal) * exameConfig.quetionsQtd }}
                        <div class="grid ml-auto place-items-center justify-self-end">
                          <button
                            class="relative h-10 max-h-[40px] w-10 max-w-[40px] select-none rounded-lg text-center align-middle font-sans text-xs font-medium uppercase text-blue-gray-500 transition-all hover:bg-blue-gray-500/10 active:bg-blue-gray-500/30 disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                            type="button"
                          >
                            <span class="absolute transform -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="currentColor"
                                class="w-5 h-5"
                              >
                                <path
                                  fill-rule="evenodd"
                                  d="M16.5 4.478v.227a48.816 48.816 0 013.878.512.75.75 0 11-.256 1.478l-.209-.035-1.005 13.07a3 3 0 01-2.991 2.77H8.084a3 3 0 01-2.991-2.77L4.087 6.66l-.209.035a.75.75 0 01-.256-1.478A48.567 48.567 0 017.5 4.705v-.227c0-1.564 1.213-2.9 2.816-2.951a52.662 52.662 0 013.369 0c1.603.051 2.815 1.387 2.815 2.951zm-6.136-1.452a51.196 51.196 0 013.273 0C14.39 3.05 15 3.684 15 4.478v.113a49.488 49.488 0 00-6 0v-.113c0-.794.609-1.428 1.364-1.452zm-.355 5.945a.75.75 0 10-1.5.058l.347 9a.75.75 0 101.499-.058l-.346-9zm5.48.058a.75.75 0 10-1.498-.058l-.347 9a.75.75 0 001.5.058l.345-9z"
                                  clip-rule="evenodd"
                                ></path>
                              </svg>
                            </span>
                          </button>
                        </div>
                      </div>
                    </div>
                    <div class="flex gap-4 items-center justify-end px-4 pb-4">
                      <Button size="small" color="linkError" @click="closeNewExameModa"> Cancelar </Button>
                      <Button size="small"> Iniciar prova </Button>
                    </div>
                  </div>
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </TransitionRoot>
  </div>
</template>

<script setup>
import Vue3EasyDataTable from "vue3-easy-data-table";
import "vue3-easy-data-table/dist/style.css";
import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
  TabGroup,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  Dialog,
  DialogPanel,
  TransitionChild,
  TransitionRoot,
} from "@headlessui/vue";
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

const exameConfig = ref({
  quetions: {},
  quetionsTotal: 0,
  quetionsQtd: 20,
});
const newExameModal = ref(false);
const categorias = ref([
  { id: "uid1", name: "categoria 1", icon: "solar:star-circle-line-duotone", short: "lorem ipsum" },
  { id: "uid2", name: "categoria 2", icon: "solar:star-circle-line-duotone", short: "lorem ipsum" },
  { id: "uid3", name: "categoria 3", icon: "solar:star-circle-line-duotone", short: "lorem ipsum" },
  { id: "uid4", name: "categoria 4", icon: "solar:star-circle-line-duotone", short: "lorem ipsum" },
  { id: "uid5", name: "categoria 5", icon: "solar:star-circle-line-duotone", short: "lorem ipsum" },
  { id: "uid6", name: "categoria 6", icon: "solar:star-circle-line-duotone", short: "lorem ipsum" },
]);
function closeNewExameModa() {
  newExameModal.value = false;
}
function addCat(item) {
  exameConfig.value.quetionsTotal += 1;

  if (exameConfig.value.quetions[item.id]) exameConfig.value.quetions[item.id] += 1;
  else exameConfig.value.quetions[item.id] = 1;
}
function removeCat(item) {
  if (exameConfig.value.quetionsTotal != 0) exameConfig.value.quetionsTotal -= 1;
  if (exameConfig.value.quetions[item.id] != 0) exameConfig.value.quetions[item.id] -= 1;
  else delete exameConfig.value.quetions[item.id];
}
</script>

<style lang="scss">
.user-table {
  .vue3-easy-data-table__header {
    overflow: visible;
    tr th .header .header-text {
      @apply text-base whitespace-nowrap  px-4 py-2 font-medium text-neutral-900;
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
