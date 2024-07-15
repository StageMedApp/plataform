<template>
  <TransitionRoot as="template" :show="show">
    <Dialog as="div" class="relative z-10" @close="closeModal">
      <TransitionChild as="template" enter="ease-out duration-300" enter-from="opacity-0" enter-to="opacity-100" leave="ease-in duration-200" leave-from="opacity-100" leave-to="opacity-0">
        <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
      </TransitionChild>

      <div class="fixed inset-0 z-10 overflow-y-auto">
        <div class="flex min-h-full min-w-full items-center justify-center p-6 sm:p-0">
          <TransitionChild
            as="template"
            enter="ease-out duration-300"
            enter-from="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enter-to="opacity-100 translate-y-0 sm:scale-100"
            leave="ease-in duration-200"
            leave-from="opacity-100 translate-y-0 sm:scale-100"
            leave-to="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          >
            <DialogPanel class="relative transform overflow-hidden rounded-lg bg-card text-left shadow-xl transition-all w-full sm:max-w-lg">
              <div class="p-4">
                <div class="flex items-center justify-between mb-8">
                  <div class="text-base font-semibold leading-6 text-gray-900">
                    <h3>{{ title }}</h3>
                  </div>
                  <Button icon color="link" size="tiny" @click="closeModal">
                    <Icon name="solar:close-circle-line-duotone" />
                  </Button>
                </div>

                <slot />
              </div>
              <div :class="[center ? 'flex-col items-center justify-center' : 'flex-row-reverse', 'bg-gray-50 flex px-4 py-4 gap-2']">
                <slot name="confirm">
                  <Button color="primary" size="small" @click="confirmeModal">
                    {{ confirm }}
                  </Button>
                </slot>
                <slot name="cancel">
                  <Button color="linkError" size="small" @click="closeModal" ref="cancelButtonRef">
                    {{ cancel }}
                  </Button>
                </slot>
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>

<script setup>
import { Dialog, DialogPanel, TransitionChild, TransitionRoot } from "@headlessui/vue";

const props = defineProps({
  show: {
    type: Boolean,
    default: false,
  },
  center: {
    type: Boolean,
    default: false,
  },
  title: {
    type: String,
    default: "s",
  },
  confirm: {
    type: String,
    default: "Confirmar",
  },
  cancel: {
    type: String,
    default: "Cancelar",
  },
});

const emit = defineEmits(["close", "confirme"]);
function closeModal() {
  emit("close", true);
}
function confirmeModal() {
  emit("confirme", true);
}
</script>
