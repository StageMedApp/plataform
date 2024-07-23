<template>
  <div class="room-page">
    <div class="max-w-[1440px] mx-auto px-4">
      <div class="card-sm">
        <div class="flex felx-col gap-4 items-center justify-between">
          <Button block size="small" @click="start"> Iniciar</Button>
          <Button block size="small" @click="stop"> Finalizar</Button>
          <div class="grow flex flex-nowrap gap-1 justify-center items-center">
            <Icon name="solar:clock-circle-bold-duotone" />
            <span class="d-countdown font-mono text-body">
              <span :style="`--value: ${minutes}`"></span>:<span :style="`--value: ${seconds}`"></span>
            </span>
          </div>
        </div>

        <div class="mt-2">
          <div v-for="u in users" :key="u.name">
            {{ u.name }}
          </div>
        </div>
      </div>

      <div class="mt-1 text-body-sm flex items-center gap-2">
        Código da sala - {{ route?.params?.id }}
        <Button icon size="tiny" color="link" @click="global.copyToClipboard(adtional.identificationField)"
          ><Icon name="solar:copy-line-duotone"
        /></Button>
      </div>

      <!-- Chat video -->
      <div class="card-sm !p-0 mt-2 relative overflow-hidden mb-2">
        <div class="w-full aspect-video bg-neutral-300">
          <video ref="remoteVideo" class="z-10" autoplay></video>
        </div>
        <div
          v-show="isCameraOn"
          class="w-4/12 aspect-video bg-neutral-400 absolute top-0.5 right-0.5 rounded-md opacity-80 overflow-hidden"
        >
          <video ref="localVideo" class="z-10" autoplay></video>
        </div>

        <div class="flex items-center justify-center gap-1 absolute bottom-1 left-0 w-full opacity-60 z-10">
          <Button icon :color="isCameraOn ? 'primary' : 'secndary'" class="!shrink-0" size="tiny" @click="toggleCamera"
            ><Icon name="solar:videocamera-record-line-duotone" />
          </Button>
          <Button
            icon
            :color="isMicrophoneOn ? 'primary' : 'secndary'"
            class="!shrink-0"
            size="tiny"
            @click="toggleMicrophone"
            ><Icon name="solar:microphone-3-line-duotone" />
          </Button>
        </div>
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
</template>

<script setup>
import { Disclosure, DisclosureButton, DisclosurePanel } from "@headlessui/vue";
import { useUserStore, useGlobalStore } from "~~/stores";

import dayjs from "dayjs";

definePageMeta({
  title: "Estação",
  hiddenSideBar: true,
});
useHead({
  title: "Início",
});

const store = useUserStore();
const global = useGlobalStore();
const config = useRuntimeConfig();
const route = useRoute();
const router = useRouter();
const socket = useState("socket").value;

const currentUser = computed(() => store.currentUser);
const user = store.current;
const roomId = "testeRoom";
const users = ref([{ name: user.name, picture: user.picture }]);

await store.getAccessToken();

const message = ref("");
const messages = ref([]);

onMounted(() => {
  socket.emit("joinRoom", {
    name: roomId,
    type: "user",
    user: _Pick(user, "name", "pictureSmall", "_id"),
  });

  const mediaConstraints = { video: true, audio: true };

  navigator.mediaDevices
    .getUserMedia(mediaConstraints)
    .then((stream) => {
      localVideo.value.srcObject = stream;
      localStream = stream;
    })
    .catch((error) => {
      console.error("Erro ao acessar a câmera/áudio:", error);
    });

  socket.on("offer", handleOffer);
  socket.on("answer", handleAnswer);
  socket.on("ice-candidate", handleIceCandidate);

  startCall;
});

socket.on("message", (data) => {
  messages.value.push(data);
});

