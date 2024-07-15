<template>
  <div class="courses-page">
    <!-- component -->
    <div class="flex antialiased text-neutral-800 -mt-10 -mb-8 full-page">
      <div class="flex flex-row w-full h-[calc(100vh_-_64px)]">
        <div class="flex-col w-full md:w-80 bg-white flex-shrink-0 h-full" :class="chatId ? 'hidden md:flex' : 'flex '">
          <div class="flex items-center justify-between gap-4 p-3 border-b border-neutral-200">
            <div class="relative flex items-center space-x-4">
              <div class="relative shrink-0">
                <span class="absolute bg-green-500 right-0 top-0 z-10 h-3 aspect-square rounded-full"> </span>
                <img :src="currentUser.picture" class="w-10 aspect-square object-cover rounded-full" />
              </div>
              <div class="flex flex-col leading-tight">
                <div class="text-lg text-neutral-900 mr-3 font-semibold truncate">Conversas</div>
                <span class="text-body-sm text-neutral-400">Online</span>
              </div>
            </div>
            <Button
              icon
              size="small"
              color="link"
              class="!p-1"
              @click="
                show = true;
                search();
              "
            >
              <Icon name="solar:add-circle-line-duotone" size="24" />
            </Button>
          </div>
          <div class="flex flex-col space-y-1 p-4 grow overflow-y-auto">
            <div
              class="cursor-pointer flex flex-row items-start hover:bg-neutral-100 rounded-xl p-2"
              @click="
                selectChat(chat.chatId, true);
                show = false;
              "
              v-for="chat in chats"
            >
              <div class="relative shrink-0">
                <span
                  v-if="
                    usersOnline.includes(chat.users[0]._id != currentUser._id ? chat.users[0]._id : chat.users[1]._id)
                  "
                  class="absolute bg-green-500 right-0 top-0 z-10 h-2 aspect-square rounded-full"
                >
                </span>
                <img
                  :src="chat.users[0]._id != currentUser._id ? chat.users[0].picture : chat.users[1].picture"
                  class="w-8 aspect-square object-cover rounded-full"
                />
              </div>
              <div class="grid grow">
                <div class="flex flex-row items-center justify-between">
                  <div class="ml-2 text-body-sm font-semibold">
                    {{ chat.users[0]._id != currentUser._id ? chat.users[0].name : chat.users[1].name }}
                  </div>
                  <div class="ml-2 text-2xs text-neutral-400" v-if="chat.lastMsgTime && chat.lastMsg">
                    {{ dayjs(chat.lastMsgTime.toDate()).format("HH:mm") }}
                  </div>
                </div>
                <div class="ml-2 text-xs text-neutral-600 flex items-center gap-2 overflow-hidden">
                  <span class="truncate grow">
                    {{ chat.lastMsg }}
                  </span>
                  <Badge v-if="pinsChat.chats && pinsChat.chats[chat.chatId]" size="small" color="primaryDark">
                    {{ pinsChat.chats[chat.chatId] }}</Badge
                  >
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="flex-1 justify-between flex h-full flex-col">
          <!-- Null  chat-->
          <div
            class="grow flex flex-col justify-center items-center space-y-4 p-3 overflow-y-auto scrollbar-thumb-primary scrollbar-thumb-rounded scrollbar-track-primary-lighter scrollbar-w-2 scrolling-touch"
            v-if="!chatId"
          >
            <div class="load-content" v-if="loadMsg"></div>
            <div v-if="messages.length <= 0 && !loadMsg">
              <CardEmpty
                type="message"
                title="Abra uma conversa para continuar"
                desc="Inicie uma conversa apertando em '+' na aba lateral, ou escolha um conversa para exibir"
              />
            </div>
          </div>

          <!-- Chat header curretne chat -->
          <div v-if="chatId" class="flex items-center justify-start gap-4 p-3 border-b border-neutral-200">
            <Button to="/chats" icon size="small" color="link" class="md:hidden p-1">
              <Icon name="solar:arrow-left-line-duotone" size="20" />
            </Button>

            <div class="loads" v-if="!currentChat.id">Carregando...</div>

            <div v-if="currentChat.id" class="grow relative flex items-center space-x-4">
              <div class="relative shrink-0">
                <span
                  v-if="
                    usersOnline.includes(
                      currentChat.users[0]._id != currentUser._id ? currentChat.users[0]._id : currentChat.users[1]._id
                    )
                  "
                  class="absolute bg-green-500 right-0 top-0 z-10 h-3 aspect-square rounded-full"
                >
                </span>
                <img
                  :src="
                    currentChat.users[0]._id != currentUser._id
                      ? currentChat.users[0].picture
                      : currentChat.users[1].picture
                  "
                  class="w-10 aspect-square object-cover rounded-full"
                />
              </div>
              <div class="grow flex flex-col leading-tight">
                <div class="text-lg text-neutral-900 mr-3 font-semibold">
                  {{
                    currentChat.users[0]._id != currentUser._id ? currentChat.users[0].name : currentChat.users[1].name
                  }}
                </div>
                <span class="text-body-sm text-neutral-600">
                  {{
                    usersOnline.includes(
                      currentChat.users[0]._id != currentUser._id ? currentChat.users[0]._id : currentChat.users[1]._id
                    )
                      ? "Online"
                      : "Offline"
                  }}
                </span>
              </div>

              <Button @click="showConfirmeDelete = true" icon size="small" color="linkError" class="p-1">
                <Icon name="solar:trash-bin-minimalistic-line-duotone" size="20" />
              </Button>
            </div>
          </div>

          <!-- Chat no message -->
          <div
            class="grow flex flex-col justify-center items-center space-y-4 p-3 overflow-y-auto scrollbar-thumb-primary scrollbar-thumb-rounded scrollbar-track-primary-lighter scrollbar-w-2 scrolling-touch"
            v-if="chatId && (loadMsg || messages.length <= 0)"
          >
            <div class="load-content" v-if="loadMsg"></div>
            <div v-if="messages.length <= 0 && !loadMsg">
              <CardEmpty type="message" />
            </div>
          </div>

          <!-- Chat messages view -->
          <div
            v-if="chatId && !loadMsg && messages.length >= 1"
            id="messages"
            class="grow flex flex-col space-y-4 p-3 overflow-y-auto scrollbar-thumb-primary scrollbar-thumb-rounded scrollbar-track-primary-lighter scrollbar-w-2 scrolling-touch"
          >
            <div class="chat" :class="[msg.sender == currentUser._id && 'chat-end']" v-for="msg in messages">
              <div class="chat-bubble">
                <time class="chat-time">{{ dayjs(msg.timestamp.toDate()).format("HH:mm") }}</time> {{ msg.text }}
              </div>
            </div>
          </div>

          <!-- Chat sender -->
          <div v-if="chatId" class="border-t border-neutral-200 p-4 w-full">
            <div class="relative flex">
              <input
                type="text"
                placeholder="Sua mensagem"
                class="w-full focus:outline-none focus:placeholder-neutral-400 text-neutral-600 placeholder-neutral-600 pl-4 bg-neutral-200 rounded-md py-3"
                v-model="newMessage"
                @keyup.enter="sendMessage"
                autocomplete="off"
              />
              <div class="absolute right-0 items-center inset-y-0 flex">
                <button
                  type="button"
                  class="inline-flex items-center justify-center gap-2 rounded-lg px-4 py-3 transition duration-500 ease-in-out text-white bg-primary-500 hover:bg-primary-400 focus:outline-none"
                  @click="sendMessage"
                >
                  <span class="font-bold">Enviar</span>
                  <Icon name="solar:plain-bold-duotone" size="20" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <ModalError
      :show="showConfirmeDelete"
      confirm="Excluir"
      @close="showConfirmeDelete = false"
      @accept="deleteChat"
      title="Excluir conversa?"
      description="Deseja mesmo excluir essa conversa? Está ação é irreversivel e você não poderá ver novamente essa conversa"
    />

    <!-- Modal all stations -->
    <TransitionRoot as="template" :show="show">
      <Dialog as="div" class="relative z-10" @close="closeModal">
        <TransitionChild
          as="template"
          enter="ease-out duration-300"
          enter-from="opacity-0"
          enter-to="opacity-100"
          leave="ease-in duration-200"
          leave-from="opacity-100"
          leave-to="opacity-0"
        >
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
              <DialogPanel
                class="relative transform overflow-hidden rounded-lg bg-card text-left shadow-xl transition-all w-full sm:max-w-lg max-h-[80vh] flex flex-col"
              >
                <div class="p-4">
                  <div class="flex items-center justify-between gap-4">
                    <div class="text-base font-semibold leading-6 text-gray-900">
                      <h3>Nova conversa</h3>
                    </div>

                    <div class="flex gap-2 items-center justify-end">
                      <Button icon color="link" size="tiny" class="!p-1" @click="search()">
                        <Icon name="solar:refresh-line-duotone" size="20" />
                      </Button>
                      <Button icon color="link" size="tiny" class="!p-1" @click="closeModal">
                        <Icon name="solar:close-circle-line-duotone" size="20" />
                      </Button>
                    </div>
                  </div>
                </div>

                <div class="px-4 relative">
                  <FieldInput
                    name="search"
                    @keyup.enter="search"
                    v-model="querySearch"
                    hidden-label
                    placeholder="Busque por nome ou email"
                  />

                  <Button icon color="link" size="tiny" class="!absolute top-1 right-5" @click="search">
                    <Icon name="solar:minimalistic-magnifer-line-duotone" size="20" />
                  </Button>
                </div>

                <div class="load-content" v-if="resultsLoading"></div>

                <div v-if="results.length <= 0 && !resultsLoading">
                  <CardEmpty type="search" desc="Pesquise por outro nome ou email" title="Sem resultados" />
                </div>

                <div
                  v-if="results.length > 0 && !resultsLoading"
                  class="mt-4 px-4 pb-4 overflow-y-auto overflow-x-hidden grow"
                >
                  <div v-for="u in results" :key="u._id">
                    <div
                      class="flex flex-row items-center hover:bg-neutral-100 rounded-xl p-2 cursor-pointer"
                      @click="createNewChat(u)"
                      v-if="currentUser._id != u._id"
                    >
                      <div class="relative shrink-0">
                        <span
                          v-if="u.status == 'online'"
                          class="absolute bg-green-500 right-0 top-0 z-10 h-2 aspect-square rounded-full"
                        >
                        </span>
                        <img :src="u.picture" class="w-8 aspect-square object-cover rounded-full" />
                      </div>
                      <div class="grow ml-2 text-body-sm font-semibold">{{ u.name }}</div>
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
import { Dialog, DialogPanel, TransitionChild, TransitionRoot } from "@headlessui/vue";
import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
  addDoc,
  getDocs,
  doc,
  setDoc,
  deleteDoc,
} from "firebase/firestore";
import { getStorage, ref as storageRef, getDownloadURL } from "firebase/storage";

