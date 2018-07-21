// Copyright (c) 2018 by Sequence Mediaworks
// Licensed under GPLv3

let Util = {};

Util.getKeyFromEvent = e => e.key || e.keyIdentifier || e.keyCode;

Util.key = Util.getKeyFromEvent;

Util.isArrowDown = keycode => keycode === "ArrowDown";

Util.isArrowUp = keycode => keycode === "ArrowUp";

export default Util;
