<template>
  <div class="profile-page">
    <div class="container">
      <div class="header-banner">
        <Splide :options="bannersOptions">
          <SplideSlide v-for="(banner, index) in banners" :key="index">
            <BannerView :bannerData="banner" />
          </SplideSlide>
        </Splide>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-20">
        <div class="lg:col-span-8">
          <div class="flex flex-col w-full">
            <div class="card mb-6">
              <div class="text-h4 mb-5">Seja bem vindo!</div>

              <div class="flex flex-row items-center gap-4">
                <div class="">
                  <img
                    class="w-16 aspect-square rounded-full overflow-hidden"
                    loading="lazy"
                    :src="currentUser?.pictureMedium || '123'"
                    :alt="currentUser?.name"
                  />
                </div>
                <div>
                  <div class="text-h4 font-bold">{{ currentUser.name }}</div>
                  <div class="">{{ currentUser.tags[0] }}</div>
                </div>
              </div>

              <div class="flex gap-5 flex-row mt-6">
                <div class="flex gap-2">
                  <div class="text-h4 font-bold text-neutral">{{ currentUser.followers.length }}</div>
                  <div class="">Seguidores</div>
                </div>
                <div class="flex gap-2">
                  <div class="text-h4 font-bold text-neutral">{{ currentUser.following.length }}</div>
                  <div class="">Seguindo</div>
                </div>
              </div>
            </div>

            <div class="card mb-6 !p-0 !bg-primary-600" v-if="currentUser.plan == 'disabled'">
              <div class="relative p-10 xl:py-12 xl:px-20 overflow-hidden rounded-3xl">
                <img
                  class="absolute -right-40 top-0 sm:top-1/2 transform -translate-y-1/2 w-1/2 sm:w-2/3 lg:w-auto mt-12 sm:mt-0"
                  src="/images/card.png"
                />
                <div class="relative z-10 sm:max-w-sm">
                  <h2 class="mb-6 text-3xl md:text-4xl text-white font-semibold leading-[115%]">Vamos começar?</h2>
                  <p class="mb-8 text-lg text-neutral-300">
                    Assine um plano para poder desfrutar de todos os recursos do Dr.Revalida
                  </p>
                  <div class="sm:max-w-max">
                    <NuxtLink
                      class="block py-5 px-7 w-full text-lg leading-3 text-white font-medium tracking-tighter font-heading text-center bg-blue-500 hover:bg-blue-600 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 rounded-xl"
                      to="/payments/signature"
                    >
                      Assinar Plano
                    </NuxtLink>
                  </div>
                </div>
              </div>
            </div>

            <div class="card mb-6">
              <h3 class="text-xl font-bold mb-12">Seu progresso</h3>

              <Line :data="chartData" :options="optionsData" :height="250" />
            </div>

            <div class="card flex flex-row gap-3 items-start justify-start mb-6" v-for="item in feed" :key="item._id">
              <div class="flex flex-col gap-1 items-center justify-center">
                <div class="shrink-0 w-12 aspect-square relative">
                  <img class="rounded-full w-full h-full object-cover" :src="item.usersInfo.userpicture" />
                </div>
                <div class="shrink-0 w-9 aspect-square relative">
                  <img class="rounded-full w-full h-full object-cover" :src="item.usersInfo.mentorpicture" />
                </div>
              </div>

              <div class="flex flex-col gap-3 items-start justify-start relative grow">
                <div class="flex flex-col gap-1 items-start relative w-full">
                  <div class="flex flex-row gap-1 items-end justify-between w-full">
                    <div class="text-neutral-900 text-left relative text-h4 font-bold">
                      {{ item.usersInfo.userName }} terminou {{ item.usersInfo.station }}
                    </div>
                    <div class="text-neutral-400 text-left relative text-body-sm">
                      {{ getDayRelative(item.finished_at) }}
                    </div>
                  </div>
                  <div class="w-full">
                    <p class="text-neutral w-full mt-1" style="font: 'SF Pro Text', sans-serif">
                      {{ item.usersInfo.userName }} finalizou a estação "{{ item.usersInfo.station }}", mentorado por
                      {{ item.usersInfo.mentorName }}
                    </p>

                    <div class="flex flex-col mt-3">
                      <div class="text-neutral-900 text-body-sm font-semibold">- Resultados</div>

                      <div class="mt-2 sm:flex sm:items-center sm:gap-4">
                        <div class="flex items-center gap-1 text-success-500">
                          <Icon name="solar:clock-circle-bold-duotone" />
                          <p class="text-xs font-medium">Tempo: {{ item.datas.time[0] }}:{{ item.datas.time[1] }}</p>
                        </div>

                        <div class="flex items-center gap-1 text-success">
                          <Icon name="solar:check-circle-bold-duotone" />
                          <p class="text-xs font-medium">Acertou {{ item.datas.media.toFixed(1) || "0" }}%</p>
                        </div>
                      </div>

                      <div class="grid grid-cols-2 lg:grid-cols-3 w-full mt-6 gap-6">
                        <div class="w-full" v-for="(result, key) in item.datas.result">
                          <div class="text-body-sm text-neutral-800 mb-0.5">
                            {{ global.options.types[key] }}
                          </div>
                          <div class="h-1.5 bg-blue-200 overflow-hidden rounded-full">
                            <div class="bg-blue-500 h-1.5 rounded-full" :style="{ width: result + '%' }"></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="inline-flex items-center justify-center gap-3">
              <Button icon size="small" color="link" :disabled="page == 1" @click="page -= 1">
                <Icon name="solar:alt-arrow-left-linear" size="16" />
              </Button>

              <p v-if="false" class="text-xs text-neutral-900">
                {{ page }}
                <span class="mx-0.25">/</span>
                12
              </p>

              <Button icon size="small" :disabled="feed?.length < 10" color="link" @click="page += 1">
                <Icon name="solar:alt-arrow-right-linear" size="16" />
              </Button>
            </div>
          </div>
        </div>

        <div class="lg:col-span-4">
          <Button to="/activity"> Criar nova estação </Button>

          <div class="card mb-6 mt-4">
            <div class="title title--card-sm mb-4">Pesquise pessoas</div>

            <div class="relative">
              <FieldInput
                name="search"
                @keyup.enter="search"
                v-model="querySearch"
                hidden-label
                placeholder="Busque por nome ou e-mail"
              />

              <Button icon color="link" size="tiny" class="!absolute top-1 right-0.5" @click="search">
                <Icon name="solar:minimalistic-magnifer-line-duotone" size="20" />
              </Button>
            </div>

            <div class="load-content-tiny" v-if="usersSearchLoading"></div>

            <div v-if="!usersSearchBanck && usersSearch.length <= 0 && !usersSearchLoading">
              <CardEmpty type="search" desc="Pesquise por outro nome ou email" title="Sem resultados" />
            </div>

            <div v-if="!usersSearchBanck && usersSearch.length > 0 && !usersSearchLoading" class="mt-4 pb-4 w-full">
              <div v-for="user in usersSearch" :key="user._id">
                <div v-if="user._id != currentUser._id" class="py-3 flex gap-2 items-center justify-start">
                  <div class="relative shrink-0">
                    <span
                      v-if="user.status == 'online'"
                      class="absolute bg-green-500 right-0 top-0 z-10 h-2 aspect-square rounded-full"
                    >
                    </span>
                    <img class="w-12 h-12 rounded-full shrink-0" :src="user.picture" />
                  </div>
                  <div class="flex flex-col gap-0 items-start justify-start grow">
                    <div class="text-neutral-800" style="font: 400 15px 'SF Pro Text', sans-serif">{{ user.name }}</div>
                    <div
                      class="text-neutral"
                      style="font: 300 15px 'SF Pro Text', sans-serif"
                      v-if="user.tags && user.tags[0]"
                    >
                      {{ user.tags[0] }}
                    </div>
                  </div>

                  <Button
                    v-if="!currentUser.followingAwait.includes(user._id)"
                    size="tiny"
                    color="secondary"
                    class="!rounded-full"
                    @click="follow(user._id)"
                  >
                    {{ currentUser.following.includes(user._id) ? "Deixar de seguir" : "Seguir" }}
                  </Button>
                  <Badge v-if="currentUser.followingAwait.includes(user._id)" class="!rounded-full">
                    Solicitado <Icon name="solar:clock-circle-line-duotone" size="14" />
                  </Badge>
                </div>
              </div>
            </div>
          </div>

          <div class="card" :key="time" v-if="currentUser.plan != 'disabled' && showItem">
            <div class="title title--card-sm">Pode interessar</div>

            <div v-for="user in users" :key="user._id">
              <div v-if="user._id != currentUser._id" class="py-3 flex gap-2 items-center justify-start">
                <div class="relative shrink-0">
                  <span
                    v-if="user.status == 'online'"
                    class="absolute bg-green-500 right-0 top-0 z-10 h-2 aspect-square rounded-full"
                  >
                  </span>
                  <img class="w-12 h-12 rounded-full shrink-0" :src="user.picture" />
                </div>

                <div class="flex flex-col gap-0 items-start justify-start grow">
                  <div class="text-neutral-800" style="font: 400 15px 'SF Pro Text', sans-serif">{{ user.name }}</div>
                  <div
                    class="text-neutral"
                    style="font: 300 15px 'SF Pro Text', sans-serif"
                    v-if="user.tags && user.tags[0]"
                  >
                    {{ user.tags[0] }}
                  </div>
                </div>

                <Button
                  v-if="!currentUser.followingAwait.includes(user._id)"
                  size="badge"
                  color="secondary"
                  class="!rounded-full"
                  @click="follow(user._id)"
                  :loading="loadingsId.includes(user._id)"
                >
                  {{ currentUser.following.includes(user._id) ? "Deixar de seguir" : "Seguir" }}
                </Button>
                <Badge v-if="currentUser.followingAwait.includes(user._id)" class="!rounded-full">
                  Solicitado <Icon name="solar:clock-circle-line-duotone" size="14" />
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { useUserStore, useGlobalStore } from "~~/stores";
import dayjs from "dayjs";
import { Splide, SplideSlide } from "@splidejs/vue-splide";
import "@splidejs/splide/dist/css/themes/splide-skyblue.min.css";
import "dayjs/locale/pt-br";
import relativeTime from "dayjs/plugin/relativeTime";
import { Line } from "vue-chartjs";
import { push } from "notivue";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

