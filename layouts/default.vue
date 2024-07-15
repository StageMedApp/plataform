<script setup>
import { Dialog, DialogPanel, TransitionChild, TransitionRoot } from "@headlessui/vue";
import { useUserStore, useNotificationStore } from "~~/stores";

const store = useUserStore();
const user = computed(() => store);
const currentUser = computed(() => store.current);

const notify = useNotificationStore();

const badgesPins = computed(() => {
  return {
    notification: notify.showPulse,
    chat: store.getNotificationsChat,
  };
});

const router = useRouter();
const route = useRoute();

if (!user.value.isLoggedIn) router.push("/auth/login");
if (store.loggedIn && !store.current?.account?.basic?.completed && !store.current?.emailVerified)
  router.push("/auth/register");

const profileSideNav = ref(false);
function showDrawer(status) {
  profileSideNav.value = status;
}

const hiddenSideBar = computed(() => {
  return route.meta?.hiddenSideBar || false;
});
const hiddenFooter = computed(() => {
  return route.meta?.hiddenFooter || false;
});

const routesMenu = computed(() => {
  let routes = [
    { path: "/", label: "Inicio", icon: "solar:home-2-line-duotone", iconActive: "solar:home-2-bold" },

    {
      path: "/history",
      label: "Histórico de estações",
      icon: "solar:archive-line-duotone",
      iconActive: "solar:archive-bold-duotone",
    },
    {
      path: "/dash",
      label: "Meu desempenho",
      icon: "solar:chart-square-line-duotone",
      iconActive: "solar:chart-square-bold-duotone",
    },
    {
      path: "/notification",
      label: "Notificação",
      icon: "solar:bell-bing-line-duotone",
      iconActive: "solar:bell-bing-bold-duotone",
      badge: "notification",
    },
    {
      path: "/settings",
      label: "Configurações",
      icon: "solar:settings-minimalistic-line-duotone",
      iconActive: "solar:settings-minimalistic-bold-duotone",
    },
    {
      path: "/payments",
      label: "Financeiro",
      icon: "solar:wallet-money-line-duotone",
      iconActive: "solar:wallet-money-bold-duotone",
    },
    "divider",
  ];

  // if (store.current.plan != "disabled") {
  //   routes.push({
  //     type: "clinicCases",
  //     title: "Estação",
  //     order: "order-2",
  //     routes: [
  //       {
  //         path: "/activity",
  //         label: "Iniciar estação",
  //         icon: "solar:home-2-line-duotone",
  //         iconActive: "solar:home-2-bold",
  //       },
  //       {
  //         path: "/history",
  //         label: "Histórico de estações",
  //         icon: "solar:home-2-line-duotone",
  //         iconActive: "solar:home-2-bold",
  //       },
  //       { path: "/dash", label: "Meu desempenho", icon: "solar:home-2-line-duotone", iconActive: "solar:home-2-bold" },
  //     ],
  //   });
  // }
  if (store.current.plan != "disabled") {
    routes.push({
      path: "/chats",
      label: "Conversas",
      icon: "solar:chat-round-line-line-duotone",
      iconActive: "solar:chat-round-line-bold-duotone",
      badge: "chat",
    });
  }
  if (store.current.plan == "ouro") {
    routes.push({
      path: "/courses",
      label: "Vídeos aulas",
      icon: "solar:video-library-line-duotone",
      iconActive: "solar:video-library-bold-duotone",
    });
  }

  routes.push({
    path: "/contact",
    label: "Ajuda",
    icon: "solar:help-line-duotone",
    iconActive: "solar:help-bold-duotone",
  });

  return routes;
});
</script>

