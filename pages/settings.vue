<template>
  <div class="profile-page">
    <div class="container">
      <div class="card mb-6" v-if="false">
        <div class="card-head">
          <h3 class="title title--card-sm">Estilo</h3>
        </div>

        <div class="grid gap-4 grid-cols-1 md:grid-cols-2">
          <FieldSelect
            name="language"
            :label="$t('layout.default.footer.language')"
            type="text"
            v-model="langSlected"
            :options="availableLocales"
          />
          <FieldSelect
            name="theme"
            :label="$t('layout.default.footer.theme')"
            type="text"
            v-model="colorMode.preference"
            :options="themes"
          />
        </div>
      </div>

      <div class="card mb-6">
        <div class="card-head">
          <div>
            <h3 class="title title--card-sm">Notificações</h3>
            <p class="subtitle subtitle--card-sm">Quais tipos de email deseja receber</p>
          </div>
        </div>

        <Form ref="settingsForm" :initial-values="settingsValues">
          <div class="grid gap-2">
            <FieldToggle name="reciveEmail" value="rate" label="Quando receber uma avaliação" />
            <FieldToggle name="reciveEmail" value="marketing" label="Marketing" />
          </div>
        </Form>
      </div>

      <div class="card">
        <div class="card-head">
          <h3 class="title title--card-sm">Segurança</h3>
        </div>

        <div class="grid gap-3">
          <div class="flex items-center justify-between">
            <div class="text-body">Senha</div>
            <Button color="linkNeutral" size="tiny">Alterar senha</Button>
          </div>
          <div class="flex items-center justify-between">
            <div class="text-body">E-mail</div>
            <Button color="linkSuccess" size="tiny" disabled>Verificado</Button>
          </div>
          <div class="flex items-center justify-between">
            <div class="text-body">Celular</div>
            <Button color="linkNeutral" size="tiny" disabled>Em breve</Button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useUserStore, useGlobalStore } from "~~/stores";

definePageMeta({
  title: "Configurações",
});
useHead({
  title: "Configurações",
});

const Toast = useState("toast").value;
const global = useGlobalStore();
const store = useUserStore();
var mergeUser = store.current;

const { locale, locales } = useI18n();
const switchLocalePath = useSwitchLocalePath();
const availableLocales = computed(() => {
  let langs = [];
  locales.value.forEach((el) => {
    langs.push({
      value: el.code,
      label: el.name,
    });
  });

  return langs;
});
const langSlected = ref(locale.value);
function langSet(lang) {}

const colorMode = useColorMode();
const themes = global.themes;

const settingsForm = ref(null);
const settingsValues = ref({
  ...mergeUser.settings,
});

async function settingsSave() {
  let isValid = await settingsForm.value.validate();

  if (isValid.valid) {
    let values = await settingsForm.value.getValues();
    await store
      .update({ settings: values })
      .then(async (res) => {
        Toast.success("Perfil alterado com sucesso!");
      })
      .catch((err) => {
        Toast.error("Perfil não alterado!");
      });
  }
}
</script>
