<script setup>
import { toRef } from "vue";
import { useField } from "vee-validate";

const props = defineProps({
  type: {
    type: String,
    default: "line",
  },
  value: [String, Boolean],
  label: String,
  name: {
    type: String,
    required: true,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  hiddenLabel: {
    type: Boolean,
    default: false,
  },
  uncheck: {
    type: Boolean,
    default: null,
  },
  check: {
    type: [String, Boolean],
    default: true,
  },
  modelValue: String,
  isBool: Boolean,
});

const emit = defineEmits(["update:modelValue"]);

function ChangeValue(e) {
  let val = props.check;

  if (!checked) {
    val = props.uncheck;
  }
  handleChange(val);
  emit("update:modelValue", val);
}

const { checked, handleChange, errorMessage, meta } = useField(props.name, undefined, {
  type: "checkbox",
  initialValue: props.value,
  validateOnMount: false,
  uncheckedValue: props.uncheck,
  checkedValue: props.check,
});
const idInput = props.name + Math.floor(Math.random() * 99999);

const inputClass = computed(() => {
  let options = {
    card: "peer hidden",
    line: "d-checkbox",
  };
  return options[props.type];
});
const labelClass = computed(() => {
  let options = {
    card: "flex h-full w-full items-end cursor-pointer rounded-xl border border-neutral-200 bg-white p-2 text-body-sm hover:border-neutral-300 peer-checked:border-primary peer-checked:shadow-small peer-checked:shadow-primary peer-checked:text-primary text-neutral-600 font-semibold",
    line: "text-left relative text-body-sm text-neutral-900 leading-none",
  };
  return options[props.type];
});
</script>

<template>
  <div class="flex flex-col gap-1 items-stretch justify-start">
    <div :class="[type == 'card' ? 'h-full min-h-15' : 'relative flex items-center gap-2']">
      <input
        :value="value"
        @input="ChangeValue"
        :class="inputClass"
        :checked="checked"
        :disabled="disabled"
        :name="name"
        :id="idInput"
        type="checkbox"
      />
      <label :class="labelClass" :for="idInput" v-if="!hiddenLabel">
        <slot>{{ label }}</slot>
      </label>
    </div>
  </div>
</template>
