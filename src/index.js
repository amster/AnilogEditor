// Copyright (c) 2018 by Sequence Mediaworks
// Licensed under GPLv3

import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import registerServiceWorker from "./registerServiceWorker";
import State from "./State";

ReactDOM.render(<App state={State.state} />, document.getElementById("root"));
registerServiceWorker();
