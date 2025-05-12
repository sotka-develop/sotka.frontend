import { ref, onMounted, onUnmounted } from 'vue';

export function useKeyPressed() {
  const shiftPressed = ref(false);
  const ctrlPressed = ref(false);

  function checkKeyDown(event) {
    shiftPressed.value = event.key === 'Shift';
    ctrlPressed.value = event.key === 'Control';
  }

  function checkKeyUp(event) {
    shiftPressed.value &&= event.key !== 'Shift';
    ctrlPressed.value &&= event.key !== 'Control';
  }

  onMounted(() => document.addEventListener('keydown', checkKeyDown));
  onMounted(() => document.addEventListener('keyup', checkKeyUp));
  onUnmounted(() => document.removeEventListener('keydown', checkKeyDown));
  onUnmounted(() => document.removeEventListener('keyup', checkKeyUp));

  return { shiftPressed, ctrlPressed };
}
