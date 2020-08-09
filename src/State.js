// Copyright (c) 2018-2020 by Sequence Mediaworks
// Licensed under GPLv3

let State = {};

State.clear = key => State.set(key, null);

State.get = key => State.state[key];

State.onChange = null;

State.state = {};

State.set = (key, value) => {
  // Nothing to do!
  if (State.state[key] === value) return;

  State.state[key] = value;
  if (State.onChange) {
    State.onChange(key, value);
  }
};

State.setOnChange = callback => (State.onChange = callback);

export default State;
