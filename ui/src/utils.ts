import { onCleanup, onMount } from "solid-js";

export function createReceiveNUI(
  handler: (data: any) => void
) {
  const eventListener = (event: any) => {
    handler(event);
  };
  onMount(() => window.addEventListener("message", eventListener));
  onCleanup(() => window.removeEventListener("message", eventListener));
}

export function createKeybind(keycode: string,
  handler: () => void
) {
  const eventListener = (event: KeyboardEvent) => {
    if(event.code !== keycode) return
    handler();
  };
  onMount(() => window.addEventListener("keydown", eventListener));
  onCleanup(() => window.removeEventListener("keydown", eventListener));
}