dayjs.extend(relativeTime);
dayjs.locale("pt-br");

const store = useUserStore();
const global = useGlobalStore();
const config = useRuntimeConfig();
const currentUser = computed(() => store.currentUser);
const user = store.current;

const querySearch = ref("");
const usersSearch = ref([]);
const usersSearchBanck = ref(true);
const usersSearchLoading = ref(false);
var timeoutSearch = null;

async function search() {
  usersSearchLoading.value = true;
  let value = querySearch.value;
  usersSearchBanck.value = false;

  clearTimeout(timeoutSearch);
  timeoutSearch = setTimeout(async () => {
    const api = `${config.public.apiBase}users/public/search?q=${encodeURI(value)}`;
    const { data } = await useFetch(api);

    usersSearch.value = data.value;
    usersSearchLoading.value = false;
  }, 450);
}

await store.getAccessToken();

const page = ref(1);
var { data: users, refresh: refreshUsers } = await useAsyncData(`users-to-follow`, () =>
  $fetch(`${config.public.apiBase}users/public/search`)
);
var { data: feed, refresh: refreshFeed } = await useAsyncData(
  `feed`,
  () =>
    $fetch(`${config.public.apiBase}users-stations/feed`, {
      headers: { Authorization: `Bearer ${store.accessToken}` },
      params: {
        page: page.value,
      },
    }),
  {
    watch: [page],
  }
);

