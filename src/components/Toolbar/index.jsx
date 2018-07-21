// Copyright (c) 2018 by Sequence Mediaworks
// Licensed under GPLv3

import React from "react";
import State from "../../State";
import PatchUtils from "../../PatchUtils";
import Util from "../../Util";

import "./index.css";

const handleBankKeyUp = e => {
  const keycode = Util.key(e);
  if (Util.isArrowUp(keycode)) {
    PatchUtils.setBank(PatchUtils.getBank() + 1);
  } else if (Util.isArrowDown(keycode)) {
    PatchUtils.setBank(PatchUtils.getBank() - 1);
  }
};

const handlePatchKeyUp = e => {
  const keycode = Util.key(e);
  if (Util.isArrowUp(keycode)) {
    PatchUtils.setPatch(PatchUtils.getPatch() + 1);
  } else if (Util.isArrowDown(keycode)) {
    PatchUtils.setPatch(PatchUtils.getPatch() - 1);
  }
};

const handleExportPatches = () => {
  if (!PatchUtils.didLoadPatches()) return;

  const version = PatchUtils.getVersion();
  const result = PatchUtils.exportJsonFromState();
  result.version = version + 1;

  const $field = document.getElementById("Toolbar-json");
  $field.value = JSON.stringify(result);
};

const handleLoadPatches = () => {
  const $field = document.getElementById("Toolbar-json");
  const json = $field.value;
  if (json && json.length > 0) {
    const version = PatchUtils.getVersion();
    const result = PatchUtils.loadJsonToState(json);
    if (result) {
      $field.value = JSON.stringify({
        result: "Load OK",
        version: version
      });
    }
  }
};

const renderBankAndPatchButtons = () =>
  PatchUtils.getVersion()
    ? [
        <span className="Toolbar-label">Bank</span>,
        <input
          className="Toolbar-field"
          name="bank"
          type="text"
          value={PatchUtils.getBank()}
          onChange={e => PatchUtils.setBank(e.target.value)}
          onKeyUp={handleBankKeyUp}
        />,
        <span className="Toolbar-label">Patch</span>,
        <input
          className="Toolbar-field"
          name="patch"
          type="text"
          value={PatchUtils.getPatch()}
          onChange={e => PatchUtils.setPatch(e.target.value)}
          onKeyUp={handlePatchKeyUp}
        />
      ]
    : null;

const renderExportPatchesButton = () =>
  PatchUtils.getVersion() ? (
    <button className="Toolbar-button" onClick={handleExportPatches}>
      Export Patches To JSON
    </button>
  ) : null;

const Toolbar = props => (
  <div className="Toolbar">
    <div className="Toolbar-controls">
      {renderBankAndPatchButtons()}
      {renderExportPatchesButton()}
      <button className="Toolbar-button" onClick={handleLoadPatches}>
        Load Patches From JSON
      </button>
    </div>
    <textarea
      className="Toolbar-json"
      id="Toolbar-json"
      value={State.get("patchJson")}
    />
  </div>
);

export default Toolbar;
