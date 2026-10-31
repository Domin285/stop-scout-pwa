import type { Directive } from "vue";

export const vDelayHighlight: Directive = {
  mounted(el, binding) {
    applyDelayColor(el, binding.value);
  },

  updated(el, binding) {
    applyDelayColor(el, binding.value);
  },
};

function applyDelayColor(el: HTMLElement, delay: number | null | undefined) {
  el.classList.remove(
    "text-red-400",
    "text-yellow-300",
    "text-green-400",
    "text-blue-400",
    "text-gray-400",
  );

  if (delay === null || delay === undefined) {
    el.classList.add("text-gray-400");
    return;
  }

  if (delay < 0) {
    el.classList.add("text-blue-400");
    return;
  }

  if (delay === 0) {
    el.classList.add("text-green-400");
    return;
  }

  if (delay <= 120) {
    el.classList.add("text-yellow-300");
    return;
  }

  el.classList.add("text-red-400");
}