const activityUser = ref({});

const bannersOptions = {
  type: "loop",
  speed: 400,
  width: "100%",
  height: "200px",
  gap: 24,
  arrows: false,
  pagination: true,
  easing: "cubic-bezier(0.25, 1, 0.5, 1)",
  perPage: 1,
  perMove: 1,
  lazyLoad: true,
  autoplay: true,
  pauseOnHover: true,
  pauseOnFocus: true,
  breakpoints: {
    780: {
      height: "150px",
    },
    1024: {
      height: "175px",
    },
  },
};

function getDayRelative(date) {
  return dayjs().to(dayjs(date));
}
const showItem = ref(123);

const loadingsId = ref([]);

async function follow(id) {
  if (user._id != id) {
    loadingsId.value.push(id);
    let hasFollow = currentUser.value.following.includes(id);

    await store.get(`users/${hasFollow ? "unfollow" : "follow"}/${user._id}/${id}`).then(async () => {
      await store.fetchUser();
      refreshUsers();
      refreshFeed();
      showItem.value = false;
      showItem.value = new Date();
    });
  } else push.error("Voce nao pode se seguir");

  loadingsId.value = [];
}

const { data: history } = await useAsyncData(`list-history`, () =>
  $fetch(`${config.public.apiBase}users-stations/user/${user._id}`, {
    headers: { Authorization: `Bearer ${store.accessToken}` },
  })
);
const { data: banners } = await useAsyncData(`list-banners`, () =>
  $fetch(`${config.public.apiBase}banners`, {
    headers: { Authorization: `Bearer ${store.accessToken}` },
  })
);

function getLastSevenDays() {
  const today = new Date();
  const lastSevenDays = [];

  for (let i = 6; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);

    let x = dayjs(date).format("DD/MM");
    let y = 0;
    if (history?.value?.length >= 1) {
      history.value.forEach((his) => {
        if (dayjs(his.finished_at).format("DD/MM") == x) y += Number(his.datas.media || 0);
      });
    }

    lastSevenDays.push({ x, y });
  }

  return lastSevenDays;
}

const chartData = {
  labels: [],
  datasets: [
    {
      label: "media",
      data: getLastSevenDays(),
      borderColor: "#4685eb",
      fill: false,
      tension: 0.3,
      pointStyle: "circle",
      pointRadius: 1,
      pointHoverRadius: 10,
    },
  ],
};

const optionsData = {
  responsive: true,
  plugins: {
    legend: {
      display: false,
    },
    title: {
      display: false,
    },
  },
  scales: {
    x: {
      border: {
        display: false,
      },
      title: {
        display: false,
      },
    },
    y: {
      border: {
        display: false,
      },
      grid: {
        display: false,
      },
      display: false,
    },
  },
};
</script>

<style lang="scss">
.header-banner {
  border-radius: 12px;
  width: 100%;
  margin-bottom: 32px;
  height: 150px;
  .splide__track {
    border-radius: 12px;
    overflow: hidden;
  }
  @media only screen and (min-width: 780px) {
    height: 175px;
  }
  @media only screen and (min-width: 1024px) {
    height: 200px;
  }
}
</style>
