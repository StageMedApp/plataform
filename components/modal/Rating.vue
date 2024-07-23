<template>
  <TransitionRoot as="template" :show="show">
    <Dialog as="div" class="relative z-[9999999999999999999]" @close="closeModal">
      <TransitionChild
        as="template"
        enter="ease-out duration-300"
        enter-from="opacity-0"
        enter-to="opacity-100"
        leave="ease-in duration-200"
        leave-from="opacity-100"
        leave-to="opacity-0"
      >
        <div class="fixed inset-0 bg-neutral-500 bg-opacity-75 transition-opacity" />
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
            <DialogPanel
              class="relative transform overflow-hidden rounded-lg bg-card text-left shadow-xl transition-all w-full sm:max-w-lg"
            >
              <Form @submit="save" :validation-schema="schema" :initial-values="ratingValue">
                <div class="p-4">
                  <div class="flex items-center justify-between mb-8">
                    <div class="text-base font-semibold leading-6 text-neutral-900">
                      <h3>{{ body[type].title }}</h3>
                    </div>
                    <Button tag="div" icon color="link" size="tiny" @click="closeModal">
                      <Icon name="solar:close-circle-line-duotone" />
                    </Button>
                  </div>

                  <div class="grid">
                    <div class="flex justify-center">
                      <div class="d-rating d-rating-lg d-rating-half -ml-[3.75px]">
                        <Field
                          type="radio"
                          name="rate"
                          :value="1"
                          class="bg-secondary-yellow-500 d-mask d-mask-star-2"
                        />
                        <Field
                          type="radio"
                          name="rate"
                          :value="2"
                          class="bg-secondary-yellow-500 d-mask d-mask-star-2"
                        />
                        <Field
                          type="radio"
                          name="rate"
                          :value="3"
                          class="bg-secondary-yellow-500 d-mask d-mask-star-2"
                        />
                        <Field
                          type="radio"
                          name="rate"
                          :value="4"
                          class="bg-secondary-yellow-500 d-mask d-mask-star-2"
                        />
                        <Field
                          type="radio"
                          name="rate"
                          :value="5"
                          class="bg-secondary-yellow-500 d-mask d-mask-star-2"
                        />
                      </div>
                    </div>
                    <div class="mt-4">
                      <FieldTextarea name="review" label="Escreva sobre sua avalição" placeholder="..." />
                    </div>
                  </div>
                </div>
                <div class="flex-col items-center justify-center bg-neutral-50 flex px-4 py-4 gap-2">
                  <Button size="small" color="primary" :loading="loading"> Enviar avaliação </Button>
                  <Button size="small" color="linkError" tag="div" @click="closeModal" ref="cancelButtonRef">
                    Cancelar
                  </Button>
                </div>
              </Form>
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>

<script setup>
import { useUserStore } from "~~/stores";
import { Dialog, DialogPanel, TransitionChild, TransitionRoot } from "@headlessui/vue";
import { Form, Field } from "vee-validate";
import * as yup from "yup";
import { push } from "notivue";

const props = defineProps({
  show: {
    type: Boolean,
    default: false,
  },
  target: Object,
  type: {
    type: String,
    default: "therapist",
    validator(value) {
      return ["therapist", "product", "store"].includes(value);
    },
  },
});

const emit = defineEmits(["close", "confirme"]);
function closeModal() {
  emit("close", true);
}
function confirmeModal() {
  emit("confirme", true);
}

const config = useRuntimeConfig();
const store = useUserStore();
const user = store.current;
const router = useRouter();

const loading = ref(false);

if (!store.loggedIn) {
  push.error("Faça login para fazer uma avaliação!");
  closeModal();
  router.push("/auth/login");
}

const body = {
  therapist: {
    title: "Avalie o Terapeuta",
  },
  product: {
    title: "Avalie o Produto",
  },
  store: {
    title: "Avalie a Loja",
  },
};

const formRef = ref(null);
const ratingValue = ref({
  rate: 3,
  email: user.email,
  name: user.name,
  picture: user.pictureSmall,
  user_id: user._id,
  target_id: props.target._id,
  type_rating: props.type,
  review: "",
});
const schema = yup.object({
  review: yup.string().max(300, "Sua avalição deve ter no máximo 300 caracteres"),
  rate: yup.number().required().max(5),
});

async function save(values) {
  loading.value = true;

  await $fetch(`${config.public.apiBase}ratings`, {
    method: "POST",
    body: values,
  })
    .then((res) => {
      push.success("Avaliação enviada com sucesso!");
      window.location.reload(true);
    })
    .catch((err) => {
      push.error("Error ao enviar sua avaliação, tente novamente!");
    });

  confirmeModal();
  loading.value = false;
}
</script>
