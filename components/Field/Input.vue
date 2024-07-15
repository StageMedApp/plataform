<script setup>
import { toRef } from "vue";
import { useField } from "vee-validate";
import { vMaska } from "maska";
import { randChar } from "~~/helpers";

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
  mask: {
    type: String,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  password: {
    type: Boolean,
    default: false,
  },
  icon: String,
  hiddenLabel: Boolean,
  loading: Boolean,
});

const emit = defineEmits(["update:modelValue"]);

function ChangeValue(e) {
  e.target.unmasked = bindedObject.unmasked;

  handleChange(e);
  emit("update:modelValue", bindedObject.unmasked);
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
const idInput = props.name + "-" + randChar(5);
const labelInput = computed(() => {
  let text = props.label || props.name;
  return text.charAt(0).toUpperCase() + text.slice(1);
});

const sizes = {
  medium: `text-body tracking-[0.5px] h-12 py-3 px-4 rounded-xl ${props.password && "pr-11"}`,
  small: `text-body-s tracking-[0.25px] h-10 py-3 px-4 rounded-lg`,
};

const sizesIcon = {
  large: "absolute h-full flex items-center text-2xl p-4 text-neutral",
  medium: "absolute h-full flex items-center text-xl p-3 text-neutral",
  small: "absolute h-full flex items-center text-base p-3 text-neutral",
  tiny: "absolute h-full flex items-center text-base p-2 text-neutral",
};

const inputClass = computed(() => {
  let base = "transition border border-solid shadow-xsmall w-full focus:outline-none focus:ring-1";
  if (props.icon == "left") base += " pl-10";
  if (props.icon == "right") base += " pr-9";
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

const showPass = ref(false);
const inputType = computed(() => {
  if (props.password) return showPass.value ? "text" : "password";
  return props.type;
});

const inputProps = computed(() => {
  let prop = {
    disabled: props.disabled,
    name: props.name,
    id: idInput,
    type: inputType.value,
  };
  return prop;
});

const bindedObject = reactive({});
</script>

<template>
  <div class="flex flex-col gap-1 items-stretch justify-start">
    <label :class="labelClass" :for="idInput" v-if="!hiddenLabel">{{ labelInput }}</label>
    <div class="relative">
      <div :class="sizesIcon[size]" class="-z-0" v-if="icon">
        <slot />
      </div>

      <input
        v-maska="bindedObject"
        :data-maska="mask"
        v-bind="inputProps"
        :value="inputValue"
        :placeholder="placeholder"
        :autocomplete="autocomplete"
        @input="ChangeValue"
        @blur="handleBlur"
        :class="inputClass"
      />

      <Button
        tag="span"
        class="!absolute top-3 right-3 text-base !p-1"
        icon
        size="small"
        color="link"
        v-if="password"
        @click="showPass = !showPass"
      >
        <Icon name="solar:eye-linear" v-if="showPass" />
        <Icon name="solar:eye-closed-linear" v-else />
      </Button>

      <progress class="d-progress w-full h-1 absolute bottom-0 left-0" v-if="loading"></progress>
    </div>
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
