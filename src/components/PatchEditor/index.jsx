// Copyright (c) 2018 by Sequence Mediaworks
// Licensed under GPLv3

import React from "react";

import PatchUtils from "../../PatchUtils";

import "./index.css";

const renderCurrentPatch = patchObject => {
  if (!patchObject || !patchObject.patchname) return null;

  let rows = Object.keys(patchObject)
    .sort()
    .map(key => (
      <tr key={`PatchEditor[${key}]`}>
        <th scope="row" className="PatchEditor-cell">
          {key}
        </th>
        <td className="PatchEditor-cell">
          {renderPatchElement(key, patchObject[key])}
        </td>
      </tr>
    ));

  return (
    <table>
      <tbody>{rows}</tbody>
    </table>
  );
};

const renderPasteButton = () =>
  PatchUtils.hasCurrentPatch() ? (
    <button
      className="PatchEditor-button"
      onClick={PatchUtils.pasteStoredToCurrentPatch}
    >
      Write patch
    </button>
  ) : null;

const renderPatchElement = (patchObjectKey, element) => {
  if (element === null) return null;
  if (typeof element !== "object") return element;

  let cells = Object.keys(element)
    .sort()
    .map(key => (
      <div
        className="PatchEditor-elementItem"
        key={`PatchEditor[${patchObjectKey}][${key}]`}
      >
        <span className="PatchEditor-elementLabel">{key}</span>
        <span className="PatchEditor-elementValue">{element[key]}</span>
      </div>
    ));

  return <div className="PatchEditor-elements">{cells}</div>;
};

const PatchEditor = props => (
  <div className="PatchEditor">
    <h2 className="PatchEditor-title">Patch Details</h2>
    <div className="PatchEditor-toolbar">
      <button
        className="PatchEditor-button"
        onClick={PatchUtils.storeCurrentPatch}
      >
        Copy patch
      </button>
      {renderPasteButton()}
    </div>
    <div className="PatchEditor-objectView">
      {renderCurrentPatch(PatchUtils.getCurrentPatch())}
    </div>
  </div>
);

export default PatchEditor;
