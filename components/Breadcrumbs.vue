<template>
  <ol vocab="http://schema.org/" typeof="BreadcrumbList" class="breadcrumbs text-body-sm md:text-body">
    <li v-if="showHome" property="itemListElement" typeof="ListItem" class="flex items-center">
      <NuxtLink to="/"> Home </NuxtLink>
      <meta property="position" :content="1" />
    </li>
    <li v-for="(crumb, index) in breadcrumbs" :key="index" property="itemListElement" typeof="ListItem" class="flex items-center">
      <NuxtLink :to="crumb.path">{{ crumb.title }} </NuxtLink>
      <meta property="position" :content="index + 2" />
    </li>
  </ol>
</template>

<script setup>
import { capitalize } from "~/helpers";

const props = defineProps({
  showHome: {
    type: Boolean,
    default: true,
  },
});

const route = useRoute();
const router = useRouter();
const routerList = router.getRoutes();

const breadcrumbs = computed(() => {
  const fullPath = route.fullPath;
  const params = fullPath.startsWith("/") ? fullPath.substring(1).split("/") : fullPath.split("/");
  const crumbs = [];

  let path = "";

  params.forEach((param, index) => {
    path = `${path}/${param}`;
    let currentRouter = routerList.find((router) => router.path == path);

    let paramName = param.replace(/-/g, " ");
    if (param.startsWith("new")) paramName = param.split("=")[1];

    crumbs.push({
      title: capitalize(currentRouter?.meta?.title || paramName),
      path: path,
    });
  });

  return crumbs;
});
</script>

<style lang="scss" scoped>
ol.breadcrumbs {
  @apply flex flex-wrap gap-2 items-center justify-start py-4;

  li {
    @apply text-neutral-600 hover:text-neutral-800 flex;
  }
  li::before {
    content: "/";
    @apply w-4 text-center font-inter mt-0.5;
  }
  li:last-child {
    @apply text-primary-600 hover:text-primary-800;
  }
  li:first-child::before {
    content: "";
    @apply hidden;
  }
}
</style>
