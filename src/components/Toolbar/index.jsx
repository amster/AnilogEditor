// Copyright (c) 2018 by Sequence Mediaworks
// Licensed under GPLv3

import React from "react";
import State from "../../State";
import PatchUtils from "../../PatchUtils";

import "./index.css";

const handleLoadPatches = e => {
  const $field = document.getElementById("Toolbar-json");
  const json = $field.value;
  if (json && json.length > 0) {
    const result = PatchUtils.loadJsonToState(json);
    if (result) {
      $field.value = `{"result": "Load OK"}`;
    }
  }
};

const Toolbar = props => (
  <div className="Toolbar">
    <div className="Toolbar-controls">
      <span className="Toolbar-label">Bank</span>
      <input
        className="Toolbar-field"
        name="bank"
        type="text"
        value={State.state.bank}
        onChange={e => State.set("bank", e.target.value)}
      />
      <span className="Toolbar-label">Patch</span>
      <input
        className="Toolbar-field"
        name="patch"
        type="text"
        value={State.state.patch}
        onChange={e => State.set("patch", e.target.value)}
      />
      <button className="PatchEditor-button" onClick={handleLoadPatches}>
        Load Patches From JSON
      </button>
      <button className="PatchEditor-button">Export Patches To JSON</button>
    </div>
    <textarea
      className="Toolbar-json"
      id="Toolbar-json"
      value={State.state.patchJson}
    />
  </div>
);

export default Toolbar;
