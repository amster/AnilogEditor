// Copyright (c) 2018 by Sequence Mediaworks
// Licensed under GPLv3

import React from "react";
import State from "../../State";
import PatchUtils from "../../PatchUtils";

import "./index.css";

const PatchEditor = props => (
  <div className="PatchEditor">
    <div className="PatchEditor-toolbar">
      <button
        className="PatchEditor-button"
        onClick={PatchUtils.storeCurrentPatch}
      >
        Copy patch
      </button>
      <button
        className="PatchEditor-button"
        onClick={PatchUtils.pasteStoredToCurrentPatch}
      >
        Paste patch
      </button>
    </div>
    <div className="PatchEditor-objectView">
      {JSON.stringify(PatchUtils.getCurrentPatch() || {}).replace(/,"/g, ', "')}
    </div>
  </div>
);

export default PatchEditor;
