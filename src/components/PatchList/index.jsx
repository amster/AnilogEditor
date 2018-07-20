// Copyright (c) 2018 by Sequence Mediaworks
// Licensed under GPLv3

import React from "react";
import G from "../../Globals";
import State from "../../State";

import "./index.css";

const renderCols = (props, rowIdx) => {
  const onClick = (row, col) => {
    State.set("bank", row);
    State.set("patch", col);
  };

  let cols = [];
  for (let col = 0; col < G.numberPatchesPerBank; col++) {
    ((r, c) => {
      cols.push(
        <input
          className="PatchList-radio"
          type="radio"
          name="PatchListSelector"
          id={`bank:${rowIdx}/patch:${col}`}
          checked={State.get("bank") == r && State.get("patch") == c}
          onClick={e => onClick(r, c)}
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

  for (let col = 0; col < G.numberPatchesPerBank; col++) {
    cols.push(<span className="PatchList-col-heading">{col}</span>);
  }

  return (
    <tr>
      {cols.map((col, idx) => (
        <th
          className="PatchList-cell"
          key={`PatchList.renderColsHeading[${idx}]`}
        >
          {col}
        </th>
      ))}
    </tr>
  );
};

const renderRows = props => {
  let rows = [];

  for (let row = 0; row < G.numberBanks; row++) {
    rows.push(renderCols(props, row));
  }

  return rows.map((row, idx) => (
    <tr key={`PatchList.renderRows[${idx}]`}>
      <th className="PatchList-cell">
        <span className="PatchList-row-heading">b{idx}</span>
      </th>
      {row}
    </tr>
  ));
};

const PatchList = props => (
  <div className="PatchList">
    {console.log("PatchList", State.state)}
    <table className="PatchList-table">
      <tbody>
        {renderColsHeadings(props)}
        {renderRows(props)}
      </tbody>
    </table>
  </div>
);

export default PatchList;
