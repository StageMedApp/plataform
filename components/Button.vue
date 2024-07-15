<script setup>
import CustomLink from "./CustomLink.vue";
import { useUserStore } from "~~/stores";

const store = useUserStore();
const modalLogin = ref(false);

const props = defineProps({
  color: {
    type: String,
    default: "primary",
  },
  size: {
    type: String,
    default: "medium",
  },
  tag: {
    type: String,
  },
  to: {
    type: String,
  },

  title: {
    type: String,
  },

  class: {
    type: String,
    default: "",
  },

  newPage: {
    type: Boolean,
    default: false,
  },

  disabled: {
    type: Boolean,
    default: false,
  },
  block: {
    type: Boolean,
    default: false,
  },
  icon: {
    type: Boolean,
    default: false,
  },
  avatar: {
    type: Boolean,
    default: false,
  },
  withLogin: {
    type: Boolean,
    default: false,
  },
  loading: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["click"]);
function callback(e) {
  if (props.withLogin && !store.loggedIn) modalLogin.value = true;
  else emit("click", e);
}

const colors = {
  primary:
    "bg-primary text-white hover:bg-primary-600 hover:shadow focus:outline-none focus:ring focus:ring-primary-200 active:bg-primary-700 active:shadow-large disabled:pointer-events-none disabled:bg-primary-200 disabled:text-primary-50",
  secondary:
    "bg-primary-50 text-primary hover:bg-primary-100 hover:text-primary-600 hover:shadow focus:outline-none focus:ring focus:ring-primary-50 active:bg-primary-200 active:text-primary-700 active:shadow-large disabled:pointer-events-none disabled:bg-primary-50 disabled:text-primary-200",
  secondaryError:
    "bg-error-50 text-error hover:bg-error-100 hover:text-error-600 hover:shadow focus:outline-none focus:ring focus:ring-error-50 active:bg-error-200 active:text-error-700 active:shadow-large disabled:pointer-events-none disabled:bg-error-50 disabled:text-error-200",
  link: "bg-transparent text-primary hover:bg-primary-50 hover:text-primary-600 focus:outline-none focus:ring focus:ring-primary-50 active:bg-primary-50 active:text-primary-700 disabled:pointer-events-none disabled:text-primary-200 disabled:opacity-50",
  linkError:
    "bg-transparent text-error hover:bg-error-50 hover:text-error-600 focus:outline-none focus:ring focus:ring-error-50 active:bg-error-50 active:text-error-700 disabled:pointer-events-none disabled:text-error-200",
  linkSuccess:
    "bg-transparent text-success hover:bg-success-50 hover:text-success-600 focus:outline-none focus:ring focus:ring-success-50 active:bg-success-50 active:text-success-700 disabled:pointer-events-none disabled:text-success-200",
  linkNeutral:
    "bg-transparent text-neutral-700 hover:bg-neutral-50 hover:text-neutral-600 active:bg-primary-50 active:text-primary-700 disabled:pointer-events-none disabled:text-neutral-200",
  linkWarning:
    "bg-transparent text-warning-700 hover:bg-warning-50 hover:text-warning-600 active:bg-warning-50 active:text-warning-700 disabled:pointer-events-none disabled:text-warning-200",
  linkWhite:
    "bg-transparent text-neutral-50 hover:bg-neutral-50/20 hover:text-neutral-100 active:bg-primary-50/20 active:text-primary-100 disabled:pointer-events-none disabled:text-neutral-50/50",
  linkClear:
    "bg-transparent text-primary hover:text-primary-600 focus:outline-none  active:text-primary-700 disabled:pointer-events-none disabled:text-primary-200 disabled:opacity-50",
  rounded:
    "bg-transparent text-primary border border-primary hover:border-primary-600 hover:text-primary-600 focus:outline-none focus:ring-1 focus:ring-primary active:border-primary-700 active:text-primary-700 disabled:pointer-events-none disabled:text-primary-200 disabled:border-primary-200",
};
const sizes = {
  large: "text-lg tracking-button gap-2 py-4 px-5 font-semibold rounded-2xl",
  medium: "text-base tracking-button gap-2 py-3 px-4 font-semibold rounded-xl h-12",
  small: "text-xs tracking-button gap-2 py-3 px-4 font-semibold rounded-lg h-10",
  tiny: "text-xs tracking-button gap-2 py-2 px-3 font-semibold rounded-md",
  tinyLink: "text-xs tracking-button gap-2 py-0.5 font-semibold rounded-md",
  tab: "text-xs tracking-button gap-2 py-3 px-4 font-semibold h-[45px]",
  link: "text-xs tracking-button gap-2 font-semibold h-full flex items-center",
  badge: "text-xs tracking-wider gap-2 py-1 px-3 font-medium",
};

const sizesIcon = {
  large: "text-2xl p-4 rounded-md",
  medium: "text-2xl p-3 rounded-md",
  small: "text-base p-3 rounded-md",
  tiny: "text-sm p-2 rounded-md",
};
const sizesAvatar = {
  large: "text-2xl p-4 rounded-full",
  medium: "text-2xl p-3 rounded-full",
  small: "text-bse p-3 rounded-full",
  tiny: "text-base p-2 rounded-full",
};

const butonClass = computed(() => {
  let base = props.class + " relative flex items-center justify-center transition-all text-center cursor-pointer";

  if (props.loading) base += " load-btn";
  if (props.avatar) return `${base} ${sizesAvatar[props.size]} ${colors[props.color]}`;
  if (props.icon) return `${base} ${sizesIcon[props.size]} ${colors[props.color]}`;
  else {
    return `${base} ${props.block ? "w-full" : "w-auto"} ${sizes[props.size]} ${colors[props.color]}`;
  }
});

const componetsRender = computed(() => {
  if (props.tag) return props.tag;
  if (props.to && !props.withLogin) return CustomLink;
  return "button";
});

const componetsBind = computed(() => {
  let bind = {
    title: props.title || "Botão",
    disabled: props.loading || props.disabled,
    class: butonClass.value,
  };

  if (props.to) {
    bind.to = props.to;
  }

  if (props.newPage) {
    bind.target = "_blank";
    bind.rel = "noopener";
  }

  return bind;
});
</script>

<template>
  <component @click="callback" v-bind="componetsBind" :is="componetsRender">
    <slot name="iconLeft" />
    <slot />
    <slot name="iconRigth" />
  </component>
</template>
