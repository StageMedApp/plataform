<template>
  <div class="room-page">
    <div class="max-w-[1440px] mx-auto px-4">
      <div class="grid grid-cols-1 md:grid-cols-12 gap-6">
        <div class="order-2 md:order-1 md:col-span-8 lg:col-span-9">
          <div
            class="flex flex-col gap-2 items-center justify-center w-full h-96"
            v-if="stateRoom == 'await' && currentUser._id != room.mentor_id"
          >
            <Icon name="solar:alarm-play-bold-duotone" class="text-primary mb-4" size="72" />
            <div class="max-w-sm text-center mb-2 px-4 text-neutral-900 text-h3 font-bold">Aguardando mentor</div>
            <div class="max-w-sm text-center px-4 text-neutral-500 text-body">
              Assim que o mentor iniciar a estação você verá mais informações sobre esta estação.
            </div>
          </div>

          <div class="card !px-4 !pt-3" v-if="currentUser._id == room.mentor_id || stateRoom != 'await'">
            <div class="card-head">
              <div class="flex gap-2 items-center">
                <h3 class="title title--card">
                  {{
                    currentUser._id == room.mentor_id
                      ? `${station.name} - ${station.area}`
                      : `Você está fazendo uma estação de ${station.area}`
                  }}
                </h3>
              </div>
            </div>

            <div class="mx-auto w-full rounded-2xl bg-white">
              <Disclosure defaultOpen v-slot="{ open }">
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

              <Disclosure defaultOpen as="div" class="mt-2" v-slot="{ open }">
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

              <Disclosure defaultOpen as="div" class="mt-2" v-slot="{ open }">
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

              <Disclosure
                defaultOpen
                as="div"
                class="mt-2"
                v-slot="{ open }"
                v-if="station.clinicalCase.instruction && currentUser._id == room.mentor_id"
              >
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
            <div class="card !px-4 !py-3 mt-6" v-if="currentUser._id == room.mentor_id || isVisible[itemIdx] == true">
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
                    <div class="flex justify-end gap-2" v-if="currentUser._id == room.mentor_id">
                      <Button
                        color="link"
                        size="tiny"
                        v-if="!isVisible[itemIdx]"
                        @click="controlVisible(itemIdx, true)"
                      >
                        Liberar <Icon name="solar:lock-keyhole-minimalistic-bold-duotone" />
                      </Button>
                      <Button
                        color="secondaryError"
                        v-if="isVisible[itemIdx]"
                        size="tiny"
                        @click="controlVisible(itemIdx, false)"
                      >
                        Bloquear <Icon name="solar:lock-keyhole-minimalistic-unlocked-bold-duotone"
                      /></Button>
                    </div>

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

          <div class="card !px-4 !pt-3 mt-6" v-if="currentUser._id == room.mentor_id || stateRoom == 'stoped'">
            <div class="card-head">
              <div class="flex gap-2 items-center">
                <h3 class="title title--card-sm">Avaliação</h3>
              </div>
            </div>

            <div class="divide-y">
              <div
                class="flex items-center justify-between gap-4 py-3 px-2"
                :class="[
                  item.points.i != null && Number(item.points.i) == Number(item.value) && 'bg-error-50',
                  item.points.p != null && Number(item.points.p) == Number(item.value) && 'bg-warning-50',
                  item.points.a != null && Number(item.points.a) == Number(item.value) && 'bg-success-50',
                ]"
                v-for="(item, idx) in assessment"
              >
                <div>
                  {{ item.title }}
                </div>

                <div
                  class="flex items-center gap-1"
                  :class="[currentUser._id != room.mentor_id && 'pointer-events-none']"
                >
                  <Button
                    v-if="item.points.i != null"
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
                    v-if="item.points.p != null"
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
                    v-if="item.points.a != null"
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

                  <div class="w-7 flex items-center justify-end p-0" v-if="currentUser._id == room.mentor_id">
                    <Popover class="relative m-0 flex items-center" v-if="item.obs">
                      <PopoverButton class="">
                        <Button icon size="tiny" class="!p-0.5" color="link">
                          <Icon size="1.75em" name="solar:info-circle-line-duotone" />
                        </Button>
                      </PopoverButton>

                      <PopoverPanel class="absolute top-8 right-2 z-10 bg-white shadow-xlarge p-4 rounded-md w-64">
                        {{ item.obs }}
                      </PopoverPanel>
                    </Popover>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div
            class="card mt-8 !bg-primary-50"
            v-if="station.commet && (currentUser._id == room.mentor_id || stateRoom == 'stoped')"
          >
            <div class="card-head">
              <div class="flex gap-2 items-center">
                <h3 class="title title--card">Comentário da estação</h3>
              </div>
            </div>

            <div class="prose prose-sm" v-html="station.commet"></div>
          </div>
        </div>

        <div class="order-1 md:order-2 md:col-span-4 lg:col-span-3">
          <div class="card">
            <div class="flex felx-col gap-4 items-center justify-between mb-2">
              <Button
                block
                @click="finishRoom"
                :disabled="users.length != 2"
                v-if="currentUser._id == room.mentor_id && stateRoom == 'stoped'"
                :loading="loadingFinish"
              >
                Salvar
              </Button>
            </div>
            <div class="flex felx-col gap-4 items-center justify-between">
              <Button
                block
                @click="start"
                :disabled="users.length != 2"
                v-if="
                  currentUser._id == room.mentor_id && (stateRoom == 'await' || (stateRoom == 'started' && !interval))
                "
              >
                {{ stateRoom == "started" ? "Continuar" : "Iniciar" }}
              </Button>
              <Button
                block
                @click="stop"
                v-if="currentUser._id == room.mentor_id && stateRoom == 'started' && interval"
              >
                Finalizar</Button
              >
              <div class="grow flex flex-nowrap gap-1 justify-center items-center">
                <Icon name="solar:clock-circle-bold-duotone" size="20" />

                <span class="text-3xl font-semibold d-countdown font-mono">
                  <span :style="`--value: ${minutes}`"></span>
                </span>
                <span class="text-xl font-semibold -mx-1"> : </span>
                <span class="text-3xl font-semibold d-countdown font-mono">
                  <span :style="`--value: ${seconds}`"></span>
                </span>
              </div>
            </div>

            <Disclosure defaultOpen v-slot="{ open }">
              <DisclosureButton class="flex w-full justify-between mt-8">
                <div class="title title-h5">Pessoas na sala ({{ users.length }})</div>

                <Icon
                  name="solar:alt-arrow-down-outline"
                  :class="open ? 'rotate-180 transform' : ''"
                  class="h-5 w-5 text-primary-500 transition"
                />
              </DisclosureButton>
              <DisclosurePanel>
                <ul>
                  <li class="py-3 pb-2" v-for="u in users" :key="u.socket_id">
                    <div class="flex items-center space-x-4">
                      <div class="flex-shrink-0">
                        <img class="w-8 h-8 rounded-full" :src="u.user.pictureSmall" />
                      </div>
                      <div class="flex-1 min-w-0">
                        <p class="text-sm font-medium text-neutral-900 truncate">{{ u.user.name }}</p>
                      </div>
                    </div>
                  </li>
                </ul>
              </DisclosurePanel>
            </Disclosure>
          </div>

          <div class="mt-1 mb-4 flex justify-end items-center gap-2">
            <Button size="tiny" color="secondary" @click="global.copyToClipboard(linkPage)">Copiar Link</Button>
            <Button
              size="tiny"
              color="secondary"
              @click="
                global.socialShare({
                  title: 'Entre na sala - Stagemed',
                  text: 'Entre na sala para participar da estação',
                  url: linkPage,
                })
              "
              >Compartilhar</Button
            >
          </div>

          <!-- Chat text -->
          <Disclosure defaultOpen v-slot="{ open }">
            <DisclosureButton class="flex w-full justify-between mt-2">
              <span>Conversa</span>
              <Icon
                name="solar:alt-arrow-down-outline"
                :class="open ? 'rotate-180 transform' : ''"
                class="h-5 w-5 text-primary-500 transition"
              />
            </DisclosureButton>
            <DisclosurePanel>
              <div class="card-sm mt-2 !p-0 card-chat">
                <div class="max-h-80 h-80 grow justify-end pb-4 overflow-auto w-full p-2">
                  <div class="flex flex-col gap-3">
                    <div class="chat" :class="[msg.user == currentUser._id && 'chat-end']" v-for="msg in messages">
                      <div class="chat-bubble">
                        <time class="chat-time">{{ msg.time }}</time> {{ msg.text }}
                      </div>
                    </div>
                  </div>
                </div>

                <Form @submit="sendMessage" class="flex gap-1 p-2">
                  <FieldInput class="grow" size="small" name="msg" hidden-label placeholder="Sua mensagem" />
                  <Button icon class="!shrink-0" size="small"><Icon name="solar:arrow-right-linear" /> </Button>
                </Form>
              </div>
            </DisclosurePanel>
          </Disclosure>
        </div>
      </div>
    </div>

    <TransitionRoot as="template" :show="show">
      <Dialog as="div" class="relative z-10">
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
                class="relative transform overflow-hidden rounded-2xl bg-card text-left shadow-xl transition-all w-full sm:max-w-3xl max-h-[95vh] md:max-h-[80vh] flex flex-col overflow-y-auto"
              >
                <div class="px-4 pt-10 relative text-center">
                  <Icon name="solar:check-circle-line-duotone" class="text-success mb-4" size="72" />
                  <div class="mb-2 px-4 text-neutral-900 text-h3 font-bold" v-if="currentUser._id == room.mentor_id">
                    Que legal {{ currentUser.name }}!
                  </div>
                  <div class="mb-2 px-4 text-neutral-900 text-h3 font-bold" v-else>
                    Parabens {{ currentUser.name }}!
                  </div>

                  <div class="px-4 text-neutral-500 text-body" v-if="currentUser._id == room.mentor_id">
                    Você ajudou <span class="font-semibold">{{ room.usersInfo.userName }}</span> a finalizar a estação
                    {{ `${station.name} - ${station.area}` }}
                  </div>
                  <div class="px-4 text-neutral-500 text-body" v-else>
                    Parabens você finalizou a estação {{ `${station.name} - ${station.area}` }}
                  </div>
                </div>

                <div class="mt-4 px-4 pb-4 grow">
                  <div class="prose mb-4">
                    <ul>
                      <li>
                        {{ currentUser._id == room.mentor_id ? room.usersInfo.userName.split(" ")[0] : "Você" }} levou
                        <span class="m-0 font-semibold d-countdown font-mono">
                          <span :style="`--value: ${minutes}`"></span>
                        </span>
                        :
                        <span class="m-0 font-semibold d-countdown font-mono">
                          <span :style="`--value: ${seconds}`"></span>
                        </span>
                        para concluir essa estação
                      </li>

                      <li>
                        {{ currentUser._id == room.mentor_id ? "A" : "Sua" }} pontuação foi de
                        <span class="m-0 font-semibold font-mono">{{ localData.media.toFixed(1) }}</span>
                      </li>
                      <li>
                        {{ currentUser._id == room.mentor_id ? "A" : "Sua" }} maior nota foi em
                        <span class="m-0 font-semibold font-mono">{{ localData.maxNoteArea }}</span> com
                        <span class="m-0 font-semibold font-mono">{{ localData.maxNote.toFixed(1) }}%</span> de acerto
                      </li>
                      <li v-if="Number(localData.minNote) <= 99">
                        {{ currentUser._id == room.mentor_id ? "O" : "Seu" }} ponto de atenção foi em
                        <span class="m-0 font-semibold font-mono">{{ localData.minNoteArea }}</span> com
                        <span class="m-0 font-semibold font-mono">{{ localData.minNote.toFixed(1) }}%</span> de acerto
                      </li>
                    </ul>
                  </div>

                  <Disclosure v-slot="{ open }">
                    <DisclosureButton class="flex w-full justify-between mt-8">
                      <div class="text-body font-semibold">Detalhes</div>

                      <Icon
                        name="solar:alt-arrow-down-outline"
                        :class="open ? 'rotate-180 transform' : ''"
                        class="h-5 w-5 text-primary-500 transition"
                      />
                    </DisclosureButton>
                    <DisclosurePanel>
                      <div class="divide-y max-h-60 overflow-y-auto">
                        <div
                          v-for="(item, idx) in assessment"
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
                              v-if="item.points.i != null"
                              icon
                              size="tiny"
                              :color="
                                item.points.i != null && Number(item.points.i) === Number(item.value)
                                  ? 'linkError'
                                  : 'link'
                              "
                              class="!p-0.5"
                            >
                              <Icon size="1.75em" name="solar:close-square-line-duotone" />
                            </Button>
                            <Button
                              v-if="item.points.p != null"
                              icon
                              size="tiny"
                              :color="
                                item.points.p != null && Number(item.points.p) === Number(item.value)
                                  ? 'linkWarning'
                                  : 'link'
                              "
                              class="!p-0.5"
                            >
                              <Icon size="1.75em" name="solar:minus-square-line-duotone" />
                            </Button>
                            <Button
                              v-if="item.points.a != null"
                              icon
                              size="tiny"
                              :color="
                                item.points.a != null && Number(item.points.a) === Number(item.value)
                                  ? 'linkSuccess'
                                  : 'link'
                              "
                              class="!p-0.5"
                            >
                              <Icon size="1.75em" name="solar:check-square-line-duotone" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </DisclosurePanel>
                  </Disclosure>
                </div>

                <div class="mt-4 px-4 pb-4 flex items-center justify-center gap-3">
                  <Button to="/history" size="small" color="link" v-if="currentUser._id == room.user_id"
                    >Ver meus resultados</Button
                  >
                  <Button to="/" size="small">Voltar para o início</Button>
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </TransitionRoot>

    <!-- Imagens view -->
    <VueEasyLightbox
      :visible="expandImage"
      :imgs="imagesView"
      :index="imagesIndex"
      @hide="onHide"
      scrollDisabled
    ></VueEasyLightbox>
  </div>