import { useUserStore } from "~~/stores";

import dayjs from "dayjs";
import "dayjs/locale/pt-br";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);
dayjs.locale("pt-br");

definePageMeta({
  title: "Conversas",
  hiddenFooter: true,
});
useHead({
  title: "Conversas",
});

const store = useUserStore();
const config = useRuntimeConfig();
const currentUser = computed(() => store.currentUser);
const socket = useState("socket").value;

const pinsChat = computed(() => store.getNotificationsChat);

const db = useState("db").value;
const chatRef = collection(db, "chats");
const msgRef = collection(db, "messages");

const show = ref(false);
const showConfirmeDelete = ref(false);
const loadingUsers = ref(false);
const loadMsg = ref(false);

const usersChat = ref([]);

const user = {
  _id: store.current._id, // Substitua pelo ID do usuário autenticado
  name: store.current.name, // Substitua pelo nome do usuário autenticado
  picture: store.current.picture, // Substitua pela URL da imagem do usuário
};
const chats = ref([]);
const messages = ref([]);
const newMessage = ref("");
const currentChat = ref({});

const router = useRouter();
const route = useRoute();
const chatId = route.params.slug[0] || "";

const { data: usersOnline, refresh: usersOnlineRefresh } = await useAsyncData(`usersOnlineList`, () =>
  $fetch(`${config.public.apiBase}users/online`, {
    headers: { Authorization: `Bearer ${store.accessToken}` },
  })
);

