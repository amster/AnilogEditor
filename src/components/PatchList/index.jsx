// Copyright (c) 2018 by Sequence Mediaworks
// Licensed under GPLv3

import React from "react";
import G from "../../Globals";
import State from "../../State";
import PatchUtils from "../../PatchUtils";

import "./index.css";

const getPatch = (bank, patch) => {
  const patchId = PatchUtils.idWithPatch(bank, patch);
  return State.get(patchId) || {};
};

const renderCols = (props, rowIdx) => {
  const onClick = (row, col) => {
    State.set("bank", col);
    State.set("patch", row);
  };

  let cols = [];
  for (let col = 0; col < G.numberBanks; col++) {
    ((r, c) => {
      cols.push(
        <input
          className="PatchList-patchname"
          type="text"
          name="PatchList-patchname"
          id={PatchUtils.idWithPatch(col, rowIdx)}
          checked={State.get("bank") == c && State.get("patch") == r}
          onClick={e => onClick(r, c)}
          value={getPatch(col, rowIdx).patchname}
          handleChange={e => {
            /* do nothing */
          }}
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
    <table className="PatchList-table">
      <tbody>
        {renderColsHeadings(props)}
        {renderRows(props)}
      </tbody>
    </table>
  </div>
);

export default PatchList;