</template>

<script setup>
import {
  Dialog,
  DialogPanel,
  TransitionChild,
  TransitionRoot,
  Popover,
  PopoverButton,
  PopoverPanel,
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
} from "@headlessui/vue";
import { useUserStore, useGlobalStore } from "~~/stores";
import VueEasyLightbox from "vue-easy-lightbox";
import "vue-easy-lightbox/external-css/vue-easy-lightbox.css";
import { push } from "notivue";
import dayjs from "dayjs";

definePageMeta({
  title: "Estação",
  hiddenSideBar: true,
});
useHead({
  title: "Estação",
});

const store = useUserStore();
const global = useGlobalStore();
const config = useRuntimeConfig();
const route = useRoute();
const router = useRouter();
const socket = useState("socket").value;

const show = ref(false);
const expandVideo = ref(false);
const currentUser = computed(() => store.currentUser);
const user = store.current;
const roomId = route?.params?.id;
const users = ref([]);

if (!roomId) {
  push.error("Informe uma sala para continuar ou crie uma");
  router.push("/activity");
}

await store.getAccessToken();

const { data: room } = await store.get(`users-stations/${roomId}`);

if (!room || room.finished_at) {
  push.error("Está sala não existe ou ela foi finalizada.");
  router.push("/activity");
}

