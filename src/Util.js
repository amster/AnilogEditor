// Copyright (c) 2018 by Sequence Mediaworks
// Licensed under GPLv3

let Util = {};

Util.getElementById = elementId => document.getElementById(elementId);

Util.getKeyFromEvent = e => e.key || e.keyIdentifier || e.keyCode;

Util.isArrowDown = keycode => keycode === "ArrowDown";

Util.isArrowLeft = keycode => keycode === "ArrowLeft";

Util.isArrowRight = keycode => keycode === "ArrowRight";

Util.isArrowUp = keycode => keycode === "ArrowUp";

Util.isEnterKey = keycode => keycode === 13 || keycode === "Enter";

Util.isKey = (keycode, test) =>
  String(keycode).toLowerCase() === String(test).toLowerCase();

// Aliases
Util.el = Util.getElementById;
Util.key = Util.getKeyFromEvent;

export default Util;
