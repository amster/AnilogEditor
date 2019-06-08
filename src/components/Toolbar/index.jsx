// Copyright (c) 2018 by Sequence Mediaworks
// Licensed under GPLv3

import React from "react";

import Alert from "../Alert";
import PatchUtils from "../../PatchUtils";
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

const handleExportPatches = isUser => {
  if (!PatchUtils.didLoadPatches()) return;

  const version = PatchUtils.getVersion();
  const result = PatchUtils.exportJsonFromState(isUser);
  result.version = version + 1;

  const $field = Util.el("Patchlist-json");
  $field.value = JSON.stringify(result);

  Alert.flash("Patchlist exported");
};

const handleLoadPatches = () => {
  const $field = Util.el("Patchlist-json");
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
    } else {
      Alert.flash("ERROR: Can't load this patchlist", true);
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

const renderExportPatchesButtons = () =>
  PatchUtils.getVersion()
    ? [
        <button
          className="Toolbar-button"
          onClick={() => handleExportPatches(0)}
          key="export1"
        >
          Export Factory Banks 0-7 JSON
        </button>,
        <button
          className="Toolbar-button"
          onClick={() => handleExportPatches(1)}
          key="export1"
        >
          Export User Banks 8-15 JSON
        </button>
      ]
    : null;

const Toolbar = props => (
  <div className="Toolbar">
    <div className="Toolbar-title">
      <img
        className="Toolbar-logo"
        src="/logo-128.png"
        alt="Anilog Editor logo"
      />
      <span className="Toolbar-title-label" title="ANILOG Editor">
        Editor
      </span>
    </div>
    <div className="Toolbar-controls">
      {renderBankAndPatchButtons()}
      {renderExportPatchesButtons()}
      &nbsp;
      <button className="Toolbar-button" onClick={handleLoadPatches}>
        Load Patches From JSON
      </button>
    </div>
  </div>
);

export default Toolbar;
