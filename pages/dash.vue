<template>
  <div class="profile-history">
    <div class="container">
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-20">
        <div class="lg:col-span-8">
          <div class="card mb-6">
            <div class="card-head">
              <div>
                <h3 class="title title--card-sm">Desempenho</h3>
              </div>
            </div>

            <dl class="grid grid-cols-1 gap-4 sm:grid-cols-3 sm:divide-x sm:divide-neutral-100">
              <div class="flex flex-col px-4 pb-8 text-center">
                <dt class="order-last text-sm font-medium text-neutral-500">Estações Feitas</dt>
                <dd class="text-4xl font-extrabold text-primary-600">{{ history.length || 0 }}</dd>
              </div>

              <div class="flex flex-col px-4 pb-8 text-center">
                <dt class="order-last text-sm font-medium text-neutral-500">Tempo médio</dt>
                <dd class="text-4xl font-extrabold text-primary-600">{{ calculateTime(timeArrays, true) }}</dd>
              </div>

              <div class="flex flex-col px-4 pb-8 text-center">
                <dt class="order-last text-sm font-medium text-neutral-500">Dias na plataforma</dt>
                <dd class="text-4xl font-extrabold text-primary-600">{{ currentDay.diff(resgiterDate, "d") }}</dd>
              </div>
            </dl>
          </div>

          <div class="card">
            <div class="card-head">
              <div>
                <h3 class="title title--card-sm">Histórico</h3>
                <p class="subtitle subtitle--card-sm">Suas estações feitas anteriomente apareceram aqui.</p>
              </div>
            </div>

            <Line :data="lineData" :options="lineOptions" :height="200" />
          </div>
        </div>
        <div class="lg:col-span-4">
          <div class="card mb-8">
            <div class="card-head">
              <div>
                <h3 class="title title--card-sm">Desempenho</h3>
              </div>
            </div>

            <PolarArea :data="polarData" :options="polarOptions" :height="300" />
          </div>

          <div class="card">
            <div class="card-head">
              <div>
                <h3 class="title title--card-sm">Meus números</h3>
              </div>
            </div>

            <div class="flow-root">
              <dl class="-my-3 divide-y divide-neutral-100 text-sm">
                <div class="grid grid-cols-1 gap-1 py-3 even:bg-neutral-50 sm:grid-cols-3 sm:gap-4">
                  <dt class="font-medium text-neutral-900 sm:col-span-2">Tempo total fazendo Estações</dt>
                  <dd class="text-neutral-700 text-right">{{ calculateTime(timeArrays) }}</dd>
                </div>

                <div class="grid grid-cols-1 gap-1 py-3 even:bg-neutral-50 sm:grid-cols-3 sm:gap-4">
                  <dt class="font-medium text-neutral-900 sm:col-span-2">Tempo médio fazendo Estações</dt>
                  <dd class="text-neutral-700 text-right">{{ calculateTime(timeArrays, true) }}</dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="load-page" v-if="loading"></div>
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
  RadialLinearScale,
  ArcElement,
} from "chart.js";
import { useUserStore } from "~~/stores";
import { Line, PolarArea } from "vue-chartjs";
import dayjs from "dayjs";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  RadialLinearScale,
  ArcElement
);

definePageMeta({
  title: "Dashboard",
});
useHead({
  title: "Dashboard",
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

const resgiterDate = dayjs(user.created_at);
const currentDay = dayjs();

const timeArrays = [];

function getCharLine() {
  const today = new Date();
  const lastSevenDays = [];

  for (let i = 6; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);

    let x = dayjs(date).format("DD/MM");
    let y = 0;

    history.value.forEach((his) => {
      if (dayjs(his.finished_at).format("DD/MM") == x) y += Number(his.datas?.media || 0);
    });

    lastSevenDays.push({ x, y });
  }

  return lastSevenDays;
}
function getCharPolar() {
  let values = [0, 0, 0, 0, 0];
  let totalValues = [0, 0, 0, 0, 0];
  let res = [0, 0, 0, 0, 0];

  history.value.forEach((his) => {
    if (his.area == "Clinica") {
      values[0] += Number(his.datas?.media || 0);
      totalValues[0] += 1;
    }
    if (his.area == "Cirurgia") {
      values[1] += Number(his.datas?.media || 0);
      totalValues[1] += 1;
    }
    if (his.area == "GO") {
      values[2] += Number(his.datas?.media || 0);
      totalValues[2] += 1;
    }
    if (his.area == "Pediatria") {
      values[3] += Number(his.datas?.media || 0);
      totalValues[3] += 1;
    }
    if (his.area == "Preventiva") {
      values[4] += Number(his.datas?.media || 0);
      totalValues[4] += 1;
    }

    if (his.finished_at) timeArrays.push(his.datas.time);
  });

  values.forEach((nota, index) => {
    if (nota != 0) res[index] = values / totalValues;
  });

  return values;
}

function calculateTime(timeArrays, calculateAverage = false) {
  if (timeArrays.length <= 0) return "00:00";

  let totalSeconds = 0;

  for (const [minutes, seconds] of timeArrays) {
    totalSeconds += minutes * 60 + seconds;
  }

  if (calculateAverage) {
    const averageSeconds = totalSeconds / timeArrays.length;
    return formatTime(averageSeconds);
  } else {
    return formatTime(totalSeconds);
  }
}
function formatTime(totalSeconds) {
  const totalHours = Math.floor(totalSeconds / 3600);
  const remainingSeconds = totalSeconds % 3600;
  const totalMinutes = Math.floor(remainingSeconds / 60);
  const totalSecondsOutput = remainingSeconds % 60;
  return `${formatTimeComponent(totalHours)}:${formatTimeComponent(totalMinutes)}:${formatTimeComponent(
    totalSecondsOutput
  )}`;
}
function formatTimeComponent(component) {
  return ("00" + component).slice(-2);
}

const lineData = {
  labels: [],
  datasets: [
    {
      label: "media",
      data: getCharLine(),
      borderColor: "#4685eb",
      fill: false,
      tension: 0.3,
      pointStyle: "circle",
      pointRadius: 1,
      pointHoverRadius: 10,
    },
  ],
};
const lineOptions = {
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

const polarData = {
  labels: ["Clínica", "Cirurgia", "GO", "Pediatria", "Preventiva"],
  datasets: [
    {
      label: "Média",
      data: getCharPolar(),
      border: false,
      backgroundColor: ["#70d6ff", "#ff70a6", "#9381ff", "#a5ffd6", "#f4f482"],
    },
  ],
};
const polarOptions = {
  responsive: true,
  plugins: {
    legend: {
      display: false,
    },
    title: {
      display: false,
    },
  },
};
</script>

<style lang="scss">
.profile-history {
  .table {
    border-spacing: 0 15px;
  }

  i {
    font-size: 1rem !important;
  }

  .table tr {
    border-radius: 20px;
  }

  tr td:nth-child(n + 5),
  tr th:nth-child(n + 5) {
    border-radius: 0 0.625rem 0.625rem 0;
  }

  tr td:nth-child(1),
  tr th:nth-child(1) {
    border-radius: 0.625rem 0 0 0.625rem;
  }
}
</style>
