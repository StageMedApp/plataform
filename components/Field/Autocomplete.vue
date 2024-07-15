<template>
  <Combobox :modelValue="modelValue" @update:modelValue="(value) => ChangeValue(value)">
    <div class="relative flex flex-col gap-1 items-stretch justify-start">
      <label :class="labelClass" :for="idInput" v-if="!hiddenLabel">{{ labelInput }}</label>
      <div class="relative">
        <ComboboxInput
          :placeholder="placeholder"
          :class="inputClass"
          :displayValue="(selected) => selected.name"
          :disabled="disabled"
          :name="name"
          :id="idInput"
          v-model="inputValue"
          @input="search"
          @blur="handleBlur"
        />
      </div>

      <TransitionRoot
        leave="transition ease-in duration-100"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
        @after-leave="query = ''"
      >
        <ComboboxOptions
          class="absolute !z-40 mt-2 max-h-60 w-full overflow-auto rounded-md !bg-white py-1 text-base shadow-xlarge focus:outline-none sm:text-sm"
        >
          <div v-if="resultsLoading" class="load-content-tiny"></div>
          <div v-else>
            <div v-if="results.length === 0" class="relative cursor-default select-none py-2 px-4 text-gray-700">
              Não encontrado.
            </div>

            <ComboboxOption v-for="(item, index) in results" :key="index" :value="item" v-slot="{ selected, active }">
              <li
                class="flex gap-2 items-center"
                :class="[
                  active ? 'bg-primary-100 text-primary-900' : 'text-primary-800',
                  selected ? 'font-medium' : 'font-normal',
                  'relative cursor-default select-none py-2 px-3',
                ]"
              >
                <div class="relative shrink-0">
                  <span
                    v-if="item.status == 'online'"
                    class="absolute bg-green-500 right-0 top-0 z-10 h-2 aspect-square rounded-full"
                  >
                  </span>
                  <img v-if="item.picture" loading="lazy" :src="item.picture" class="h-8 aspect-square rounded-full" />
                </div>
                {{ item?.name }}
              </li>
            </ComboboxOption>
          </div>
        </ComboboxOptions>
      </TransitionRoot>
    </div>
  </Combobox>
</template>

<script setup>
import { Combobox, ComboboxInput, ComboboxOptions, ComboboxOption, TransitionRoot } from "@headlessui/vue";

const props = defineProps({
  size: {
    type: String,
    default: "medium",
    validator(value) {
      return ["large", "medium", "small", "tiny"].includes(value);
    },
  },
  type: {
    type: String,
    default: "text",
  },
  modelValue: {
    type: String || Object,
  },
  value: {
    type: String,
    default: "",
  },
  name: {
    type: String,
  },
  debounce: {
    type: Number,
    default: 350,
  },
  label: {
    type: String,
  },
  placeholder: {
    type: String,
    default: "",
  },
  route: {
    type: String,
    default: "",
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  hiddenLabel: {
    type: Boolean,
    default: false,
  },
});

const selected = ref();
const config = useRuntimeConfig();

const emit = defineEmits(["update:modelValue"]);
function ChangeValue(value) {
  value = JSON.parse(JSON.stringify(value));
  delete value.licence;
  handleChange(value);
  emit("update:modelValue", value);
}

const name = toRef(props, "name");
const {
  value: inputValue,
  errorMessage,
  handleBlur,
  handleChange,
  meta,
} = useField(name, undefined, {
  initialValue: props.modelValue,
  valueProp: props.modelValue,
});

const idInput = props.name;
const labelInput = computed(() => {
  let text = props.label || props.name;
  return text.charAt(0).toUpperCase() + text.slice(1);
});

const sizes = {
  medium: `text-body tracking-[0.5px] h-12 py-3 px-4 rounded-xl ${props.password && "pr-11"}`,
  small: `text-body-s tracking-[0.25px] h-10 py-3 px-4 rounded-lg`,
};
const inputClass = computed(() => {
  let base = "transition border border-solid shadow-xsmall w-full focus:outline-none focus:ring-1 text-left";
  if (errorMessage.value)
    return `${base} bg-error-50 border-error-300 placeholder:text-error-300 text-error-900 focus:ring-error-200 focus:border-error-200  ${
      sizes[props.size]
    }`;
  return `${base} bg-card border-neutral-300 placeholder:text-neutral-300 text-neutral-900 focus:ring-primary-200 focus:border-primary-200 disabled:bg-neutral-50 ${
    sizes[props.size]
  }`;
});
const labelClass = computed(() => {
  let base = "text-left relative self-stretch text-body-sm";
  if (errorMessage.value) return `${base} text-error-900`;
  return `${base} text-neutral-900`;
});

var timeoutSearch = null;

const resultsLoading = ref(false);
const results = ref([]);

async function search(e) {
  resultsLoading.value = true;
  let value = e.target.value;

  clearTimeout(timeoutSearch);
  timeoutSearch = setTimeout(async () => {
    const api = `${config.public.apiBase}${props.route}/public/search?q=${encodeURI(value)}`;
    const { data } = await useFetch(api);

    results.value = data.value;
    resultsLoading.value = false;
  }, props.debounce);
}
</script>

<style></style>
