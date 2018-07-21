// Copyright (c) 2018 by Sequence Mediaworks
// Licensed under GPLv3

import React from "react";
import classnames from "classnames";

import G from "../../Globals";
import State from "../../State";
import PatchUtils from "../../PatchUtils";
import Util from "../../Util";

import "./index.css";

const getPatch = (bank, patch) => {
  const patchId = PatchUtils.idWithPatch(bank, patch);
  return State.get(patchId) || {};
};

const handleCellClick = (bank, patch) => {
  State.set("bank", bank);
  State.set("patch", patch);
};

const handleCellKeyDown = (e, bank, patch) => {
  const keycode = Util.key(e);

  if (Util.isArrowLeft(keycode)) {
    PatchUtils.setBank(PatchUtils.getBank() - 1);
  } else if (Util.isArrowRight(keycode)) {
    PatchUtils.setBank(PatchUtils.getBank() + 1);
  } else if (Util.isArrowUp(keycode)) {
    PatchUtils.setPatch(PatchUtils.getPatch() - 1);
  } else if (Util.isArrowDown(keycode)) {
    PatchUtils.setPatch(PatchUtils.getPatch() + 1);
  } else if (Util.isKey(keycode, "c")) {
    PatchUtils.storeCurrentPatch();
  } else if (Util.isKey(keycode, "v")) {
    PatchUtils.pasteStoredToCurrentPatch();
  } else if (Util.isKey(keycode, "w")) {
    PatchUtils.pasteStoredToCurrentPatch();
  }

  const patchId = PatchUtils.idWithPatch(
    PatchUtils.getBank(),
    PatchUtils.getPatch()
  );
  const $el = Util.el(patchId);
  if ($el) {
    $el.focus();
  }
};

const renderCols = (props, rowIdx) => {
  const curBank = State.get("bank");
  const curPatch = State.get("patch");

  let cols = [];
  for (let col = 0; col < G.numberBanks; col++) {
    ((r, c) => {
      const classname = classnames("PatchList-patchname", {
        "PatchList-currentPatch": col === curBank && rowIdx === curPatch
      });
      cols.push(
        <input
          className={classname}
          type="text"
          name="PatchList-patchname"
          id={PatchUtils.idWithPatch(col, rowIdx)}
          checked={State.get("bank") === c && State.get("patch") === r}
          onClick={e => handleCellClick(c, r)}
          onChange={e => (e.target.value = getPatch(c, r).patchname || "")}
          onKeyDown={e => handleCellKeyDown(e, c, r)}
          value={getPatch(c, r).patchname}
        />
      );
    })(rowIdx, col);
  }

  return cols.map((col, idx) => (
    <td
      className="PatchList-cell"
      key={`PatchList.renderCols[${rowIdx}][${idx}]`}
    >
      {col}
    </td>
  ));
};

const renderColsHeadings = props => {
  let cols = [null];

  for (let col = 0; col < G.numberBanks; col++) {
    cols.push(<span className="PatchList-col-heading">B{col}</span>);
  }

  return (
    <tr>
      {cols.map((col, idx) => (
        <th
          className="PatchList-cell"
          key={`PatchList.renderColsHeading[${idx}]`}
          scope="col"
        >
          {col}
        </th>
      ))}
    </tr>
  );
};

const renderRows = props => {
  let rows = [];

  for (let row = 0; row < G.numberPatchesPerBank; row++) {
    rows.push(renderCols(props, row));
  }

  return rows.map((row, idx) => (
    <tr key={`PatchList.renderRows[${idx}]`}>
      <th className="PatchList-cell" scope="row">
        <span className="PatchList-row-heading">{idx}</span>
      </th>
      {row}
    </tr>
  ));
};

const PatchList = props => (
  <div className="PatchList">
    <h2 className="PatchList-title">Patch List</h2>
    <table className="PatchList-table">
      <tbody>
        {renderColsHeadings(props)}
        {renderRows(props)}
      </tbody>
    </table>
  </div>
);

export default PatchList;
