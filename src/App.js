// Copyright (c) 2018 by Sequence Mediaworks
// Licensed under GPLv3

import React, { Component } from "react";
import State from "./State";
import PatchUtils from "./PatchUtils";
import "./App.css";

import PatchEditor from "./components/PatchEditor/index";
import PatchList from "./components/PatchList/index";
import Toolbar from "./components/Toolbar/index";

class App extends Component {
  componentDidMount() {
    this.setState(State.state);
    State.setOnChange(this.onChange.bind(this));

    State.set("bank", 0);
    State.set("patch", 0);

    PatchUtils.clearAllPatches();
    console.log(State.state);
  }

  onChange(changedKey, changedValue) {
    this.setState(State.state);
  }

  render() {
    return (
      <div className="App">
        <Toolbar />
        <div className="App-grid">
          <PatchList />
          <PatchEditor />
        </div>
      </div>
    );
  }
}

export default App;
