export const keyCodes = {
  CANCEL: 3,
  HELP: 6,
  BACK_SPACE: 8,
  TAB: 9,
  CLEAR: 12,
  RETURN: 13,
  ENTER: 14,
  SHIFT: 16,
  CONTROL: 17,
  ALT: 18,
  PAUSE: 19,
  CAPS_LOCK: 20,
  ESCAPE: 27,
  SPACE: 32,
  PAGE_UP: 33,
  PAGE_DOWN: 34,
  END: 35,
  HOME: 36,
  LEFT: 37,
  UP: 38,
  RIGHT: 39,
  DOWN: 40,
  PRINTSCREEN: 44,
  INSERT: 45,
  DELETE: 46,
  NUM_0: 48,
  NUM_1: 49,
  NUM_2: 50,
  NUM_3: 51,
  NUM_4: 52,
  NUM_5: 53,
  NUM_6: 54,
  NUM_7: 55,
  NUM_8: 56,
  NUM_9: 57,
  SEMICOLON: 59,
  EQUALS: 61,
  A: 65,
  B: 66,
  C: 67,
  D: 68,
  E: 69,
  F: 70,
  G: 71,
  H: 72,
  I: 73,
  J: 74,
  K: 75,
  L: 76,
  M: 77,
  N: 78,
  O: 79,
  P: 80,
  Q: 81,
  R: 82,
  S: 83,
  T: 84,
  U: 85,
  V: 86,
  W: 87,
  X: 88,
  Y: 89,
  Z: 90,
  CONTEXT_MENU: 93,
  NUMPAD_0: 96,
  NUMPAD_1: 97,
  NUMPAD_2: 98,
  NUMPAD_3: 99,
  NUMPAD_4: 100,
  NUMPAD_5: 101,
  NUMPAD_6: 102,
  NUMPAD_7: 103,
  NUMPAD_8: 104,
  NUMPAD_9: 105,
  MULTIPLY: 106,
  ADD: 107,
  SEPARATOR: 108,
  SUBTRACT: 109,
  DECIMAL: 110,
  DIVIDE: 111,
  /*F1: 112,
    F2: 113,
    F3: 114,
    F4: 115,
    F5: 116,
    F6: 117,
    F7: 118,
    F8: 119,
    F9: 120,
    F10: 121,
    F11: 122,
    F12: 123,
    F13: 124,
    F14: 125,
    F15: 126,
    F16: 127,
    F17: 128,
    F18: 129,
    F19: 130,
    F20: 131,
    F21: 132,
    F22: 133,
    F23: 134,
    F24: 135,*/
  NUM_LOCK: 144,
  SCROLL_LOCK: 145,
  COMMA: 188,
  PERIOD: 190,
  SLASH: 191,
  BACK_QUOTE: 192,
  OPEN_BRACKET: 219,
  BACK_SLASH: 220,
  CLOSE_BRACKET: 221,
  QUOTE: 222,
  META: 224,
}

export const keyNames = {
  3: "CANCEL",
  6: "HELP",
  8: "BACK_SPACE",
  9: "TAB",
  12: "CLEAR",
  13: "RETURN",
  14: "ENTER",
  16: "SHIFT",
  17: "CONTROL",
  18: "ALT",
  19: "PAUSE",
  20: "CAPS_LOCK",
  27: "ESCAPE",
  32: "SPACE",
  33: "PAGE_UP",
  34: "PAGE_DOWN",
  35: "END",
  36: "HOME",
  37: "LEFT",
  38: "UP",
  39: "RIGHT",
  40: "DOWN",
  44: "PRINTSCREEN",
  45: "INSERT",
  46: "DELETE",
  48: "NUM_0",
  49: "NUM_1",
  50: "NUM_2",
  51: "NUM_3",
  52: "NUM_4",
  53: "NUM_5",
  54: "NUM_6",
  55: "NUM_7",
  56: "NUM_8",
  57: "NUM_9",
  59: "SEMICOLON",
  61: "EQUALS",
  65: "A",
  66: "B",
  67: "C",
  68: "D",
  69: "E",
  70: "F",
  71: "G",
  72: "H",
  73: "I",
  74: "J",
  75: "K",
  76: "L",
  77: "M",
  78: "N",
  79: "O",
  80: "P",
  81: "Q",
  82: "R",
  83: "S",
  84: "T",
  85: "U",
  86: "V",
  87: "W",
  88: "X",
  89: "Y",
  90: "Z",
  93: "CONTEXT_MENU",
  96: "NUMPAD_0",
  97: "NUMPAD_1",
  98: "NUMPAD_2",
  99: "NUMPAD_3",
  100: "NUMPAD_4",
  101: "NUMPAD_5",
  102: "NUMPAD_6",
  103: "NUMPAD_7",
  104: "NUMPAD_8",
  105: "NUMPAD_9",
  106: "MULTIPLY",
  107: "ADD",
  108: "SEPARATOR",
  109: "SUBTRACT",
  110: "DECIMAL",
  111: "DIVIDE",
  /*112: "F1",
    113: "F2",
    114: "F3",
    115: "F4",
    116: "F5",
    117: "F6",
    118: "F7",
    119: "F8",
    120: "F9",
    121: "F10",
    122: "F11",
    123: "F12",
    124: "F13",
    125: "F14",
    126: "F15",
    127: "F16",
    128: "F17",
    129: "F18",
    130: "F19",
    131: "F20",
    132: "F21",
    133: "F22",
    134: "F23",
    135: "F24",*/
  144: "NUM_LOCK",
  145: "SCROLL_LOCK",
  188: "COMMA",
  190: "PERIOD",
  191: "SLASH",
  192: "BACK_QUOTE",
  219: "OPEN_BRACKET",
  220: "BACK_SLASH",
  221: "CLOSE_BRACKET",
  222: "QUOTE",
  224: "META",
}

const keydownListeners = {}
const keyupListeners = {}

export default function setup(preventDefault = false, context = window) {
  context._keys = []

  function setKeysPressed(e, isPressed) {
    // if (e.metaKey || e.ctrlKey || e.altKey) {
    //   return;
    // }

    if (keyNames[e.keyCode] != null) {
      if (preventDefault) {
        e.preventDefault()
      }

      context._keys[e.keyCode] = isPressed
    }
  }

  context.addEventListener("keydown", (e) => {
    setKeysPressed(e, true)

    if (keydownListeners[e.keyCode]) {
      keydownListeners[e.keyCode].forEach((cb) => cb())
    }
  })

  context.addEventListener("keyup", (e) => {
    setKeysPressed(e, false)

    if (keyupListeners[e.keyCode]) {
      keyupListeners[e.keyCode].forEach((cb) => cb())
    }
  })
}

export function addKeyListener(key, event, cb) {
  if (typeof cb !== "function") {
    throw new Error("Callback must be a function")
  }

  if (!keyCodes[key]) {
    throw new Error("Invalid key given")
  }

  const keyCode = keyCodes[key]

  if (event === "keydown") {
    if (!keydownListeners[keyCode]) keydownListeners[keyCode] = []
    keydownListeners[keyCode].push(cb)
  } else if (event === "keyup") {
    if (!keyupListeners[keyCode]) keyupListeners[keyCode] = []
    keyupListeners[keyCode].push(cb)
  } else {
    throw new Error("Event must be 'keydown' or 'keyup'")
  }
}
