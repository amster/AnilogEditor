// Copyright (c) 2018-2020 by Sequence Mediaworks
// Licensed under GPLv3

import React from "react";

import G from "../../Globals";
import PatchUtils from "../../PatchUtils";

import "./index.css";

const editPatchname = () => {
  const patchObject = PatchUtils.getCurrentPatch();
  if (!patchObject) { return; }
  let newName = prompt("New patchname", patchObject.patchname);
  if (newName === null) return;

  newName = String(newName)
    .replace(/^\s*/, "")
    .replace(/\s*$/, "")
    .replace(/\s+/g, " ")
    .replace(
      /./g,
      match =>
        match.charCodeAt(0) < 32 || match.charCodeAt(0) > 127 ? "_" : match
    )
    .substr(0, G.patchnameMaxLength);

  patchObject.patchname = newName;
  PatchUtils.setCurrentPatch(patchObject);
};

const patchObjectKeyComparator = (a, b) => {
  const aHasNumbers = !!String(a).match(/\d/);
  const bHasNumbers = !!String(b).match(/\d/);

  if (!aHasNumbers && !bHasNumbers) return a.localeCompare(b);
  if (!aHasNumbers && bHasNumbers) return -1;
  if (aHasNumbers && !bHasNumbers) return 1;

  return a.localeCompare(b);
};

const renderCurrentPatch = patchObject => {
  if (!patchObject || !patchObject.patchname) return null;

  let rows = Object.keys(patchObject)
    .sort(patchObjectKeyComparator)
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
      <button className="PatchEditor-button" onClick={editPatchname}>
        Edit patchname
      </button>
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

PatchEditor.editPatchname = editPatchname;

export default PatchEditor;