var timeoutRefresh = null;
var chatsLoadSub = null;
onMounted(() => {
  usersOnlineRefresh();

  timeoutRefresh = setInterval(async () => {
    usersOnlineRefresh();
  }, 2000);

  const q = query(chatRef, where("usersId", "array-contains", user._id), orderBy("lastMsgTime"));
  console.log(q);

  chatsLoadSub = onSnapshot(q, (querySnapshot) => {
    chats.value = [];
    console.log;
    querySnapshot.forEach((doc) => {
      let data = doc.data();
      chats.value.push(data);
    });
  });

  if (chatId) {
    selectChat(chatId);
  }
});

onUnmounted(() => {
  clearTimeout(timeoutRefresh);
  chatsLoadSub();
  // curretnChats();
});

function areIdsInSameChat(chatData, userId1, userId2) {
  for (const chat of chatData) {
    if (chat.usersId.includes(userId1) && chat.usersId.includes(userId2)) {
      return chat.chatId;
    }
  }
  return null;
}

const createNewChat = async (participant) => {
  let newID = generateUniqueId();
  const hasChat = areIdsInSameChat(chats.value, user._id, participant._id);

  let chatU = user;
  let chatP = participant;

  chatU.picture = `https://firebasestorage.googleapis.com/v0/b/stagemed-br.appspot.com/o/${chatU._id}%2Fpicture--medium?alt=media`;
  chatP.picture = `https://firebasestorage.googleapis.com/v0/b/stagemed-br.appspot.com/o/${chatP._id}%2Fpicture--medium?alt=media`;

  if (!hasChat) {
    await addDoc(chatRef, {
      chatId: newID,
      users: [chatU, chatP],
      usersId: [chatU._id, chatP._id],
      lastMsgTime: new Date(),
    });

    socket.emit("sendNotification", {
      user_id: chatP._id,
      from_id: currentUser.value._id,
      from_name: currentUser.value.name,
      picture: currentUser.value.picture,
      type: "chat",
      chatId: newID,
      body: {
        title: "Nova conversa",
        content: `${currentUser.value.name} iniciou uma nova conversa com você`,
      },
    });
  }

  closeModal();

  if (hasChat) selectChat(hasChat);
  else selectChat(newID);
};

