declare global {
  interface Window {
    _keys: Map<string, boolean>;
    KeysPreventDefault: boolean;
  }
}

export default function setup(preventDefault = false, context = window) {
  context._keys = new Map();

  function setKeysPressed(e: KeyboardEvent, isPressed: boolean) {
    if (e.metaKey || e.ctrlKey || e.altKey) {
      return;
    }

    if (preventDefault) {
      e.preventDefault();
    }

    context._keys.set(e.key, isPressed);
  }

  context.addEventListener("keydown", e => {
    setKeysPressed(e, true);
  });

  context.addEventListener("keyup", e => {
    setKeysPressed(e, false);
  });
}
