<script setup>
import { useField } from "vee-validate";

const props = defineProps({
  type: {
    type: String,
    default: "rigth",
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
  modelValue: String,
});

const emit = defineEmits(["update:modelValue"]);

function ChangeValue(e) {
  let val = e.target.value;

  if (!checked) {
    val = null;
  }
  handleChange(val);
  emit("update:modelValue", val);
}

const { checked, handleChange, errorMessage, meta } = useField(props.name, undefined, {
  type: "checkbox",
  initialValue: props.modelValue,
  validateOnMount: false,
  valueProp: props.value,
});
const idInput = props.name + Math.floor(Math.random() * 99999);

const position = computed(() => {
  let options = {
    rigth: "flex items-center justify-between",
    left: "flex items-center justify-start flex-row-inverse",
  };
  return options[props.type];
});
</script>

<template>
  <div class="flex flex-col gap-1 items-stretch justify-start">
    <div :class="position">
      <label class="text-left relative text-body-sm text-neutral-900 leading-none" :for="idInput" v-if="!hiddenLabel">
        <slot>{{ label }}</slot>
      </label>
      <input :value="value" @input="ChangeValue" class="d-toggle" :disabled="disabled" :name="name" :id="idInput" type="checkbox" />
    </div>
  </div>
</template>
