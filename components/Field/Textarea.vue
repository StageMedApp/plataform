<script setup>
import { toRef } from "vue";
import { useField } from "vee-validate";

const props = defineProps({
  size: {
    type: String,
    default: "medium",
    validator(value) {
      return ["large", "medium", "small", "tiny"].includes(value);
    },
  },
  modelValue: {
    type: String,
    default: "",
  },
  value: {
    type: String,
  },
  name: {
    type: String,
    required: true,
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
  initialValue: props.value,
  valueProp: props.modelValue,
});
const idInput = props.name;
const labelInput = computed(() => {
  let text = props.label || props.name;
  return text.charAt(0).toUpperCase() + text.slice(1);
});

const sizes = {
  medium: `text-body tracking-[0.5px]  py-3 px-4 rounded-xl ${props.password && "pr-11"}`,
  small: `text-body-s tracking-[0.25px]  py-3 px-4 rounded-lg`,
};

const inputClass = computed(() => {
  let base = "resize-none transition border border-solid shadow-xsmall w-full focus:outline-none focus:ring-1";
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
</script>

<template>
  <div class="flex flex-col gap-1 items-stretch justify-start">
    <label :class="labelClass" :for="idInput" v-if="!hiddenLabel">{{ labelInput }}</label>
    <div class="relative">
      <textarea
        autocapitalize="sentences"
        maxlength="300"
        :disabled="disabled"
        rows="5"
        :name="name"
        :id="idInput"
        :value="inputValue"
        :placeholder="placeholder"
        @input="ChangeValue"
        @blur="handleBlur"
        :class="inputClass"
      />
    </div>
    <div v-if="hint || errorMessage">
      <span
        class="text-body-sm flex items-center gap-2 text-error-600 tracking-[0.25px]"
        v-if="errorMessage && meta.touched"
      >
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