const generateUniqueId = () => {
  return Math.random().toString(36);
};

const sendMessage = async () => {
  if (!newMessage.value || newMessage.value.trim() === "") return;

  try {
    let userId =
      currentChat.value.users[0]._id != currentUser.value._id
        ? currentChat.value.users[0]._id
        : currentChat.value.users[1]._id;

    await addDoc(msgRef, {
      chatId: chatId,
      sender: user._id,
      text: newMessage.value,
      timestamp: new Date(),
    });

    const chatDocRef = doc(db, "chats", currentChat.value.id);
    await setDoc(
      chatDocRef,
      {
        lastMsgTime: new Date(),
        lastMsg: newMessage.value,
      },
      { merge: true }
    );

    store.get(`users/chats/new/${userId}/${chatId}`);

    socket.emit("sendNotification", {
      user_id:
        currentChat.value.usersId[0] != currentUser.value._id
          ? currentChat.value.usersId[0]
          : currentChat.value.usersId[1],
      from_id: currentUser.value._id,
      from_name: currentUser.value.name,
      picture: currentUser.value.picture,
      type: "chat",
      newMessage: true,
      chatId: chatId,
      body: {
        title: "Nova mensagem",
        content: `${currentUser.value.name} enviou uma nova mensagem para você`,
      },
    });

    newMessage.value = "";
  } catch (error) {
    console.error("Erro ao enviar mensagem:", error);
  }
};

async function deleteChat() {
  await deleteDoc(doc(db, "chats", currentChat.value.id));

  //const chatDocRef = doc(db, "chats", currentChat.value.id);
  //await setDoc(
  //  chatDocRef,
  //  {
  //    users: currentChat.value.usersId.filter((u) => u !== currentUser.value._id),
  //  },
  //  { merge: true }
  //);

  showConfirmeDelete.value = false;
  router.push("/chats");
}

async function selectChat(id, refreshPage = false) {
  loadMsg.value = true;

  store.get(`users/chats/view/${currentUser.value._id}/${id}`);

  const chatQ = query(chatRef, where("chatId", "==", id));
  const chatLoad = await getDocs(chatQ);
  chatLoad.forEach((doc) => {
    currentChat.value = { ...doc.data(), id: doc.id };
  });

  const messageQ = query(collection(db, "messages"), where("chatId", "==", chatId), orderBy("timestamp"));
  const curretnChats = onSnapshot(messageQ, (querySnapshot) => {
    messages.value = [];
    querySnapshot.forEach((doc) => {
      messages.value.push(doc.data());
    });
    loadMsg.value = false;
  });

  if (route.path == "/chats" || refreshPage) router.push(`/chats/${id}`);
}

async function getAllUsers() {
  loadingUsers.value = true;

  var { data: users } = await store.get(`users/my/search`);
  usersChat.value = users;

  loadingUsers.value = false;
}

var timeoutSearch = null;

const querySearch = ref(" ");
const resultsLoading = ref(false);
const results = ref([]);

async function search() {
  resultsLoading.value = true;
  let value = querySearch.value;

  clearTimeout(timeoutSearch);
  timeoutSearch = setTimeout(async () => {
    const api = `${config.public.apiBase}users/public/search?q=${encodeURI(value)}`;
    const { data } = await useFetch(api);

    results.value = data.value;
    resultsLoading.value = false;
  }, 450);
}

// Function Aux
function closeModal() {
  show.value = false;
}
function getDayRelative(date) {
  return dayjs().to(dayjs(date));
}
function scrollChat() {
  //  const el = document.getElementById("messages");
  //  el.scrollTop = el.scrollHeight;
}
</script>

<style></style>
