// Copyright (c) 2018 by Sequence Mediaworks
// Licensed under GPLv3

import React from "react";
import State from "../../State";
import PatchUtils from "../../PatchUtils";

import "./index.css";

const handleExportPatches = () => {
  const version = State.get("patchesversion");
  if (!version) return;

  const result = PatchUtils.exportJsonFromState();
  result.version = version + 1;

  const $field = document.getElementById("Toolbar-json");
  $field.value = JSON.stringify(result);
};

const handleLoadPatches = () => {
  const $field = document.getElementById("Toolbar-json");
  const json = $field.value;
  if (json && json.length > 0) {
    const result = PatchUtils.loadJsonToState(json);
    if (result) {
      $field.value = JSON.stringify({
        result: "Load OK",
        version: State.get("patchesversion")
      });
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
      <button className="Toolbar-button" onClick={handleLoadPatches}>
        Load Patches From JSON
      </button>
      <button className="Toolbar-button" onClick={handleExportPatches}>
        Export Patches To JSON
      </button>
    </div>
    <textarea
      className="Toolbar-json"
      id="Toolbar-json"
      value={State.state.patchJson}
    />
  </div>
);

export default Toolbar;
