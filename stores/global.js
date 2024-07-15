export const useGlobalStore = defineStore("global", {
  state: () => ({
    loadApp: true,
    socialShareValues: {
      url: "https://dev-stagemed.onrender.com/",
      title: "Stagemed - Treine e Revalide sua residência",
      text: "Treine e Revalide sua residência",
    },
    networks: [],
    themes: [
      { value: "system", label: "Mesmo do sistema" },
      { value: "light", label: "Claro" },
      { value: "contrast", label: "Claro - contraste" },
      { value: "dark", label: "Escuro" },
      { value: "contrastdark", label: "Escuro -  contraste" },
    ],
    socialShareOpem: false,
    loadPage: false,
    options: {
      types: {
        an: "Anamnese",
        ef: "Exame Físico",
        lb: "Laboratório",
        im: "Imagem",
        dg: "Diagnóstico",
        cd: "Conduta",
      },
    },
  }),
  actions: {
    setLoadApp(status = false) {
      this.loadApp = status;
    },
    async socialShare(data) {
      var textDesc = data.text ? data.text.replace(/<[^>]+>/g, "") : "",
        shareData = {
          title: data.title,
          text: textDesc.length > 150 ? `${textDesc.substr(0, 147)}...` : textDesc,
          url: data.url,
        };

      if (navigator.canShare) {
        await navigator.share(shareData).catch((error) => console.error(error));
      } else {
        let defaultUrl = [
          {
            url: "https://www.facebook.com/sharer/sharer.php?u=CHANGE_URL&title=CHANGE_TITLE&description=CHANGE_DESCRIPTION",
            network: "facebook",
          },
          { url: "fb-messenger://share/?link=CHANGE_URL", network: "messenger" },
          { url: "https://api.whatsapp.com/send?text=CHANGE_URL%0D%0A-%0D%0ACHANGE_DESCRIPTION", network: "whatsapp" },
          {
            url: "https://t.me/share/url?url=CHANGE_URL&text=CHANGE_TITLE%0D%0ACHANGE_DESCRIPTION",
            network: "telegram",
          },
          {
            url: "https://twitter.com/intent/tweet?text=CHANGE_TITLE&url=CHANGE_URL&hashtags=@hCHANGE_TITLEu",
            network: "twitter",
          },
          { url: "https://www.linkedin.com/sharing/share-offsite/?url=CHANGE_URL", network: "linkedin" },
        ];

        let links = JSON.stringify(defaultUrl)
          .replace(/CHANGE_URL/g, shareData.url)
          .replace(/CHANGE_TITLE/g, shareData.title)
          .replace(/CHANGE_DESCRIPTION/g, shareData.text);
        links = JSON.parse(links);

        this.socialShareValues = shareData;
        this.networks = links;
        this.socialShareOpem = true;
      }
    },
    closeSocialShare() {
      this.socialShareOpem = false;
    },
    copyToClipboard(text) {
      if (navigator.clipboard) {
        navigator.clipboard.writeText(text);
      } else {
        var dummy = document.createElement("textarea");
        document.body.appendChild(dummy);
        dummy.value = text;
        dummy.select();
        document.execCommand("copy");
        document.body.removeChild(dummy);
      }
    },
  },
  getters: {
    socialShareView: (state) => state.socialShareValues,
    socialShareIsOpem: (state) => state.socialShareOpem,
    socialShareLinks: (state) => state.networks,
  },
});
