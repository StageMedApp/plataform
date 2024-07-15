<template>
  <div
    class="banner-conatiner"
    :style="{
      background: bannerData.options?.background
        ? 'transparent'
        : `linear-gradient(${bannerData.colors?.direction}deg, ${bannerData.colors?.from}, ${bannerData.colors?.to})`,
    }"
  >
    <div
      class="banner-background"
      v-if="bannerData.options?.background"
      :style="`background-image: linear-gradient(250deg, #12112700 20%, #121127), url(${bannerData.options?.background}`"
    />
    <div
      class="banner-left"
      :style="{ color: bannerData.colors?.text || '#fff' }"
      :class="{ 'text-shadow': bannerData.options?.textShadow, 'align-center': bannerData.options?.align == 'center' }"
    >
      <div class="banner-left-top">
        <div v-if="bannerData.title" class="banner-title">{{ bannerData.title }}</div>
        <div v-if="bannerData.description" class="banner-subtitle text-balance">{{ bannerData.description }}</div>
      </div>
      <div v-if="bannerData.options?.link" class="banner-left-bot">
        <Button
          v-if="bannerData.options?.button"
          size="small"
          :color="bannerData.options?.button?.color || 'primary'"
          :rounded="bannerData.options?.button?.rounded || false"
          :to="bannerData.options?.link"
        >
          {{ bannerData.options?.button?.text || "Leia mais" }}
        </Button>
        <Button v-else size="small" :to="bannerData.options?.link"> Leia mais </Button>
      </div>
    </div>
    <div
      v-if="bannerData.options?.image"
      class="banner-right"
      :class="{
        padding: bannerData.options?.padding,
        book: bannerData.options?.link?.includes('/book/'),
        shadow: bannerData.options?.shadow,
      }"
    >
      <img loading="lazy" v-if="bannerData.options.image" v-lazy="bannerData.options.image" />
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  bannerData: {
    type: Object,
  },
});
</script>

<style lang="scss" scoped>
.banner-conatiner {
  height: 100%;
  width: 100%;
  border-radius: 12px;
  overflow: hidden;
  position: relative;
  display: grid;
  grid-template-columns: 1fr auto;
  .banner-background {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-size: cover;
    background-repeat: no-repeat;
    background-position: center right;
    opacity: 1;
  }
  .banner-left {
    padding: 12px 16px;
    width: auto;
    display: flex;
    align-items: stretch;
    justify-content: center;
    flex-flow: column nowrap;
    transition: all 0.25s;
    z-index: 10;
    &.text-shadow {
      background-image: linear-gradient(to right, #222d, #2220);
    }
    &.align-center {
      text-align: center;
    }
    .banner-left-bot {
      margin: 14px auto 0px;
      display: flex;
      justify-content: center;
      align-items: center;
      width: 100%;
    }
    .banner-title {
      font-size: 1.75em;
      font-weight: 600;
      margin-bottom: 6px;
      line-height: 110%;
      letter-spacing: 1px;
    }
    .banner-subtitle {
      font-size: 1em;
      font-weight: 400;
      opacity: 0.8;
      line-height: 140%;
      letter-spacing: 1px;
    }
    @media only screen and (min-width: 780px) {
      padding: 24px;
      .banner-title {
        font-size: 2.05em;
        font-weight: 700;
      }
      .banner-subtitle {
        font-size: 1.15em;
      }
    }
    @media only screen and (min-width: 1024px) {
      padding: 32px;
      .banner-title {
        font-size: 2.5em;
      }
      .banner-subtitle {
        font-size: 1.3em;
      }
    }
  }
  .banner-right {
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    max-height: 170px;
    @media only screen and (min-width: 780px) {
      max-height: 230px;
    }
    @media only screen and (min-width: 1024px) {
      max-height: 290px;
    }

    &.padding {
      padding: 1.5em;
    }
    &.shadow {
      img {
        filter: drop-shadow(
          0px 0px 1.1px rgba(0, 0, 0, 0.017),
          0px 0px 2.7px rgba(0, 0, 0, 0.024),
          0px 0px 5px rgba(0, 0, 0, 0.03),
          0px 0px 8.9px rgba(0, 0, 0, 0.036),
          0px 0px 16.7px rgba(0, 0, 0, 0.043),
          0px 0px 40px rgba(0, 0, 0, 0.06)
        );
      }
    }
    &.book {
      padding: 1.25em 1.25em 1.25em 1.5em;
      height: 100%;
      img {
        width: auto;
        border-radius: 8px;
        aspect-ratio: 5.5/8.5;
        margin-bottom: -2px;
      }
    }
    img {
      height: 100%;
      object-fit: cover;
    }
  }
}
</style>
