<template>
  <div class="profile-page">
    <div class="container">
      <div class="card">
        <div class="card-head">
          <div>
            <h3 class="title title--card-sm">Criar estação</h3>
            <p class="subtitle subtitle--card-sm">Pesquise por um caso que deseja, depois escolha uma pessoa para realizar a estação.</p>
          </div>
          <Button size="small" @click="show = true">Ver estações</Button>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FieldAutocomplete name="case" label="Caso a ser tratado" route="stations" v-model="activityTask" placeholder="Procure uma atividade" />
          <FieldAutocomplete name="user" label="Procurar pessoa" route="users" v-model="activityUser" placeholder="Procure uma atividade" />
        </div>

        <div class="flex flex-col gap-2" v-if="activityTask.name || activityUser.name">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-2 mt-6">
            <div class="md:col-span-2">
              <div v-if="activityTask.name">
                <div class="text-h5-s text-neutral-700 mb-4">Estação escolhida</div>

                <div class="flex flex-col">
                  <!--
                   <div class="flex gap-2 flex-wrap">
                    <Badge color="errorDark"> Dificuldade 9 </Badge>
                    <Badge color="primaryDark"> task 1 </Badge>
                    <Badge color="primary"> task 5 </Badge>
                  </div>-->
                  <h3 class="text-lg font-medium">{{ activityTask.name }}</h3>
                  <p class="mt-1 text-sm text-neutral-700">{{ activityTask.short_description }}</p>

                  <div class="mt-4 sm:flex sm:items-center sm:gap-4" v-if="activityTask.datas">
                    <div class="flex items-center gap-1 text-neutral-500" v-if="activityTask.datas.timeMedia">
                      <Icon name="solar:clock-circle-bold-duotone" />
                      <p class="text-xs font-medium">Tempo médio {{ activityTask.datas.timeMedia }}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <div v-if="activityUser.name">
                <div class="text-h5-s text-neutral-700 mb-4">Quem irá fazer o teste</div>

                <div class="flex items-start gap-5">
                  <div class="relative shrink-0">
                    <span v-if="activityUser.status == 'online'" class="absolute bg-green-500 right-0 top-0 z-10 h-2 aspect-square rounded-full"> </span>
                    <img :src="activityUser.picture" class="h-10 w-10 rounded-full object-cover" />
                  </div>
                  <div class="text-sm grow">
                    <strong class="block font-medium">{{ activityUser.name }}</strong>
                    <div class="flex gap-1">
                      <Badge size="small" v-for="tag in activityUser.tags" :key="tag"> {{ tag }} </Badge>
                    </div>

                    <div class="flex mt-6" v-if="currentUser.following.includes(activityUser._id)">
                      <Button size="tiny" @click="loadUserHistory(activityUser._id)" :loading="loadingUser"> Ver histórico </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <Button class="!px-12 mx-auto mt-12" v-if="activityTask.name && activityUser.name" @click="startStation"> Iniciar estação </Button>
        </div>
      </div>
    </div>

    <div class="load-page" v-if="loading"></div>

    <!-- Modal history -->
    <TransitionRoot as="template" :show="showHistory">
      <Dialog as="div" class="relative z-10" @close="showHistory = false">
        <TransitionChild as="template" enter="ease-out duration-300" enter-from="opacity-0" enter-to="opacity-100" leave="ease-in duration-200" leave-from="opacity-100" leave-to="opacity-0">
          <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
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
              <DialogPanel class="relative transform overflow-hidden rounded-lg bg-card text-left shadow-xl transition-all h-screen w-full md:max-w-[80vw] md:max-h-[80vh] max-h-[90vh] flex flex-col">
                <div class="p-4">
                  <div class="flex items-center justify-between gap-4">
                    <div class="text-base font-semibold leading-6 text-gray-900">
                      <h3>Histórico de {{ activityUser.name }}</h3>
                    </div>

                    <Button icon color="link" size="tiny" class="!p-1" @click="showHistory = false">
                      <Icon name="solar:close-circle-line-duotone" size="1.75em" />
                    </Button>
                  </div>
                </div>

                <div class="w-full px-2 pt-4 pb-10 grow max-h-[cacl(100%_-_56px)] flex flex-col overflow-y-auto">
                  <TabGroup>
                    <TabList class="flex space-x-1 rounded-xl p-1">
                      <Tab v-for="area in Object.keys(history)" as="template" :key="area" v-slot="{ selected }">
                        <button
                          :class="['w-full rounded-lg py-2.5 text-body font-semibold  ', selected ? 'text-primary-700 bg-primary-100' : 'text-neutral-600 hover:bg-primary-50 hover:text-primary']"
                        >
                          {{ area }}
                        </button>
                      </Tab>
                    </TabList>

                    <TabPanels class="mt-4 grow overflow-y-auto">
                      <TabPanel v-for="(area, idx) in Object.values(history)" :key="idx">
                        <table class="w-full divide-y-2 divide-gray-200 bg-white text-sm">
                          <thead class="text-left">
                            <tr>
                              <th class="whitespace-nowrap px-4 py-2 font-medium text-gray-900">Nome</th>
                              <th class="whitespace-nowrap px-4 py-2 font-medium text-gray-900 text-center">Nota</th>
                              <th class="whitespace-nowrap px-4 py-2 font-medium text-gray-900 text-center">Media da estação</th>
                              <th></th>
                            </tr>
                          </thead>

                          <tbody class="divide-y divide-gray-200">
                            <tr v-for="station in area" :key="station._id">
                              <td class="whitespace-nowrap px-4 py-2 font-medium text-gray-900">{{ station.name }}</td>
                              <td class="whitespace-nowrap px-4 py-2 text-gray-700 text-center">{{ station.userMedia ? station.userMedia : "x" }}</td>
                              <td class="whitespace-nowrap px-4 py-2 text-gray-700 text-center">{{ station.datas?.media ? Number(station.datas?.media).toFixed(1) : "-" }}</td>
                              <td class="whitespace-nowrap px-4 py-2 flex justify-end">
                                <Button
                                  size="tiny"
                                  @click="
                                    activityTask = station;
                                    showHistory = false;
                                  "
                                >
                                  Escolher <Icon name="solar:alt-arrow-right-outline" />
                                </Button>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </TabPanel>
                    </TabPanels>
                  </TabGroup>
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </TransitionRoot>

    <!-- Modal all stations -->
    <TransitionRoot as="template" :show="show">
      <Dialog as="div" class="relative z-10" @close="closeModal">
        <TransitionChild as="template" enter="ease-out duration-300" enter-from="opacity-0" enter-to="opacity-100" leave="ease-in duration-200" leave-from="opacity-100" leave-to="opacity-0">
          <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
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
              <DialogPanel class="relative transform overflow-hidden rounded-lg bg-card text-left shadow-xl transition-all h-screen w-full md:max-w-[80vw] md:max-h-[80vh] max-h-[90vh] flex flex-col">
                <div class="p-4">
                  <div class="flex items-center justify-between gap-4">
                    <div class="text-base font-semibold leading-6 text-gray-900">
                      <h3>Estações</h3>
                    </div>

                    <Button icon color="link" size="tiny" class="!p-1" @click="closeModal">
                      <Icon name="solar:close-circle-line-duotone" size="1.75em" />
                    </Button>
                  </div>
                </div>

                <div class="w-full px-2 pt-4 pb-10 grow max-h-[cacl(100%_-_56px)] flex flex-col overflow-y-auto">
                  <TabGroup>
                    <TabList class="flex space-x-1 rounded-xl p-1">
                      <Tab v-for="area in Object.keys(stations)" as="template" :key="area" v-slot="{ selected }">
                        <button
                          :class="['w-full rounded-lg py-2.5 text-body font-semibold  ', selected ? 'text-primary-700 bg-primary-100' : 'text-neutral-600 hover:bg-primary-50 hover:text-primary']"
                        >
                          {{ area }}
                        </button>
                      </Tab>
                    </TabList>

                    <TabPanels class="mt-4 grow overflow-y-auto">
                      <TabPanel v-for="(area, idx) in Object.values(stations)" :key="idx">
                        <table class="w-full divide-y-2 divide-gray-200 bg-white text-sm">
                          <thead class="text-left">
                            <tr>
                              <th class="whitespace-nowrap px-4 py-2 font-medium text-gray-900">Nome</th>
                              <th class="whitespace-nowrap px-4 py-2 font-medium text-gray-900">Média</th>
                              <th class="px-4 py-2"></th>
                            </tr>
                          </thead>

                          <tbody class="divide-y divide-gray-200">
                            <tr v-for="station in area" :key="station._id">
                              <td class="whitespace-nowrap px-4 py-2 font-medium text-gray-900">{{ station.name }}</td>
                              <td class="whitespace-nowrap px-4 py-2 text-gray-700">{{ station.datas?.media ? station.datas.media : "-" }}</td>
                              <td class="whitespace-nowrap px-4 py-2 flex justify-end">
                                <Button
                                  size="tiny"
                                  @click="
                                    activityTask = station;
                                    closeModal();
                                  "
                                >
                                  Escolher <Icon name="solar:alt-arrow-right-outline" />
                                </Button>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </TabPanel>
                    </TabPanels>
                  </TabGroup>
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
import { TabGroup, TabList, Tab, TabPanels, TabPanel, Dialog, DialogPanel, TransitionChild, TransitionRoot } from "@headlessui/vue";
import { useUserStore } from "~~/stores/user";
import dayjs from "dayjs";
import "dayjs/locale/pt-br";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);
dayjs.locale("pt-br");

