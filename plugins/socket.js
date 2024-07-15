import { io } from "socket.io-client";

const URL = "https://api.stagemed.com.br";

export const socket = io(URL);

socket.on("connect", () => {
  // state.connected = true;
});
socket.on("disconnect", () => {
  // state.connected = false;
});

export default defineNuxtPlugin((nuxtApp) => {
  useState("socket", () => socket);
});