const linkPage = ref(`https://web.stagemed.com.br/rooms/${room._id}`);
const { data: station } = await store.get(`stations/public/${room?.station_id}`);

const localData = ref({});
const isFinished = ref(false);
const localIsPrimary = ref(false);
const expandImage = ref(false);
const imagesView = ref(null);
const imagesIndex = ref(0);
const showImg = (index, images) => {
  if (typeof images == "string") imagesView.value = images;
  else {
    let galery = [];
    images.forEach((image) => {
      galery.push(image);
    });
    imagesView.value = galery;
  }

  imagesIndex.value = index;
  expandImage.value = true;
};
const onHide = () => (expandImage.value = false);

const assessment = ref(room.assessment.length > 0 ? room.assessment : station.assessment);

function setPoint(idx, value) {
  assessment.value[idx].value = value ? Number(value) : 0;
  socket.emit("sendAssessment", {
    roomId,
    content: assessment.value,
  });
  save({ assessment: assessment.value });
}

const isVisible = ref(new Array(station.clinicalCase.impresso.length).fill(false));
function controlVisible(idx, status) {
  isVisible.value[idx] = status;
  socket.emit("sendVisibles", {
    roomId,
    content: isVisible.value,
  });
}

const stateRoom = ref(room.state || "");

const message = ref("");
const messages = ref(room.messages || []);

