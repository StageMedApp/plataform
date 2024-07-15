import { get } from "../services/api.service";
import { useUserStore } from "./user";

export const useNotificationStore = defineStore("notification", {
  state: () => ({
    user_id: true,
    notifications: [],
    loading: false,
    hasNotRead: false,
  }),
  actions: {
    async loadNotifications() {
      this.loading = true;

      const store = useUserStore();
      let token = await store.getAccessToken();

      await get("notifications", {}, token)
        .then((result) => {
          this.notifications = result.data.results;

          this.notifications.forEach((element) => {
            if (!element.read_at) this.hasNotRead = true;
          });

          this.user_id = result.data.user_id;
          this.loading = false;
        })
        .catch((err) => {
          console.error(err);
          this.loading = false;
        });
    },

    async viewNotification(id, hidden = false) {
      this.loading = true;

      const store = useUserStore();
      let token = await store.getAccessToken();

      await get(`notifications/${hidden ? "hidden" : "view"}/${id}`, {}, token)
        .then((result) => {
          this.loadNotifications();
          this.loading = false;
        })
        .catch((err) => {
          console.error(err);
          this.loading = false;
        });
    },
  },
  getters: {
    getNotifications: (state) => state.notifications,
    isLoading: (state) => state.loading,
    showPulse: (state) => state.hasNotRead,
  },
  persist: [
    {
      paths: ["notifications"],
      storage: persistedState.localStorage,
    },
  ],
});