socket.on("updateAssessment", (data) => {
  assessment.value = data;
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

const minutes = ref(0);
const seconds = ref(0);

var interval = null;
const count = ref(false);

function start() {
  count.value = true;
  interval = setInterval(() => {
    seconds.value++;
    if (seconds.value >= 60) {
      seconds.value = 0;
      minutes.value++;
    }
  }, 1000);
}

function stop() {
  clearInterval(interval);
  count.value = "finish";

  calc;
}

function calc() {
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

  Object.keys(result).forEach((key) => {
    if (maxValue[key] == 0) {
      delete maxValue[key];
      delete myValues[key];
      delete result[key];
    } else result[key] = myValues[key] > 0 && Number(((myValues[key] / maxValue[key]) * 100).toFixed(2));
  });
}

/////////////////////////////////////////////////////*css*/`
const localVideo = ref(null);
const remoteVideo = ref(null);

let localStream = null;
let peerConnection = null;

const startCall = async () => {
  // Configuração da conexão do Peer
  peerConnection = new RTCPeerConnection();

  // Adicionar as faixas do stream local à conexão Peer
  localStream.getTracks().forEach((track) => {
    peerConnection.addTrack(track, localStream);
  });

  // Configurar manipuladores de eventos para a conexão Peer
  peerConnection.onicecandidate = handleIceCandidateEvent;
  peerConnection.ontrack = handleTrackEvent;

  // Criar uma oferta
  const offer = await peerConnection.createOffer();
  await peerConnection.setLocalDescription(offer);

  // Enviar a oferta para o servidor

  socket.emit("offer", {
    roomId,
    offer,
  });
};

const endCall = () => {
  if (peerConnection) {
    peerConnection.close();
    peerConnection = null;
  }

  if (localStream) {
    localStream.getTracks().forEach((track) => track.stop());
    localStream = null;
  }

  localVideo.value.srcObject = null;
  remoteVideo.value.srcObject = null;
};

const handleOffer = async (offer) => {
  // Configurar a conexão Peer para o usuário remoto
  peerConnection = new RTCPeerConnection();

  // Adicionar as faixas do stream local à conexão Peer
  localStream.getTracks().forEach((track) => {
    peerConnection.addTrack(track, localStream);
  });

  // Configurar manipuladores de eventos para a conexão Peer
  peerConnection.onicecandidate = handleIceCandidateEvent;
  peerConnection.ontrack = handleTrackEvent;

  // Definir a oferta remota e criar uma resposta
  await peerConnection.setRemoteDescription(offer);
  const answer = await peerConnection.createAnswer();
  await peerConnection.setLocalDescription(answer);

  // Enviar a resposta para o outro usuário via Socket.IO
  socket.emit("answer", { roomId, answer });
};

const handleAnswer = async (answer) => {
  // Definir a resposta remota
  await peerConnection.setRemoteDescription(answer);
};

const handleIceCandidateEvent = (event) => {
  // Enviar o candidato ICE para o outro usuário via Socket.IO
  if (event.candidate) {
    socket.emit("ice-candidate", { roomId, candidate: event.candidate });
  }
};

const handleIceCandidate = (candidate) => {
  // Adicionar o candidato ICE recebido à conexão Peer
  peerConnection.addIceCandidate(candidate);
};

const handleTrackEvent = (event) => {
  // Exibir o fluxo de vídeo remoto no elemento de vídeo remoto
  remoteVideo.value.srcObject = event.streams[0];
};

const isCameraOn = ref(false);
const isMicrophoneOn = ref(false);

const toggleCamera = () => {
  const videoTrack = localStream.getVideoTracks()[0];
  videoTrack.enabled = !videoTrack.enabled;
  isCameraOn.value = videoTrack.enabled;
};

const toggleMicrophone = () => {
  const audioTrack = localStream.getAudioTracks()[0];
  audioTrack.enabled = !audioTrack.enabled;
  isMicrophoneOn.value = audioTrack.enabled;
};
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

.chat {
  @apply flex flex-col gap-1 items-start;

  .chat-bubble {
    @apply text-sm py-1 px-2 text-neutral-800 bg-primary-100 rounded-md max-w-[85%] rounded-bl-none relative flex flex-col items-stretch;
  }
  &.chat-end {
    @apply items-end;
    .chat-bubble {
      @apply rounded-bl-md rounded-br-none bg-primary-500 text-neutral-50;
    }
    .chat-time {
      @apply text-neutral-200;
    }
  }
  .chat-time {
    @apply text-2xs text-neutral-400 text-right;
  }
}
</style>