socket.on("message", (data) => {
  messages.value.push(data);

  save({ messages: messages.value });
});
socket.on("roomUpdate", (data) => {
  users.value = data;
});
socket.on("finishStation", (data) => {
  localData.value = data.result;

  show.value = true;
  isFinished.value = true;
});

socket.on("stationStart", (data) => {
  let audio = new Audio("/audio/start.mp3");
  audio.play();

  stateRoom.value = "started";
});
socket.on("stationStop", (data) => {
  let audio = new Audio("/audio/stop.mp3");
  audio.play();

  stateRoom.value = "stoped";
});

socket.on("roomNotify", (data) => {
  push.info(data.text);
});
socket.on("updateAssessment", (data) => {
  assessment.value = data;
});
socket.on("updateCount", (data) => {
  seconds.value = data.seconds;
  minutes.value = data.minutes;
});
socket.on("updateVisibles", (data) => {
  isVisible.value = data;
});

function sendMessage(value, { resetForm }) {
  if (value.msg) {
    socket.emit("sendMessage", {
      roomId,
      content: {
        text: value.msg,
        user: user._id,
        time: dayjs().format("HH:mm"),
      },
    });

    message.value = "";
  }

  resetForm();
}

const minutes = ref(room.datas.time[0] || 0);
const seconds = ref(room.datas.time[1] || 0);

