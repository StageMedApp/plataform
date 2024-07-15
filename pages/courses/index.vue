<template>
  <div class="courses-page">
    <div class="container">
      <div class="grid sm:grid-cols-2 md:grid-cols-3 2xl:grid-cols-4 gap-x-[3%] gap-y-6 w-full">
        <NuxtLink :to="'/courses/' + course._id" class="w-full relative cursor-pointer" v-for="course in courses">
          <img class="w-full rounded-lg aspect-video" :src="course.cover" />
          <div class="flex w-full gap-x-3 items-start mt-2">
            <div>
              <h3 class="text-lg font-semibold leading-[20px] w-[94%]">{{ course.name }}</h3>
              <div class="mt-1 flex flex-col">
                <div class="flex gap-y-1 gap-x-4 flex-wrap">
                  <p class="text-body-sm text-neutral tracking-wide flex items-center gap-1.5"><Icon name="solar:folder-with-files-line-duotone" /> Aquivos - {{ course.files.length }}</p>
                  <p class="text-body-sm text-neutral tracking-wide flex items-center gap-1.5"><Icon name="solar:chat-square-check-line-duotone" /> Comentarios - {{ course.count.commets }}</p>
                </div>
                <p class="text-body-sm text-neutral-800 font-medium tracking-wider">{{ getDayRelative(course.created_at) }} atrás</p>
              </div>
            </div>
          </div>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useUserStore } from "~~/stores";

import dayjs from "dayjs";
import "dayjs/locale/pt-br";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);
dayjs.locale("pt-br");

const store = useUserStore();
const config = useRuntimeConfig();
const currentUser = computed(() => store.currentUser);

function getDayRelative(date) {
  return dayjs().to(dayjs(date));
}

const { data: courses } = await useAsyncData(`list-courses`, () =>
  $fetch(`${config.public.apiBase}courses`, {
    headers: { Authorization: `Bearer ${store.accessToken}` },
  })
);
</script>
