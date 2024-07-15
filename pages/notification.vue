<template>
  <div class="profile-page">
    <div class="container">
      <div class="card mb-6" v-if="false">
        <div class="card-head">
          <h3 class="title title--card-sm">Notificações</h3>
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
    </div>
  </div>
</template>

<script setup>
import { useUserStore, useGlobalStore } from "~~/stores";

definePageMeta({
  title: "Notificações",
});
useHead({
  title: "Notificações",
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
