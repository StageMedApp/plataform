<template>
  <div class="profile-page">
    <div class="container">
      <div class="card">
        <div class="flex flex-col md:flex-row gap-2 justify-between">
          <div class="flex gap-6 flex-row items-center">
            <div class="relative w-20 shrink-0">
              <div class="relative h-20 w-20 aspect-square rounded-full overflow-hidden">
                <img loading="lazy" :src="currentUser.pictureMedium" :alt="currentUser.name" />
              </div>

              <div class="w-full mx-auto absolute -bottom-1">
                <UploadImage mode="profileButonTiny" @save-crop="uploadPicture" :loading="pictureLoad" />
              </div>
            </div>

            <div>
              <div class="text-neutral-900 text-left relative" style="font: var(--heading-4-semibold, 600 20px 'Plus Jakarta Sans', sans-serif)">Olá, {{ currentUser.name }}!</div>
              <div class="text-neutral-600 text-left relative" style="font: var(--body-small-regular, 400 14px/21px 'Plus Jakarta Sans', sans-serif)">
                {{ currentUser.tags ? currentUser.tags[0] : currentUser.email }}
              </div>
            </div>
          </div>

          <div class="flex flex-row gap-2 justify-end items-start">
            <Button color="rounded" size="small" @click="profileEdit = true"> Editar perfil </Button>
          </div>
        </div>
      </div>

      <div class="card mt-6" v-show="profileEdit">
        <Form @submit="profileSave" :validation-schema="profileSchema" :initial-values="profileValues" id="profile" :class="{ disabled: !profileEdit }">
          <div class="card-head">
            <h3 class="title title--card-sm">Meu Perfil</h3>
          </div>
          <div class="grid grid-cols-6 gap-4 mb-6">
            <FieldInput class="col-span-6" name="name" label="Nome completo" type="text" placeholder="Digite o seu nome completo" />

            <FieldSelect label="Sexo" class="col-span-3" name="gender" type="text" placeholder="Selecione" :options="genders" autocomplete="sex" />
            <FieldInput label="Data de nascimento" class="col-span-3" name="birthDay" type="date" />
            <FieldInput label="CPF/CNPJ" mask="['###.###.###-##', '##.###.###/####-##']" class="col-span-3" name="document" type="text" placeholder="Digite seu CPF ou CNPJ" />
            <FieldInput label="Número de telefone" mask="(##) 9####-####" class="col-span-3" name="phone" type="text" placeholder="Digite seu número de telefone" />

            <FieldInput class="col-span-6" name="tags[0]" label="Área de atuação" type="text" placeholder="Digite o sua area de atuação" />
          </div>

          <div class="line-options">
            <Button tag="div" class="!px-10" size="small">Salvar</Button>
            <Button color="link" size="small" @click="profileEdit = false">Cancelar</Button>
          </div>
        </Form>
      </div>

      <div class="card mt-6">
        <div class="card-head !mb-1">
          <h3 class="title title--card-sm">Meus seguidores</h3>
          <div class="inline-flex items-center justify-center gap-3">
            <Button icon size="small" color="link" :disabled="pageFollow == 1" @click="papageFollowge -= 1">
              <Icon name="solar:alt-arrow-left-linear" size="16" />
            </Button>

            <Button icon size="small" :disabled="usersFollow.length < 50" color="link" @click="pageFollow += 1">
              <Icon name="solar:alt-arrow-right-linear" size="16" />
            </Button>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div v-for="user in usersFollow" class="py-3 flex gap-2 items-center justify-start">
            <div class="relative shrink-0">
              <span v-if="user.status == 'online'" class="absolute bg-green-500 right-0 top-0 z-10 h-2 aspect-square rounded-full"> </span>
              <img class="w-12 h-12 rounded-full shrink-0" :src="user.picture" />
            </div>
            <div class="flex flex-col gap-0 items-start justify-start grow">
              <div class="text-neutral-800" style="font: 400 15px 'SF Pro Text', sans-serif">{{ user.name }}</div>
              <div class="text-neutral" style="font: 300 15px 'SF Pro Text', sans-serif" v-if="user.tags && user.tags[0]">{{ user.tags[0] }}</div>
            </div>

            <Button v-if="!currentUser.followingAwait.includes(user._id) && !currentUser.following.includes(user._id)" size="tiny" color="secondary" class="!rounded-full" @click="follow(user._id)">
              Seguir de volta
            </Button>
            <Badge v-if="currentUser.followingAwait.includes(user._id)" class="!rounded-full"> Solicitado <Icon name="solar:clock-circle-line-duotone" size="14" /> </Badge>

            <Button size="tiny" color="linkError" class="!rounded-full" icon @click="unfollow(user._id, true)">
              <Icon name="solar:close-circle-line-duotone" size="16" />
            </Button>
          </div>
        </div>

        <div class="card-head mt-6 !mb-1">
          <h3 class="title title--card-sm">Quem eu sigo</h3>
          <div class="inline-flex items-center justify-center gap-3">
            <Button icon size="small" color="link" :disabled="pageFollowing == 1" @click="pageFollowing -= 1">
              <Icon name="solar:alt-arrow-left-linear" size="16" />
            </Button>

            <Button icon size="small" :disabled="usersFollowing.length < 50" color="link" @click="pageFollowing += 1">
              <Icon name="solar:alt-arrow-right-linear" size="16" />
            </Button>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div v-for="user in usersFollowing" class="py-3 flex gap-2 items-center justify-start">
            <div class="relative shrink-0">
              <span v-if="user.status == 'online'" class="absolute bg-green-500 right-0 top-0 z-10 h-2 aspect-square rounded-full"> </span>
              <img class="w-12 h-12 rounded-full shrink-0" :src="user.picture" />
            </div>
            <div class="flex flex-col gap-0 items-start justify-start grow">
              <div class="text-neutral-800" style="font: 400 15px 'SF Pro Text', sans-serif">{{ user.name }}</div>
              <div class="text-neutral" style="font: 300 15px 'SF Pro Text', sans-serif" v-if="user.tags && user.tags[0]">{{ user.tags[0] }}</div>
            </div>

            <Button size="tiny" color="secondaryError" class="!rounded-full" @click="follow(user._id)"> Deixar de seguir </Button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref as refStorage, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { useUserStore } from "~~/stores";