definePageMeta({
  title: "Criar estação",
});
useHead({
  title: "Criar estação",
});

const activityTask = ref({});
const activityUser = ref({});

const Toast = useState("toast").value;
const store = useUserStore();
const router = useRouter();
const config = useRuntimeConfig();
const currentUser = computed(() => store.currentUser);
const user = store.current;

const loading = ref(false);

const show = ref(false);
const showHistory = ref(false);

const stations = ref({});

let stationsAux = await store.get(`stations`, {
  fields: {
    area: true,
    name: true,
    short_description: true,
    tags: true,
    datas: true,
  },
});

stations.value = stationsAux.data.reduce((r, a) => {
  r[a.area] = r[a.area] || [];
  r[a.area].push(a);
  return r;
}, {});

const categories = ref({
  Recent: [
    {
      id: 1,
      title: "Does drinking coffee make you smarter?",
      date: "5h ago",
      commentCount: 5,
      shareCount: 2,
    },
    {
      id: 2,
      title: "So you've bought coffee... now what?",
      date: "2h ago",
      commentCount: 3,
      shareCount: 2,
    },
  ],
  Popular: [
    {
      id: 1,
      title: "Is tech making coffee better or worse?",
      date: "Jan 7",
      commentCount: 29,
      shareCount: 16,
    },
    {
      id: 2,
      title: "The most innovative things happening in coffee",
      date: "Mar 19",
      commentCount: 24,
      shareCount: 12,
    },
  ],
  Trending: [
    {
      id: 1,
      title: "Ask Me Anything: 10 answers to your questions about coffee",
      date: "2d ago",
      commentCount: 9,
      shareCount: 5,
    },
    {
      id: 2,
      title: "The worst advice we've ever heard about coffee",
      date: "4d ago",
      commentCount: 1,
      shareCount: 2,
    },
  ],
});

