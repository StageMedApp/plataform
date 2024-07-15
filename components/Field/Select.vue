<script setup>
import { toRef } from "vue";
import { useField } from "vee-validate";
import { Listbox, ListboxLabel, ListboxButton, ListboxOptions, ListboxOption } from "@headlessui/vue";

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
    type: String,
    default: "",
  },
  value: {
    type: String,
    default: "",
  },
  options: {
    type: Array,
    default: [],
  },
  name: {
    type: String,
    required: true,
  },
  autocomplete: {
    type: String,
  },
  label: {
    type: String,
  },
  hint: {
    type: String,
  },
  placeholder: {
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

const emit = defineEmits(["update:modelValue"]);

function ChangeValue(e) {
  handleChange(e);
  emit("update:modelValue", e.target.value);
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

const sizesIcon = {
  large: "text-2xl p-4 rounded-md",
  medium: "text-2xl p-3 rounded-md",
  small: "text-bse p-3 rounded-md",
  tiny: "text-base p-2 rounded-md",
};

const inputClass = computed(() => {
  let base = " truncate transition border border-solid shadow-xsmall w-full focus:outline-none focus:ring-1 text-left";
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

const isPlaceholder = ref(true);
const plceholderSelect = computed(() => {
  let placeholder = props.placeholder;
  let valueSelect = inputValue.value;
  if (valueSelect) {
    placeholder = props.options.find((opt) => opt.value == valueSelect).label;
    isPlaceholder.value = false;
  }

  return placeholder;
});
</script>

<template>
  <div class="flex flex-col gap-1 items-stretch justify-start relative">
    <label :class="labelClass" :for="idInput" v-if="!hiddenLabel">{{ labelInput }}</label>

    <Listbox
      :disabled="disabled"
      :name="name"
      :id="idInput"
      v-model="inputValue"
      :placeholder="placeholder"
      @input="ChangeValue"
      @blur="handleBlur"
    >
      <div class="relative">
        <ListboxButton :class="inputClass">
          {{ plceholderSelect }}
          <span class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
            <Icon name="solar:alt-arrow-down-outline" />
          </span>
        </ListboxButton>

        <transition
          leave-active-class="transition duration-100 ease-in"
          leave-from-class="opacity-100"
          leave-to-class="opacity-0"
        >
          <ListboxOptions
            class="absolute z-20 mt-2 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-xlarge focus:outline-none sm:text-sm"
          >
            <ListboxOption
              v-slot="{ active, selected }"
              v-for="opt in options"
              :key="opt.value"
              :value="opt.value"
              as="template"
            >
              <li
                :class="[
                  active ? 'bg-primary-100 text-primary-900' : 'text-primary-800',
                  selected ? 'font-medium bg-primary-50' : 'font-normal',
                  'relative cursor-default select-none py-2 px-3',
                ]"
              >
                {{ opt.label }}
              </li>
            </ListboxOption>
          </ListboxOptions>
        </transition>
      </div>
    </Listbox>

    <div v-if="hint || errorMessage">
      <span class="text-body-sm flex items-center gap-2 text-error-600 tracking-[0.25px]" v-if="errorMessage">
        <Icon name="solar:info-circle-line-duotone" class="text-error text-base" />{{ errorMessage }}
      </span>
      <span
        class="text-body-sm flex items-center gap-2 text-neutral-600 tracking-[0.25px]"
        v-if="hint && !errorMessage"
      >
        <Icon name="solar:info-circle-line-duotone" class="text-neutral text-base" />{{ hint }}
      </span>
    </div>
  </div>
</template>
