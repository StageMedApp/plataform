<template>
  <div class="courses-pagee">
    <div class="container">
      <div class="grid lg:grid-cols-3 gap-y-6 gap-x-7">
        <div class="w-full lg:col-span-2">
          <div class="w-full aspect-video rounded-2xl flex justify-center items-center">
            <VideoPlayer class="w-full aspect-video h-auto rounded-2xl overflow-hidden" :options="videoOptions" />
          </div>
          <div class="mb-10">
            <h2 class="text-md sm:text-xl md:text-2xl text-[#000000] font-medium">{{ course.name }}</h2>
            <div class="sm:flex items-start justify-between mt-3 space-y-3">
              <div class="flex flex-col gap-y-1 gap-x-4 flex-wrap">
                <p class="text-body-sm text-neutral tracking-wide flex items-center gap-1.5">
                  <Icon name="solar:folder-with-files-line-duotone" /> Aquivos - {{ course.files.length }}
                </p>
                <p class="text-body-sm text-neutral tracking-wide flex items-center gap-1.5">
                  <Icon name="solar:chat-square-check-line-duotone" /> Comentarios - {{ comments.length }}
                </p>
              </div>

              <div class="flex items-center gap-x-3 mb-5 sm:mb-0">
                <Badge v-for="tag in course.tags">{{ tag }}</Badge>
              </div>
            </div>
          </div>

          <Disclosure v-slot="{ open }" v-if="course.files.length >= 1">
            <DisclosureButton
              class="flex w-full justify-between rounded-2xl bg-primary-100 px-4 py-2 text-left text-sm font-medium text-primary-900 hover:bg-primary-200 focus:outline-none focus-visible:ring focus-visible:ring-primary-500 focus-visible:ring-opacity-75"
            >
              <span>Arquivos - {{ course.files.length }}</span>
              <Icon
                name="solar:alt-arrow-down-outline"
                :class="open ? 'rotate-180 transform' : ''"
                class="h-5 w-5 text-primary-500 transition"
              />
            </DisclosureButton>
            <DisclosurePanel class="px-4 pt-4 pb-2 text-sm text-neutral-500">
              <ul class="divide-y divide-neutral-200">
                <li class="pb-3 sm:pb-4" v-for="file in course.files" :key="file.name">
                  <div class="flex items-center space-x-4">
                    <div class="flex-1 min-w-0">
                      <p class="text-sm font-medium text-neutral-900 truncate">{{ file.name }}</p>
                    </div>
                    <Button icon color="link" size="small" @click="downloadFile(file.file, file.name)">
                      <Icon name="solar:download-square-line-duotone" size="20" />
                    </Button>
                  </div>
                </li>
              </ul>
            </DisclosurePanel>
          </Disclosure>
        </div>

        <div class="flex flex-col">
          <div class="flex justify-between items-center mb-4">
            <h2 class="text-lg lg:text-2xl font-bold text-neutral-900">Comentários ({{ comments.length }})</h2>
          </div>

          <Form @submit="sendComment" :validation-schema="schema" class="mb-6" autocomplete="off">
            <FieldInput name="target_id" :value="courseId" class="hidden" />
            <FieldInput name="user_id" :value="currentUser._id" class="hidden" />
            <FieldInput name="name" :value="currentUser.name" class="hidden" />
            <FieldInput name="picture" :value="currentUser.picture" class="hidden" />
            <FieldTextarea name="comment" class="grow" label="Seu comentario" placeholder="Seu comentario aqui...." />
            <div class="flex justify-end mt-2">
              <Button size="small"> Comentar </Button>
            </div>
          </Form>

          <div class="load-content" v-if="loadingComments"></div>

          <div class="p-3 mb-6 text-base bg-white rounded-2xl" v-for="comm in comments" :key="comm._id">
            <div class="flex justify-start items-center mb-2">
              <p class="inline-flex items-center mr-3 text-sm text-neutral-900 grow">
                <img class="mr-2 w-6 h-6 rounded-full" :src="comm.picture" alt="Michael Gough" />{{ comm.name }}
              </p>
              <p class="text-sm text-neutral-600">{{ dayjs(comm.created_at).format("DD/MM/YYYY") }}</p>
            </div>
            <p class="text-neutral-500">
              {{ comm.comment }}
            </p>
            <div v-if="comm.reply">
              <p class="pl-6 mt-4 text-neutral-900 font-semibold">Resposta</p>
              <p class="pl-6 text-neutral-500">
                {{ comm.reply?.text }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { Disclosure, DisclosureButton, DisclosurePanel } from "@headlessui/vue";
import { useUserStore } from "~~/stores";
import dayjs from "dayjs";
import "dayjs/locale/pt-br";
import relativeTime from "dayjs/plugin/relativeTime";
import * as yup from "yup";
import { push } from "notivue";

dayjs.extend(relativeTime);
dayjs.locale("pt-br");

const store = useUserStore();
const config = useRuntimeConfig();
const route = useRoute();
const currentUser = computed(() => store.currentUser);

const courseId = route?.params?.id;

const schema = yup.object({
  comment: yup.string().required("Este campo deve ser preenchido"),
});

const comments = ref([]);
const loadingComments = ref(true);

const { data: course } = await store.get(`courses/${courseId}`);

const videoOptions = {
  autoplay: false,
  controls: true,
  poster: course.cover,
  sources: [
    {
      src: course.video,
    },
  ],
};

function getDayRelative(date) {
  return dayjs().to(dayjs(date));
}

function sendComment(value, { resetForm }) {
  store
    .post("comments", value)
    .then((result) => {
      resetForm();
      loadComments();
      push.success("Comentario enviado");
    })
    .catch((err) => {
      push.error("Erro ao enviar comentario");
    });
}

async function loadComments() {
  let { data } = await store.get(`comments/${course._id}`);

  comments.value = data;
}

onMounted(async () => {
  await loadComments();

  loadingComments.value = false;
});

async function downloadFile(downloadUrl, fileName) {
  let ext = downloadUrl.split("?")[0].split("--")[1].split(".")[1];

  fileName = fileName + "." + ext;

  fetch(downloadUrl, { method: "get", mode: "no-cors", referrerPolicy: "no-referrer" })
    .then((res) => res.blob())
    .then((res) => {
      const aElement = document.createElement("a");
      aElement.setAttribute("download", fileName);
      const href = URL.createObjectURL(res);
      aElement.href = href;
      aElement.setAttribute("target", "_blank");
      aElement.click();
      URL.revokeObjectURL(href);
    });
}
</script>
