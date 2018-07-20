// Copyright (c) 2018 by Sequence Mediaworks
// Licensed under GPLv3

import React, { Component } from "react";
import State from "./State";
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
  }

  onChange(changedKey, changedValue) {
    this.setState(State.state);
  }

  render() {
    return (
      <div className="App">
        <PatchList />
        <Toolbar />
        <PatchEditor />
      </div>
    );
  }
}

export default App;
