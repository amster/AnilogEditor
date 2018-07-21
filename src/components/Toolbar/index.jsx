// Copyright (c) 2018 by Sequence Mediaworks
// Licensed under GPLv3

import React from "react";

import Alert from "../Alert";
import PatchUtils from "../../PatchUtils";
import State from "../../State";
import Util from "../../Util";

import "./index.css";

const handleBankKeyDown = e => {
  const keycode = Util.key(e);
  if (Util.isArrowUp(keycode)) {
    PatchUtils.setBank(PatchUtils.getBank() + 1);
  } else if (Util.isArrowDown(keycode)) {
    PatchUtils.setBank(PatchUtils.getBank() - 1);
  }
};

const handlePatchKeyDown = e => {
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

  Alert.flash("Patchlist exported");
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
      Alert.flash("Patchlist loaded");
    }
  }
};

const renderBankAndPatchButtons = () =>
  PatchUtils.getVersion()
    ? [
        <span className="Toolbar-label" key="Toolbar-bank">
          Bank
        </span>,
        <input
          key="Toolbar-bank-field"
          className="Toolbar-field"
          name="bank"
          type="text"
          value={PatchUtils.getBank()}
          onChange={e => PatchUtils.setBank(e.target.value)}
          onKeyDown={handleBankKeyDown}
        />,
        <span className="Toolbar-label" key="Toolbar-patch">
          Patch
        </span>,
        <input
          key="Toolbar-patch-field"
          className="Toolbar-field"
          name="patch"
          type="text"
          value={PatchUtils.getPatch()}
          onChange={e => PatchUtils.setPatch(e.target.value)}
          onKeyDown={handlePatchKeyDown}
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
    <div className="Toolbar-title">
      <img
        className="Toolbar-logo"
        src="/logo-128.png"
        alt="Anilog Editor logo"
      />
      <span className="Toolbar-title-label">Editor</span>
    </div>
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
