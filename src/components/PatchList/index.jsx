// Copyright (c) 2018-2020 by Sequence Mediaworks
// Licensed under GPLv3

import React from "react";
import classnames from "classnames";

import G from "../../Globals";
import State from "../../State";
import PatchEditor from "../PatchEditor/index";
import PatchUtils from "../../PatchUtils";
import Util from "../../Util";

import "./index.css";

const getPatch = (bank, programNumber) => {
  const patchId = PatchUtils.idWithPatch(bank, programNumber);
  return State.get(patchId) || {};
};

const handleCellClick = (bank, programNumber) => {
  State.set("bank", bank);
  State.set("programNumber", programNumber);
};

const handleCellDoubleClick = (bank, programNumber) => {
  PatchEditor.editPatchname();
};

const handleCellKeyDown = (e, bank, programNumber) => {
  const keycode = Util.key(e);

  if (Util.isArrowLeft(keycode)) {
    PatchUtils.setBank(PatchUtils.getBank() - 1);
  } else if (Util.isArrowRight(keycode)) {
    PatchUtils.setBank(PatchUtils.getBank() + 1);
  } else if (Util.isArrowUp(keycode)) {
    PatchUtils.setProgramNumber(PatchUtils.getProgramNumber() - 1);
  } else if (Util.isArrowDown(keycode)) {
    PatchUtils.setProgramNumber(PatchUtils.getProgramNumber() + 1);
  } else if (Util.isKey(keycode, "c")) {
    PatchUtils.storeCurrentPatch();
  } else if (Util.isKey(keycode, "s")) {
    PatchUtils.swapStoredPatch();
  } else if (Util.isKey(keycode, "v")) {
    PatchUtils.pasteStoredToCurrentPatch();
  } else if (Util.isKey(keycode, "w")) {
    PatchUtils.pasteStoredToCurrentPatch();
  } else if (Util.isEnterKey(keycode)) {
    PatchEditor.editPatchname();
  }

  const patchId = PatchUtils.idWithPatch(
    PatchUtils.getBank(),
    PatchUtils.getProgramNumber()
  );
  const $el = Util.el(patchId);
  if ($el) {
    $el.focus();
  }
};

const renderCols = (props, rowIdx) => {
  const curBank = State.get("bank");
  const curProgramNumber = State.get("programNumber");
  const copiedPatch = State.get("currentPatch");
  const copiedBank = copiedPatch ? copiedPatch['bank'] : -1;
  const copiedProgramNumber = copiedPatch ? copiedPatch['program'] : -1;

  let cols = [];
  for (let col = 0; col < G.numberBanks; col++) {
    ((r, c) => {
      const classname = classnames("PatchList-patchname", {
        "PatchList-copiedPatch": col === copiedBank && rowIdx === copiedProgramNumber,
        "PatchList-currentPatch": col === curBank && rowIdx === curProgramNumber,
        "PatchList-factoryPatch": col < G.userBankStartIndex,
        "PatchList-userPatch": col >= G.userBankStartIndex
      });
      cols.push(
        <input
          className={classname}
          type="text"
          name="PatchList-patchname"
          id={PatchUtils.idWithPatch(col, rowIdx)}
          checked={State.get("bank") === c && State.get("programNumber") === r}
          onClick={e => handleCellClick(c, r)}
          onDoubleClick={e => handleCellDoubleClick(c, r)}
          onChange={e => {return}}
          onKeyDown={e => {handleCellKeyDown(e, c, r)}}
          value={getPatch(c, r).patchname}
          readOnly={true}
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

  for (let row = 0; row < G.numberProgramsPerBank; row++) {
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
      <thead>
        <tr>
          <th />
          <th className="PatchList-tableHeader" colSpan={G.numberBanks/2}>Factory</th>
          <th className="PatchList-tableHeader" colSpan={G.numberBanks/2}>User</th>
        </tr>
        {renderColsHeadings(props)}
      </thead>
      <tbody>{renderRows(props)}</tbody>
    </table>
  </div>
);

export default PatchList;
