<script setup>
const props = defineProps({
  color: {
    type: String,
    default: "primary",
    validator(value) {
      return ["primary", "primaryBold", "primaryDark", "neutral", "neutralDark", "success", "successDark", "warning", "warningDark", "error", "errorDark"].includes(value);
    },
  },
  size: {
    type: String,
    default: "medium",
    validator(value) {
      // The value must match one of these strings
      return ["large", "medium", "small", "bullet"].includes(value);
    },
  },
  click: {
    type: Boolean,
    default: false,
  },
  to: {
    type: String,
  },
  class: {
    type: String,
    default: "",
  },
});

const colors = {
  primary: `bg-primary-50 text-primary-700 ${props.click ? "hover:bg-primary-100 hover:text-primary-800 cursor-pointer transition" : ""}`,
  primaryBold: `!font-bold bg-primary-50 text-neutral-700 ${props.click ? "hover:bg-primary-100 hover:text-primary-800 cursor-pointer transition" : ""}`,
  primaryDark: "bg-primary text-white",
  neutral: "bg-neutral-50 text-neutral-700",
  neutralDark: "bg-neutral text-white",
  success: "bg-success-50 text-success-700",
  successDark: "bg-success text-white",
  warning: "bg-warning-50 text-warning-700",
  warningDark: "bg-warning text-white",
  error: "bg-error-50 text-error-700",
  errorDark: "bg-error text-white",
};
const sizes = {
  large: "text-sm tracking-wide gap-2 py-1 px-4",
  medium: "text-xs tracking-wider gap-2 py-1 px-3 font-medium",
  small: "text-2xs tracking-widest gap-2 py-0.5 px-2 uppercase",
  bullet: "h-2 aspect-square m-0 p-0",
};
</script>

<template>
  <div>
    <NuxtLink v-if="to" :to="to" :class="[`shrink-0 flex items-center rounded-full w-auto ${sizes[size]} ${colors[color]}`]">
      <slot />
    </NuxtLink>
    <div v-else :class="`flex items-center rounded-full w-auto ${sizes[size]} ${colors[color]}`">
      <slot />
    </div>
  </div>
</template>
