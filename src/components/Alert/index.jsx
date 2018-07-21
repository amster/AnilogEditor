// Copyright (c) 2018 by Sequence Mediaworks
// Licensed under GPLv3

import React from "react";
import classnames from "classnames";

import G from "../../Globals";
import State from "../../State";

import "./index.css";

const Alert = props => (
  <div
    className={classnames("Alert", {
      "Alert--show": State.get("alertmessage")
    })}
  >
    {State.get("alertmessage")}
  </div>
);

Alert.flash = message => {
  State.set("alertmessage", message);

  if (Alert._timeout) {
    clearTimeout(Alert._timeout);
  }

  Alert._timeout = setTimeout(() => {
    State.clear("alertmessage");
    Alert._timeout = null;
  }, G.alertDurationMs);
};

export default Alert;
