import { defineNuxtPlugin, useState } from "#app";

import ToastComponent from "../components/Toast/index.vue";
import { spawn } from "../components/utils";

const outerClasses = ["z-[150]", "fixed", "inset-0", "flex", "sm:items-start", "px-4", "py-6", "pointer-events-none", "sm:p-6"];
const innerClasses = ["w-full", "flex", "flex-col-reverse", "items-center", "sm:items-end", "sm:justify-end"];
const elClasses = ["w-full", "max-w-sm", "mt-4"];

class ToastClass {
  constructor() {
    const outer = document.createElement("div");
    outerClasses.forEach((c) => outer.classList.add(c));
    outer.setAttribute("aria-live", "assertive");
    const inner = document.createElement("div");
    innerClasses.forEach((c) => inner.classList.add(c));
    inner.setAttribute("id", "toasts");
    outer.appendChild(inner);
    document.body.appendChild(outer);
  }

  show(props) {
    if (typeof props === "string") props = { message: props };
    if (props === undefined) return;
    return spawn("toasts", props, ToastComponent, elClasses);
  }
  success(body) {
    let options = { type: "success" };
    if (typeof body == "string") options.message = body;
    else options = { ...options, ...body };

    return spawn("toasts", options, ToastComponent, elClasses);
  }
  info(body) {
    let options = { type: "info" };
    if (typeof body == "string") options.message = body;
    else options = { ...options, ...body };

    return spawn("toasts", options, ToastComponent, elClasses);
  }
  error(body) {
    let options = { type: "danger" };
    if (typeof body == "string") options.message = body;
    else options = { ...options, ...body };

    return spawn("toasts", options, ToastComponent, elClasses);
  }
  warning(body) {
    let options = { type: "warning" };
    if (typeof body == "string") options.message = body;
    else options = { ...options, ...body };

    return spawn("toasts", options, ToastComponent, elClasses);
  }
  denied(body) {
    let options = { type: "denied" };
    if (typeof body == "string") options.message = body;
    else options = { ...options, ...body };

    return spawn("toasts", options, ToastComponent, elClasses);
  }

  callToRoom(body) {
    let options = { type: "callToRoom", extra: body };

    return spawn("toasts", options, ToastComponent, elClasses);
  }

  chat(body) {
    let options = { type: "chat", extra: body };

    return spawn("toasts", options, ToastComponent, elClasses);
  }
}

export const Toast = new ToastClass();

export default defineNuxtPlugin((nuxtApp) => {
  useState("toast", () => new ToastClass());
});
