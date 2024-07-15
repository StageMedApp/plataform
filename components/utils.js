import { createApp, defineComponent } from "vue";

export function removeElement(el) {
  if (!el) return;
  el.parentNode.remove();
}

// add the component w/ the specified props
export function spawn(id, props, Component, classes) {
  const el = document.createElement("div");
  if (classes) classes.forEach((c) => el.classList.add(c));
  return createApp(defineComponent(Component), props).mount(document?.getElementById(id)?.appendChild(el));
}
