<template>
  <div class="dropzone-wrapper" :class="[mode, loading && 'cursor-wait']">
    <div v-if="mode != 'profileButonTiny'">
      <SvgoCamera v-if="mode != 'certificate'" class="text-primary text-2xl" />
      <SvgoFile v-if="mode == 'certificate'" class="text-primary text-2xl" />
    </div>

    <p v-if="mode != 'profileButonTiny'">{{ uploadText }}</p>
    <Button v-else tag="div" size="tinyLink" color="secondary" block>{{ uploadText }}</Button>

    <div v-if="loading && mode == 'picture'" class="load-card"></div>
    <progress v-if="loading && mode != 'picture'" class="d-progress w-full h-1 absolute bottom-0 left-0"></progress>

    <input type="file" ref="file" @change="loadImage($event)" accept="image/*" class="dropzone" :disabled="loading" />
  </div>

  <ModalCropper :show="showModal" @close="reset">
    <cropper ref="cropper" class="upload-cropper" :src="image.src" :stencil-props="settingsOptions" />

    <div class="flex items-center justify-between p-4 h-20">
      <div class="flex items-center gap-2">
        <Button icon color="linkWhite" @click="flip(true, false)"> <Icon name="fluent:flip-horizontal-24-regular" /> </Button>
        <Button icon color="linkWhite" @click="flip(false, true)"> <Icon name="fluent:flip-vertical-24-regular" /></Button>
        <Button icon color="linkWhite" @click="rotate(90)"> <Icon name="fluent:arrow-rotate-clockwise-24-regular" /> </Button>
        <Button icon color="linkWhite" @click="rotate(-90)"> <Icon name="fluent:arrow-rotate-counterclockwise-24-regular" /> </Button>
      </div>
      <div class="right">
        <Button color="linkWhite" @click="crop()">Salvar</Button>
      </div>
    </div>
  </ModalCropper>
</template>

<script>
/* eslint-disable */
import { Cropper } from "vue-advanced-cropper";
import { compressFile, mediumFile, minimalFile } from "@/services/image.service";
import "vue-advanced-cropper/dist/style.css";
import "vue-advanced-cropper/dist/theme.compact.css";

export default {
  components: {
    Cropper,
  },
  props: {
    mode: {
      type: String,
      default: "",
    },
    loading: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      image: {
        src: null,
        type: null,
      },
      showModal: false,
    };
  },
  methods: {
    flip(x, y) {
      if (this.$refs.cropper.imageTransforms.rotate % 180 !== 0) {
        this.$refs.cropper.flip(!x, !y);
      } else {
        this.$refs.cropper.flip(x, y);
      }
    },
    rotate(angle) {
      this.$refs.cropper.rotate(angle);
    },
    crop() {
      const { canvas } = this.$refs.cropper.getResult();
      canvas.toBlob(async (blob) => {
        var norImg = await compressFile([blob], this.mode.startsWith("profile"));
        var medImg = await mediumFile([blob], this.mode.startsWith("profile"));
        var minImg = await minimalFile([blob], this.mode.startsWith("profile"));

        norImg.name = this.image.name;
        medImg.name = this.image.name;
        minImg.name = this.image.name;

        var images = {
          normal: norImg,
          medium: medImg,
          small: minImg,
        };

        this.$emit("saveCrop", images);
        this.showModal = false;
        this.reset();
      });
    },
    reset() {
      this.showModal = false;
      this.image = {
        src: null,
        type: null,
      };

      if (this.image.src) {
        URL.revokeObjectURL(this.image.src);
      }
    },

    loadImage(event) {
      const { files } = event.target;

      if (files && files[0]) {
        if (this.image.src) {
          this.reset();
        }
        const blob = URL.createObjectURL(files[0]);

        const reader = new FileReader();
        reader.onload = (e) => {
          this.image = {
            name: this.removeExtension(files[0].name),
            src: blob,
            type: "image/webp",
          };
        };

        reader.readAsArrayBuffer(files[0]);
        this.showModal = true;
      }
    },
    removeExtension(filename) {
      var lastDotPosition = filename.lastIndexOf(".");
      if (lastDotPosition === -1) return filename;
      else return filename.substr(0, lastDotPosition);
    },
  },
  computed: {
    uploadText() {
      if (this.mode == "profileCard") return "Escolher foto para perfil";
      if (this.mode == "profile") return "";
      if (this.mode == "profileButonTiny") return "Alterar foto";
      if (this.mode == "certificate") return "Clique aqui ou arraste um arquivo para fazer upload do seu certificado";
      return "Adicionar fotos";
    },
    settingsOptions() {
      let settings = {};

      if (this.mode == "coverUpload") settings.aspectRatio = 1280 / 400;
      if (this.mode.startsWith("profile")) settings.aspectRatio = 1;

      return settings;
    },
  },
  unmounted() {
    if (this.image.src) {
      this.reset();
    }
  },
};
</script>

<style lang="scss">
.n-modal-container {
  z-index: 100 !important;
}

.upload-cropper {
  width: 100% !important;
  height: calc(100% - 80px) !important;
  overflow: hidden;
  flex-grow: 1;
}

.dropzone-wrapper {
  @apply relative rounded-md border-dashed border-2 border-neutral-200 flex flex-col justify-center items-center h-40 w-full text-center p-10 text-neutral-600 overflow-hidden;
  transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);

  &.profileButonTiny {
    height: 100%;
    width: 100%;
    padding: 0;
    gap: 0;
    border: none;
    cursor: pointer !important;
  }

  &.minCertificate,
  &.profile {
    height: 100%;
    width: 100%;
    padding: 0;
    gap: 0;
    border: none;
    background: #0d0d0d0c;
    cursor: pointer;
    p {
      display: none;
    }
    &:hover {
      background: #0d0d0d85;
      border: none;
      i {
        zoom: 1.2;
      }
    }
  }

  &.coverUpload {
    height: 35px;
    width: 35px;
    padding: 0;
    gap: 0;
    border: none;
    background: transparent;
    cursor: pointer;
    i {
      cursor: pointer;
      color: var(--color-medium);
    }
    p {
      display: none;
    }
    &:hover {
      border: 1px dashed var(--color-medium);
    }
  }
  &.disabled,
  &.disabled:hover {
    background: rgba(var(--color-rbg-gray-200), 0.5);
    border: 1px dashed rgba(var(--color-rbg-light), 0.5);
    opacity: 0.5;
    input {
      cursor: wait;
    }
  }
  input {
    position: absolute;
    outline: none !important;
    width: 100%;
    height: 100%;
    cursor: pointer !important;
    opacity: 0;
  }
  &:hover {
    @apply border-primary-400 bg-primary-50;
  }
}

.dropzone-wrapper.profile .load,
.dropzone-wrapper.coverUpload .load {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