const interval = ref(null);
const loadingFinish = ref(false);

function start() {
  save({ started_at: new Date() });
  interval.value = setInterval(() => {
    seconds.value++;
    if (seconds.value >= 60) {
      seconds.value = 0;
      minutes.value++;
    }

    socket.emit("count", {
      roomId,
      content: {
        minutes: minutes.value,
        seconds: seconds.value,
      },
    });
    save({
      datas: {
        ...room.datas,
        time: [minutes.value, seconds.value],
      },
      state: "started",
    });
  }, 1000);

  socket.emit("stationStart", {
    name: roomId,
  });
}

function stop() {
  clearInterval(interval.value);
  save({ state: "stoped" });

  socket.emit("stationStop", {
    name: roomId,
  });
}

async function save(values) {
  await $fetch(`${config.public.apiBase}users-stations/${roomId}`, {
    method: "PATCH",
    body: values,
    headers: { Authorization: `Bearer ${store.accessToken}` },
  });
}

async function finishRoom() {
  let maxValue = {
    an: 0,
    ef: 0,
    lb: 0,
    im: 0,
    dg: 0,
    cd: 0,
  };
  let myValues = {
    an: 0,
    ef: 0,
    lb: 0,
    im: 0,
    dg: 0,
    cd: 0,
  };
  let result = {
    an: 0,
    ef: 0,
    lb: 0,
    im: 0,
    dg: 0,
    cd: 0,
  };

  assessment.value.forEach((item) => {
    maxValue[item.type] += Number(item.points.a);
    myValues[item.type] += Number(item.value);
  });

  let totalItem = 0;
  let totalPoint = 0;

  await Object.keys(result).forEach((key) => {
    if (maxValue[key] == 0) {
      delete maxValue[key];
      delete myValues[key];
      delete result[key];
    } else {
      result[key] = myValues[key] > 0 && Number(((myValues[key] / maxValue[key]) * 100).toFixed(2));

      totalItem += 1;
      totalPoint += result[key];
    }
  });

  let media = totalPoint / totalItem;

  let minNote = Math.min(...Object.values(result));
  let minNoteArea = global.options.types[Object.keys(result).find((key) => result[key] === minNote)];
  let maxNote = Math.max(...Object.values(result));
  let maxNoteArea = global.options.types[Object.keys(result).find((key) => result[key] === maxNote)];

  let calcResult = {
    maxValue,
    myValues,
    result,
    totalPoint,
    totalItem,
    media,

    minNote,
    minNoteArea,
    maxNote,
    maxNoteArea,

    time: [minutes.value, seconds.value],
  };

  await save({
    finished_at: new Date(),
    datas: calcResult,
    user_id: room.user_id,
    station_id: room.station_id,
    state: "fishied",
  });

  socket.emit("finishStation", {
    name: roomId,
    result: calcResult,
  });
}

onMounted(() => {
  socket.emit("joinRoom", {
    name: roomId,
    type: user._id == room.mentor_id ? "mentor" : "user",
    user: { startOn: new Date(), ..._Pick(user, "name", "pictureSmall", "_id") },
  });
});

onUnmounted(() => {
  socket.emit("leaftRoom", roomId);
});

onBeforeRouteLeave((to, from) => {
  if (!isFinished.value) {
    const answer = window.confirm("Voce deseja mesmo sair da sala?");
    if (!answer) return false;
  }
});
</script>

<style lang="scss">
.room-page {
  .title-section {
    @apply bg-primary-200;
  }
}

.audio-level-indicator {
  width: 200px;
  height: 20px;
  background-color: #f0f0f0;
  border-radius: 10px;
  overflow: hidden;
}

.audio-level-bar {
  height: 100%;
  background-color: #3cb371;
  transition: width 0.1s ease-out;
}

.card-chat {
  position: relative;
  &::before {
    content: "";
    @apply w-full h-4 bg-gradient-to-b from-white absolute;

    top: 0;
    left: 0;
    z-index: 10;
  }
}
</style>
