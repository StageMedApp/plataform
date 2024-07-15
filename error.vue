<script setup></script>

<template>
  <NuxtLayout name="404">
    <section class="bg-white">
      <div class="container min-h-screen px-6 py-12 mx-auto lg:flex lg:items-center lg:gap-12">
        <div class="wf-ull lg:w-1/2">
          <p class="text-sm font-medium text-primary-500">404 erro</p>
          <h1 class="mt-3 text-2xl font-semibold text-neutral-800">Página não encontrada</h1>
          <p class="mt-4 text-neutral-500">Não conseguimos encontrar a página procurada</p>

          <div class="flex items-center mt-6 gap-x-3">
            <Button> <Icon name="solar:arrow-left-line-duotone" color="link"> </Icon> Voltar </Button>
            <Button to="/"> Ir para o início </Button>
          </div>
        </div>

        <div class="relative w-full mt-12 lg:w-1/2 lg:mt-0">
          <img class="w-full max-w-lg lg:mx-auto" src="/images/errors/404.svg" alt="" />
        </div>
      </div></section
  ></NuxtLayout>
</template>
