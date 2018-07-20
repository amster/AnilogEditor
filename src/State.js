// Copyright (c) 2018 by Sequence Mediaworks
// Licensed under GPLv3

let State = {};

State.get = key => State.state[key];

State.onChange = null;

State.state = {};

State.set = (key, value) => {
  State.state[key] = value;
  if (State.onChange) {
    State.onChange(key, value);
  }
};

State.setOnChange = callback => (State.onChange = callback);

export default State;