<template>
  <div class="profile-layout relative bg-[#F5F6FA] grid-page">
    <div class="flex">
      <!-- side-nav -->
      <div v-show="!hiddenSideBar" class="w-0 h-screen overflow-y-auto hidden lg:block lg:w-64 flex-shrink-0 bg-white">
        <div class="relative flex h-full w-full flex-col p-4 text-neutral-700">
          <div class="flex items-center gap-4 pt-2 pb-4 px-4 mb-2">
            <Logo file="logo_horizontal.svg" size="30px" />
          </div>
          <nav class="flex flex-col gap-1 font-sans text-base font-normal text-neutral-800">
            <div>
              <NuxtLink to="/profile" class="menu-item user">
                <img alt="" :src="currentUser.picture" class="size-8 rounded-full object-cover" />

                <div class="flex flex-col grow w-full">
                  <div class="text-base leading-none font-semibold">{{ currentUser.name }}</div>
                  <div class="text-xs truncate w-full">{{ currentUser.email }}</div>
                </div>
              </NuxtLink>
            </div>
            <div v-for="(rout, idx) in routesMenu" :key="idx">
              <hr v-if="rout == 'divider'" class="my-2 border-neutral-100" />
              <NuxtLink v-else :to="rout.path" class="menu-item">
                <div class="grid mr-4 place-items-center">
                  <Icon :name="rout.path == route.path ? rout.iconActive : rout.icon" />
                </div>
                {{ rout.label }}

                <div class="grid ml-auto place-items-center justify-self-end">
                  <div
                    v-if="rout.badge && badgesPins[rout.badge] > 0"
                    class="relative grid items-center px-2 py-1 font-sans text-xs font-bold uppercase rounded-full select-none whitespace-nowrap bg-primary-500/20 text-primary-900"
                  >
                    <span class="">{{ badgesPins[rout.badge] }}</span>
                  </div>
                </div>
              </NuxtLink>
            </div>
          </nav>

          <div
            v-if="user.current.plan == 'disabled'"
            class="relative block w-full pl-4 pr-8 py-4 mt-auto text-base text-white bg-neutral-900 rounded-lg bg-gradient-to-br from-neutral-950 to-primary-800"
          >
            <Icon name="solar:crown-line-duotone" size="42px" class="stroke-1" />
            <h6 class="block mb-1 text-base antialiased font-semibold leading-relaxed tracking-normal">
              Assine o plano PRO
            </h6>
            <p class="block text-sm antialiased font-normal leading-normal text-inherit opacity-80">
              Assine para ter mais recusros que te ajudem a alacançar suas metas
            </p>
            <div class="flex gap-3 mt-4">
              <Button size="small" class="!py-1 !px-4 h-8" to="/checkout?selectPlan=ouro&isYearly=false">
                Assinar plano
              </Button>
            </div>
          </div>

          <div class="pt-3">
            <NuxtLink @click="store.logout()" class="menu-item exit">
              <div class="grid mr-4 place-items-center">
                <Icon name="solar:exit-line-duotone" />
              </div>
              Sair
            </NuxtLink>
          </div>
        </div>
      </div>

      <div class="w-full h-screen full-page overflow-y-auto">
        <header class="p-0 w-full h-16 bg-card border-b-[2px] border-neutral-100 z-[99999] lg:hidden">
          <div class="container flex flex-col justify-center items-center h-full gap-2">
            <div class="flex justify-between items-center w-full relative gap-2 py-2">
              <Button
                tag="div"
                icon
                color="link"
                class="!p-1.5 h-10 w-10"
                :class="[hiddenSideBar ? '' : 'lg:hidden']"
                @click.native="showDrawer(true)"
              >
                <Icon name="solar:hamburger-menu-linear" />
              </Button>

              <Logo file="logo_horizontal.svg" size="24px" />

              <div class="justify-center items-center flex-grow"></div>

              <div class="flex justify-start items-center gap-2">
                <Button to="/" color="link" size="small" class="!py-1 pr-1">
                  <div class="hidden sm:flex">
                    {{ user.current.name }}
                  </div>
                  <img
                    class="rounded-full h-10 aspect-square object-cover"
                    loading="lazy"
                    :src="user.current.picture"
                    referrerpolicy="no-referrer"
                  />
                </Button>
              </div>
            </div>
          </div>

          <TransitionRoot as="template" :show="profileSideNav">
            <Dialog as="div" class="relative z-[99999]" @close="showDrawer(false)">
              <TransitionChild
                as="template"
                enter="ease-in-out duration-500"
                enter-from="opacity-0"
                enter-to="opacity-100"
                leave="ease-in-out duration-500"
                leave-from="opacity-100"
                leave-to="opacity-0"
              >
                <div class="fixed inset-0 bg-neutral-500 bg-opacity-75 transition-opacity" />
              </TransitionChild>

              <div class="fixed inset-0 overflow-hidden">
                <div class="absolute inset-0 overflow-hidden">
                  <div class="pointer-events-none fixed inset-y-0 left-0 flex max-w-full">
                    <TransitionChild
                      as="template"
                      enter="transform transition ease-in-out duration-500 sm:duration-700"
                      enter-from="-translate-x-full"
                      enter-to="translate-x-0"
                      leave="transform transition ease-in-out duration-500 sm:duration-700"
                      leave-from="translate-x-0"
                      leave-to="-translate-x-full"
                    >
                      <DialogPanel class="pointer-events-auto relative w-80">
                        <div class="flex h-full flex-col overflow-y-auto bg-card shadow-xl">
                          <div
                            class="relative flex h-full w-full flex-col p-4 text-neutral-700"
                            @click="showDrawer(false)"
                          >
                            <div class="flex items-center gap-4 pt-2 pb-4 px-4 mb-2">
                              <Logo file="logo_horizontal.svg" size="30px" />
                            </div>
                            <nav class="flex flex-col gap-1 p-2 font-sans text-base font-normal text-neutral-800">
                              <div>
                                <NuxtLink to="/profile" class="menu-item user">
                                  <img alt="" :src="currentUser.picture" class="size-8 rounded-full object-cover" />

                                  <div class="flex flex-col grow w-full">
                                    <div class="text-base leading-none font-semibold">{{ currentUser.name }}</div>
                                    <div class="text-xs truncate w-full">{{ currentUser.email }}</div>
                                  </div>
                                </NuxtLink>
                              </div>
                              <div v-for="(route, idx) in routesMenu" :key="idx">
                                <hr v-if="route == 'divider'" class="my-2 border-neutral-100" />
                                <NuxtLink v-else :to="route.path" class="menu-item">
                                  <div class="grid mr-4 place-items-center">
                                    <Icon :name="route.icon" />
                                  </div>
                                  {{ route.label }}

                                  <div class="grid ml-auto place-items-center justify-self-end">
                                    <div
                                      v-if="rout.badge && badgesPins[rout.badge] > 0"
                                      class="relative grid items-center px-2 py-1 font-sans text-xs font-bold uppercase rounded-full select-none whitespace-nowrap bg-primary-500/20 text-primary-900"
                                    >
                                      <span class="">{{ badgesPins[rout.badge] }}</span>
                                    </div>
                                  </div>
                                </NuxtLink>
                              </div>
                            </nav>

                            <div
                              v-if="user.current.plan == 'disabled'"
                              class="relative block w-full pl-4 pr-8 py-4 mt-auto text-base text-white bg-neutral-900 rounded-lg bg-gradient-to-br from-neutral-950 to-primary-800"
                            >
                              <Icon name="solar:crown-line-duotone" size="42px" class="stroke-1" />
                              <h6
                                class="block mb-1 text-base antialiased font-semibold leading-relaxed tracking-normal"
                              >
                                Assine o plano PRO
                              </h6>
                              <p class="block text-sm antialiased font-normal leading-normal text-inherit opacity-80">
                                Assine para ter mais recusros que te ajudem a alacançar suas metas
                              </p>
                              <div class="flex gap-3 mt-4">
                                <Button
                                  size="small"
                                  class="!py-1 !px-4 h-8"
                                  to="/checkout?selectPlan=ouro&isYearly=false"
                                >
                                  Assinar plano
                                </Button>
                              </div>
                            </div>

                            <div class="pt-3">
                              <NuxtLink to="/" @click="store.logout()" class="menu-item exit">
                                <div class="grid mr-4 place-items-center">
                                  <Icon name="solar:exit-line-duotone" />
                                </div>
                                Sair
                              </NuxtLink>
                            </div>
                          </div>
                        </div>
                      </DialogPanel>
                    </TransitionChild>
                  </div>
                </div>
              </div>
            </Dialog>
          </TransitionRoot>
        </header>
        <main class="w-auto pb-8 pt-10">
          <!--
          <div class="container" id="BreadcrumbsLayout">
            <Breadcrumbs />
          </div>
          -->
          <slot />
        </main>

        <div v-if="!hiddenFooter" class="mt-6 mb-4 border-t border-neutral-100 pt-8">
          <p class="text-center text-xs/relaxed text-neutral-500">
            © Stagemed 2023. Todos os direitos reservados

            <br />
            Desenvolvido por
            <a href="https://nocsistemas.com" target="_blank" rel="noopener noreferrer">Noc sistemas</a>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.profile-layout {
  .full-page {
    height: 100dvh;
  }
}
.menu-item.router-link-active,
.menu-item.router-link-exact-active {
  @apply bg-primary-200/50 text-primary-800;
}
.menu-item {
  @apply flex items-center w-full p-3 leading-tight transition-all rounded-lg outline-none text-start   active:bg-primary-50 active:bg-opacity-80 active:text-primary-900;
  &:hover {
    @apply bg-primary-50 bg-opacity-80 text-primary-900;
  }
  &.user {
    @apply p-2 gap-3 overflow-hidden items-center;
  }
  &.exit:hover {
    @apply bg-error-50 bg-opacity-80 text-error-900;
  }
}
</style>
