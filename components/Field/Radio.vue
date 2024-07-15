<script setup>
import { toRef } from "vue";
import { useField } from "vee-validate";

const props = defineProps({
  type: {
    type: String,
    default: "line",
  },
  value: String,
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
  modelValue: String,
});

const emit = defineEmits(["update:modelValue"]);

function ChangeValue(e) {
  handleChange(e);
  emit("update:modelValue", e);
}

const { handleChange, errorMessage, meta } = useField(props.name, undefined, {
  initialValue: props.modelValue,
  valueProp: props.value,
});
const idInput = props.name + Math.floor(Math.random() * 99999);

const inputClass = computed(() => {
  let options = {
    card: "peer hidden",
    line: "d-radio",
  };
  return options.line;
});
const labelClass = computed(() => {
  let options = {
    card: "flex h-full w-full items-end cursor-pointer rounded-xl border border-neutral-200 bg-white p-2 text-body-sm hover:border-neutral-300 peer-checked:border-primary peer-checked:shadow-small peer-checked:shadow-primary peer-checked:text-primary text-neutral-600 font-semibold",
    line: "text-left relative text-body-sm text-neutral-900 leading-none",
  };
  return options.line;
});
</script>

<template>
  <div class="flex flex-col gap-1 items-stretch justify-start">
    <div :class="[type == 'card' ? 'h-full min-h-15' : 'relative flex items-center gap-2']">
      <input
        :value="value"
        @input="ChangeValue"
        :class="inputClass"
        :disabled="disabled"
        :name="name"
        :id="idInput"
        type="radio"
      />
      <label :class="labelClass" :for="idInput" v-if="!hiddenLabel">
        <slot>{{ label }}</slot>
      </label>
    </div>
  </div>
</template>
