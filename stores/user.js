import {
  sendPasswordResetEmail,
  getAuth,
  setPersistence,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  browserLocalPersistence,
  deleteUser,
  getIdToken,
} from "firebase/auth";
import AuthService from "../services/auth.service";
import { path, exclude, post, get } from "@/services/api.service";
import dayjs from "dayjs";

export const useUserStore = defineStore("user", {
  state: () => ({
    current: {},
    locale: [],
    loadingUser: true,
    loggedIn: false,
    webToken: null,
    expireAccessToken: null,
    accessToken: null,
    notificationsChats: { total: 0, chats: {} },
  }),
  actions: {
    generateToken(forceChange = false) {
      var token = Math.random().toString(36).substr(2);

      if (this.current.uid) this.webToken = this.current.uid;
      if (!this.webToken || forceChange) this.webToken = token;
    },
    async getAccessToken(force = false) {
      if (!this.expireAccessToken) this.expireAccessToken = dayjs();

      let exprireTime = dayjs().diff(dayjs(this.expireAccessToken), "minute");

      if (!this.accessToken || exprireTime > 10 || force) {
        const auth = getAuth();
        const user = auth.currentUser;
        if (user) {
          this.expireAccessToken = dayjs();
          this.accessToken = await getIdToken(auth.currentUser, true);
        }
      }
      return Promise.resolve(this.accessToken);
    },

    async post(url, data) {
      let token = await this.getAccessToken();
      return new Promise((resolve, reject) => {
        post(url, data, token)
          .then((result) => {
            resolve(result);
          })
          .catch((err) => {
            reject(err);
          });
      });
    },
    async path(url, data) {
      let token = await this.getAccessToken();
      return new Promise((resolve, reject) => {
        path(url, data, token)
          .then((result) => {
            resolve(result);
          })
          .catch((err) => {
            reject(err);
          });
      });
    },
    async get(url, data = null) {
      let token = await this.getAccessToken();
      return new Promise((resolve, reject) => {
        get(url, data, token)
          .then((result) => {
            resolve(result);
          })
          .catch((err) => {
            reject(err);
          });
      });
    },

    async update(data) {
      let token = await this.getAccessToken();
      await path(`users/${this.current.uid}`, data, token);
      this.fetchUser();
    },
    async exclude(type = "all", data = {}) {
      let token = await this.getAccessToken();

      let urls = {
        all: `users/${this.current.uid}`,
        personal: `users/${this.current.uid}/data`,
        contacts: `users/${this.current.uid}/contacts`,
        address: ` users/${this.current.uid}/address`,
        product: `products/${data.id}`,
        products: `products/all/${this.current.uid}`,
      };

      await exclude(urls[type], token);

      if (type == "all") {
        const auth = getAuth();
        const user = auth.currentUser;

        var credential = null;
        if (data.provider == "password") {
          credential = await this.login(data.action);
          credential.providerId = "password";
        } else {
          credential = await this.loginGoogle(false);
        }

        reauthenticateWithCredential(user, credential)
          .then(() => {
            deleteUser(user).catch((error) => {
              console.error(error);
            });
          })
          .catch((error) => {
            console.error(error);
          });
        this.logout();
      } else this.fetchUser();
    },
    async getUserLocale() {
      //var geolocation = null;
      // await navigator.geolocation.getCurrentPosition(
      // (position) => {
      //   geolocation = position.coords;
      // },
      // (error) => {
      //   console.error(error.message);
      // }
      // );
      // var data = await axios
      // .get(`https://api.bigdatacloud.net/data/reverse-geocode-client?localityLanguage=pt`)
      // .then(function (response) {
      //   return response.data;
      // })
      // .catch(function (error) {
      //   console.error(error);
      // });
      //
      // data.geolocationIsPermited = geolocation ? true : false;
      //
      // if (data.geolocationIsPermited) {
      // data.latitude = geolocation.latitude;
      // data.longitude = geolocation.longitude;
      // }
      // this.locale = geolocation
    },

    async login(user) {
      const auth = getAuth();
      var persistence = browserLocalPersistence;

      setPersistence(auth, persistence);

      return signInWithEmailAndPassword(auth, user.email, user.pass)
        .then(async (currentUser) => {
          this.current = { ...this.current, ...currentUser.user };
          await this.fetchUser(this.current);
          return currentUser.user;
        })
        .catch((error) => {
          this.logout();
          return Promise.reject(error);
        });
    },
    async loginGoogle(sync = true) {
      const auth = getAuth();

      const provider = new GoogleAuthProvider();
      var persistence = browserLocalPersistence;
      setPersistence(auth, persistence);

      return await signInWithPopup(auth, provider)
        .then(async (result) => {
          const credential = GoogleAuthProvider.credentialFromResult(result);
          this.current = { ...this.current, ...result.user };
          if (sync) await this.fetchUser(this.current);
          return credential;
        })
        .catch((error) => {
          this.logout();
          return Promise.reject(error);
        });
    },

    async registerGoogle(sync = true) {
      const auth = getAuth();

      const provider = new GoogleAuthProvider();
      var persistence = browserLocalPersistence;
      setPersistence(auth, persistence);

      return await signInWithPopup(auth, provider)
        .then(async (result) => {
          const credential = GoogleAuthProvider.credentialFromResult(result);
          this.current = { ...this.current, ...result.user };
          if (sync) await this.fetchUser(this.current);
          return credential;
        })
        .catch((error) => {
          this.logout();
          return Promise.reject(error);
        });
    },
    async register(user) {
      const auth = getAuth();
      var persistence = browserLocalPersistence;
      setPersistence(auth, persistence);

      return await createUserWithEmailAndPassword(auth, user.email, user.pass)
        .then(async (userCredential) => {
          var userCheck = { ...userCredential.user, ...user };

          await AuthService.setUser(userCheck);
          return Promise.resolve(true);
        })
        .catch((error) => {
          this.logout();
          return Promise.reject(error);
        });
    },

    async resetPassword(email) {
      const auth = getAuth();

      await sendPasswordResetEmail(auth, email)
        .then(
          (res) => {
            return Promise.resolve(res);
          },
          (error) => {
            return Promise.reject(error);
          }
        )
        .catch((error) => {
          return Promise.reject(error);
        });
    },

    async fetchUser(user = null, create = true) {
      if ((this.accessToken && (this.current._id || this.current.uid)) || (user.accessToken && user.uid)) {
        const auth = getAuth();
        let token = await this.getAccessToken();

        let userLoad = await AuthService.checkUser(
          user || { uid: this.current._id || this.current.uid, accessToken: token },
          create
        );

        this.current = {
          ...this.current,
          ...userLoad,
          ..._Pick(auth.currentUser, "providerData", "uid"),
        };

        this.loggedIn = true;
        this.accessToken = token;
        this.loadingUser = false;

        return Promise.resolve(true);
      }
      return Promise.reject(false);
    },

    async getChatsPin() {
      let chats = await this.get("users/chats/pin");
      this.notificationsChats = chats.data.chats;
    },

    logout() {
      const auth = getAuth();
      auth.signOut();

      const router = useRouter();

      this.loggedIn = false;
      this.loadingUser = false;
      this.current = {};
      this.expireAccessToken = null;
      this.accessToken = null;

      router.push("/auth/login");
    },
    noUser() {
      this.loggedIn = false;
      this.loadingUser = false;
      this.current = {};
      this.expireAccessToken = null;
      this.accessToken = null;
    },
  },
  getters: {
    currentUser: (state) => state.current,
    userLocale: (state) => state.locale,
    isLoggedIn: (state) => state.loggedIn,
    isLoadingUser: (state) => state.loadingUser,
    getNotificationsChat: (state) => state.notificationsChats,
  },
  persist: [
    {
      paths: ["locale", "loadingUser", "current"],
      storage: persistedState.localStorage,
    },
    {
      paths: [
        "loggedIn",
        "expireAccessToken",
        "accessToken",
        "current.uid",
        "current.picture",
        "current.name",
        "current.emailVerified",
        "current.account",
      ],
      storage: persistedState.cookiesWithOptions({
        sameSite: "strict",
      }),
    },
  ],
});
