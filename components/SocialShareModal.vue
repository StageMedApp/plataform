<template>
  <div class="social-modal">
    <div class="header">
      <span>Compartilhe</span>
      <div class="close" @click="global.closeSocialShare()">CLOSE</div>
    </div>
    <div class="content">
      <p>Compartilhe usando uma rede social</p>
      <div class="icons">
        <a
          v-for="link in socialShareLinks"
          :href="link.url"
          :key="link.network"
          :class="[link.network]"
          target="_blank"
          rel="noopener noreferrer"
        >
          <!--
          <Whatsapp v-if="link.network == 'whatsapp'" />
            <Telegram v-if="link.network == 'telegram'" />
            <Facebook v-if="link.network == 'facebook'" />
            <Twitter v-if="link.network == 'twitter'" />
            <Linkedin v-if="link.network == 'linkedin'" />
            <FacebookMessenger v-if="link.network == 'messenger'" />
            -->
        </a>
      </div>
      <p>Ou copie o link</p>
      <div class="field">
        <input type="text" readonly :value="socialShareView.url" />
        <button @click="copy(socialShareView.url)">Copiar</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useGlobalStore } from "~~/stores/global";

const global = useGlobalStore();
const Toast = useState("toast").value;
const socialShareView = computed(() => global.socialShareValues);
const socialShareLinks = computed(() => global.networks);

function copy(value) {
  global.copyToClipboard(value);
  Toast.success("Link copiado!!");
}
</script>

<style lang="scss">
.social-modal {
  z-index: 99999 !important;
  position: fixed;
  bottom: 0;
  left: 50%;
  background: var(--color-body);
  padding: 25px;
  border-radius: 16px 16px 0 0;
  max-width: 380px;
  width: 100%;
  box-shadow: 0px 0px 24px rgba(0, 0, 0, 0.1);
  transform: translateX(-50%);
  transition: all 0.35s;

  @media screen and (max-width: 780px) {
    max-width: 100vw;
    width: 100vw;
  }
}

.social-modal :is(.header, .icons, .field) {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.social-modal .header {
  padding-bottom: 15px;
  border-bottom: 1px solid rgba(var(--color-rgb-medium), 0.5);
}
.header span {
  font-size: 21px;
  font-weight: 600;
}
.header .close,
.icons a {
  display: flex;
  align-items: center;
  border-radius: 50%;
  justify-content: center;
  transition: all 0.3s ease-in-out;
}
.header .close {
  color: var(--color-neutral-300);
  font-size: 16px;
  height: 32px;
  width: 32px;
  cursor: pointer;
}
.header .close:hover {
  background: var(--color-neutral-100);
  color: var(--color-neutral-400);
}
.social-modal .content {
  margin: 20px 0;
}
.social-modal .icons {
  margin: 15px 0 20px 0;
}
.content p {
  font-size: 16px;
}
.content .icons a {
  height: 48px;
  width: 48px;
  font-size: 16px;
  text-decoration: none;
  border: 1px solid transparent;
}
.icons a i {
  transition: transform 0.3s ease-in-out;
}

.icons a.facebook {
  color: #1877f2;
  border-color: #b7d4fb;
}
.icons a.facebook:hover {
  background: #1877f2;
}
.icons a.twitter {
  color: #46c1f6;
  border-color: #b6e7fc;
}
.icons a.twitter:hover {
  background: #46c1f6;
}
.icons a.whatsapp {
  color: #25d366;
  border-color: #b7f2cd;
}
.icons a.whatsapp:hover {
  background: #25d366;
}
.icons a.telegram {
  color: #0088cc;
  border-color: #aae3ff;
}
.icons a.telegram:hover {
  background: #0088cc;
}
.icons a.linkedin {
  color: #0a66c2;
  border-color: #aed4fb;
}
.icons a.linkedin:hover {
  background: #0a66c2;
}
.icons a.messenger {
  color: #0099ff;
  border-color: #aaddff;
}
.icons a.messenger:hover {
  background: #0099ff;
}
.icons a:hover {
  color: var(--color-light);
  border-color: transparent;
}
.icons a:hover i {
  transform: scale(1.2);
}
.content .field {
  margin: 12px 0 0;
  height: 48px;
  border-radius: 6px;
  padding: 0 6px;
  border: 1px solid rgba(var(--color-rgb-medium), 0.5);
  background: rgba(var(--color-rgb-medium), 0.05);
}

.field input {
  width: 100%;
  height: 100%;
  border: none;
  outline: none;
  font-size: 1em;
  background: none;
  color: var(--color-dark);
  cursor: inherit;
}
.field button {
  color: #fff;
  padding: 5px 12px;
  background: rgba(var(--color-rgb-secondary), 0.8);
  border: none;
  border-radius: 4px;
  height: 36px;
  transition: all 0.35s;
  cursor: pointer;
}
.field button:hover {
  background: rgba(var(--color-rgb-secondary), 1);
}
</style>
