// Copyright (c) 2018-2020 by Sequence Mediaworks
// Licensed under GPLv3

import React from "react";
import classnames from "classnames";

import G from "../../Globals";
import State from "../../State";

import "./index.css";

const Alert = props => (
  <div
    className={classnames("Alert", {
      "Alert--show": State.get("alertmessage"),
      "Alert--error": State.get("alerttype") === "error"
    })}
  >
    {State.get("alertmessage")}
  </div>
);

Alert.flash = (message, isError) => {
  State.set("alertmessage", message);
  State.set("alerttype", isError ? "error" : "message");

  if (Alert._timeout) {
    clearTimeout(Alert._timeout);
  }

  Alert._timeout = setTimeout(() => {
    State.clear("alertmessage");
    Alert._timeout = null;
  }, G.alertDurationMs);
};

export default Alert;
