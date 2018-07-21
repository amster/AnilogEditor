// Copyright (c) 2018 by Sequence Mediaworks
// Licensed under GPLv3

import React, { Component } from "react";

import Alert from "./components/Alert/index";
import PatchEditor from "./components/PatchEditor/index";
import PatchList from "./components/PatchList/index";
import PatchUtils from "./PatchUtils";
import State from "./State";
import Toolbar from "./components/Toolbar/index";

import "./App.css";

class App extends Component {
  componentDidMount() {
    this.setState(State.state);
    State.setOnChange(this.onChange.bind(this));

    State.set("bank", 0);
    State.set("patch", 0);

    PatchUtils.clearAllPatches();
  }

  onChange(changedKey, changedValue) {
    this.setState(State.state);
  }

  renderInstructions() {
    return PatchUtils.getVersion()
      ? "Click a cell to select, press C to copy, press W (or V) to write."
      : "Paste patches JSON above and click Load Patches From JSON";
  }

  renderMainUI() {
    return PatchUtils.getVersion() ? (
      <div className="App-grid">
        <PatchList />
        <PatchEditor />
      </div>
    ) : null;
  }

  render() {
    return (
      <div className="App">
        <Toolbar />
        <div className="App-importer">
          <textarea
            className="App-importer-field"
            id="Patchlist-json"
            value={State.get("patchJson")}
            placeholder="Export the patches from the app and paste the JSON here."
          />
        </div>
        <div className="App-instructions">{this.renderInstructions()}</div>
        {this.renderMainUI()}
        <div className="App-footer">Copyright (c) 2018 Sequence Mediaworks</div>
        <Alert />
      </div>
    );
  }
}

export default App;