import { Form } from "vee-validate";
import * as yup from "yup";
import { unmask } from "~~/helpers/mask";

definePageMeta({
  title: "Editar perfil",
});
useHead({
  title: "Editar perfil",
});

const Toast = useState("toast").value;
const config = useRuntimeConfig();
const storage = useState("storage").value;

const store = useUserStore();

const currentUser = computed(() => store.currentUser);
const user = store.current;

const genders = [
  { value: "male", label: "Masculino" },
  { value: "female", label: "Feminino" },
  { value: "not_inform", label: "Prefiro não informar" },
  { value: "other", label: "Outros" },
];

const pageFollow = ref(1);
const pageFollowing = ref(1);
const loadingsId = ref([]);

var { data: usersFollow, refresh: refreshFollow } = await useAsyncData(
  `usersFollow`,
  () =>
    $fetch(`${config.public.apiBase}users/followers/${currentUser.value._id}`, {
      headers: { Authorization: `Bearer ${store.accessToken}` },
      params: {
        page: pageFollow.value,
      },
    }),
  {
    watch: [pageFollow],
  }
);
var { data: usersFollowing, refresh: refreshFollowing } = await useAsyncData(
  `usersFollowing`,
  () =>
    $fetch(`${config.public.apiBase}users/following/${currentUser.value._id}`, {
      headers: { Authorization: `Bearer ${store.accessToken}` },
      params: {
        page: pageFollowing.value,
      },
    }),
  {
    watch: [pageFollowing],
  }
);

const pictureLoad = ref(false);

const profileEdit = ref(false);
const profileLoad = ref(false);
const profileValues = ref({
  name: "",
  email: "",
  document: "",
  birthday: null,
  gender: null,
  phone: null,
  tags: null,
});
const profileSchema = yup.object({
  name: yup.string().required("Este campo deve ser preenchido").min(3),
  document: yup.string(),
  birthday: null,
  gender: null,
});

function profileSave(values) {
  profileLoad.value = true;

  if (values.document) values.document = unmask(values.document, " .-/");
  if (values.phone) values.phone = unmask(values.phone, " ()-");

  store
    .update(values)
    .then(async () => {
      Toast.success("Perfil alterado com sucesso!");
      profileLoad.value = false;
      profileEdit.value = false;
    })
    .catch((err) => {
      Toast.error("Perfil não alterado!");
      profileLoad.value = false;
    });
}

async function unfollow(id, remove = false) {
  loadingsId.value.push(id);

  if (remove) {
    await store.get(`users/unfollow/${id}/${user._id}`).then(async () => {
      await store.fetchUser();
      refreshFollow();
      refreshFollowing();
    });
  } else {
    let hasFollow = currentUser.value.following.includes(id);

    await store.get(`users/${hasFollow ? "unfollow" : "follow"}/${user._id}/${id}`).then(async () => {
      await store.fetchUser();
      refreshFollow();
      refreshFollowing();
    });
  }

  loadingsId.value = [];
}
async function follow(id) {
  loadingsId.value.push(id);
  let hasFollow = currentUser.value.following.includes(id);

  await store.get(`users/${hasFollow ? "unfollow" : "follow"}/${user._id}/${id}`).then(async () => {
    await store.fetchUser();
    refreshFollow();
    refreshFollowing();
  });

  loadingsId.value = [];
}

onMounted(() => {
  if (!store.loadingUser) mergeValues();
});

// Functions
function mergeValues() {
  for (let pro in profileValues.value) {
    if (user[pro]) profileValues.value[pro] = user[pro];
    if (user.birthDay) profileValues.value.birthDay = user.birthDay.substring(0, 10);
  }
}

// Async functions
async function uploadPicture(data) {
  pictureLoad.value = true;
  let names = {
    normal: "picture",
    medium: "pictureMedium",
    small: "pictureSmall",
  };

  let urls = {
    picture: "",
    pictureMedium: "",
    pictureSmall: "",
  };

  for (let size in data) {
    await upload(data[size], size).then((link) => {
      urls[names[size]] = link;
    });
  }

  save(urls, "picture");
}
async function save(value) {
  if (value) {
    await store
      .update(value)
      .then(async (res) => {
        store.fetchUser();
        Toast.success("Foto de perfil alterada com sucesso!");
        pictureLoad.value = false;
      })
      .catch((err) => {
        console.error(err);
        Toast.error("Foto de perfil não alterada!");
        pictureLoad.value = false;
      });
  }
}
async function upload(file, size = "normal") {
  /** @type {any} */
  const metadata = {
    cacheControl: "public,max-age=80000",
    customMetadata: {
      size: size,
      model: "picture",
      dimensions: file.dimensions,
    },
  };

  var nameImage = `${store.current._id}/picture`;
  if (size != "normal") nameImage += `--${size}`;

  const storageRef = refStorage(storage, nameImage);
  const uploadTask = await uploadBytesResumable(storageRef, file, metadata);

  return await getDownloadURL(uploadTask.ref).then((downloadURL) => {
    return downloadURL;
  });
}
</script>