function closeModal() {
  show.value = false;
}

async function startStation() {
  loading.value = true;

  let newRooom = {
    mentor: user.name,
    mentor_id: user._id,
    mentor_picture: user.pictureSmall,

    user: activityUser.value.name,
    user_id: activityUser.value._id,
    user_picture: activityUser.value.picture,

    station_id: activityTask.value._id,
    station: activityTask.value.name,
    area: activityTask.value.area,
  };

  if (newRooom.mentor_id == newRooom.user_id) {
    Toast.error({ title: "Erro ao criar estação!", message: "Você não pode iniciar uma sala sozinho, pesquise outra pessoa como mentorado ou peça para um mentor preparar a estação." });
  } else {
    let { data: room } = await store.post("users-stations", newRooom);

    router.push({ path: `/rooms/${room._id}` });
  }

  loading.value = false;
}

const loadingUser = ref(false);
const history = ref([]);

async function loadUserHistory(id) {
  loadingUser.value = true;

  let historyAux = await store.get(`users-stations/user/${id}`, {
    fields: {
      area: true,
      "datas.media": true,
      "usersInfo.station": true,
      station_id: true,
      created_at: true,
    },
  });

  let ids = {};
  historyAux.data.forEach((element) => {
    if (!ids[element.station_id]) {
      ids[element.station_id] = { count: 1, total: element.datas?.media || 0 };
    } else {
      ids[element.station_id].count += 1;
      ids[element.station_id].total += element.datas?.media || 0;
    }
  });

  let staionswithUser = stationsAux.data;

  for (const [key, value] of Object.entries(ids)) {
    let idx = staionswithUser.findIndex((sta) => sta._id == key);
    if (idx != -1) staionswithUser[idx].userMedia = (value.total / value.count).toFixed(1);
  }

  history.value = staionswithUser.reduce(function (r, a) {
    r[a.area] = r[a.area] || [];
    r[a.area].push(a);
    return r;
  }, {});

  showHistory.value = true;

  loadingUser.value = false;
}

const selectedCategory = ref(null);
const filteredItems = ref([]);

const selectCategory = (category) => {
  selectedCategory.value = category;
  filteredItems.value = items.filter((item) => item.category === category);
};

const testData = {
  labels: ["Paris", "Nîmes", "Toulon", "Perpignan", "Autre"],
  datasets: [
    {
      data: [30, 40, 60, 70, 5],
      backgroundColor: ["#77CEFF", "#0079AF", "#123E6B", "#97B0C4", "#A5C8ED"],
    },
  ],
};

function getDayRelative(date) {
  return dayjs().to(dayjs(date));
}
</script>

<style>
.area {
  background: white;
  position: sticky;
  top: 0; /* Don't forget this, required for the stickiness */
  box-shadow: 0 2px 2px -1px rgba(0, 0, 0, 0.4);
}
</style>
