// Copyright (c) 2018 by Sequence Mediaworks
// Licensed under GPLv3

import React from "react";
import State from "../../State";

import "./index.css";

const Toolbar = props => (
  <div className="Toolbar">
    Bank
    <input
      className="Toolbar-field"
      name="bank"
      type="text"
      value={State.state.bank}
      onChange={e => State.set("bank", e.target.value)}
    />
    Patch
    <input
      className="Toolbar-field"
      name="patch"
      type="text"
      value={State.state.patch}
      onChange={e => State.set("patch", e.target.value)}
    />
  </div>
);

export default Toolbar;
