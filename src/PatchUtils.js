// Copyright (c) 2018 by Sequence Mediaworks
// Licensed under GPLv3

import Alert from "./components/Alert/index";
import G from "./Globals";
import State from "./State";

let PatchUtils = {};

PatchUtils.clearAllPatches = () => {
  for (let bank = 0; bank < G.numberBanks; bank++) {
    for (let patch = 0; patch < G.numberPatchesPerBank; patch++) {
      const patchId = PatchUtils.idWithPatch(bank, patch);
      State.set(patchId, null);
    }
  }
};

PatchUtils.didLoadPatches = () => State.get("patchesversion") > 0;

PatchUtils.exportJsonFromState = () => {
  let result = {
    editor: "Anilog Editor",
    date: new Date().toString(),
    version: State.get("patchesversion"),
    patches: []
  };

  for (let bank = 0; bank < G.numberBanks; bank++) {
    for (let patch = 0; patch < G.numberPatchesPerBank; patch++) {
      const patchId = PatchUtils.idWithPatch(bank, patch);
      const patchesObject = State.get(patchId);
      if (patchesObject) {
        result.patches.push(Object.assign({}, patchesObject));
      }
    }
  }

  return result;
};

PatchUtils.getBank = () => parseInt(State.get("bank"), 10) || 0;

PatchUtils.getCurrentPatch = () =>
  State.get(
    PatchUtils.idWithPatch(PatchUtils.getBank(), PatchUtils.getPatch())
  );

PatchUtils.getPatch = () => parseInt(State.get("patch"), 10) || 0;

PatchUtils.getVersion = () => State.get("patchesversion") || 0;

PatchUtils.hasCurrentPatch = () => !!State.get("currentpatch");

PatchUtils.idWithPatch = (bank, patch) => `bank-${bank}_patch-${patch}`;

PatchUtils.loadJsonToState = json => {
  try {
    const parsedJson = JSON.parse(json);
    if (
      !parsedJson ||
      !parsedJson.version ||
      !parsedJson.patches ||
      typeof parsedJson.patches !== "object" ||
      parsedJson.patches.length < 1
    ) {
      console.log("Load JSON: Parse OK, but no patches");
      return false;
    }

    PatchUtils.clearAllPatches();

    parsedJson.patches.forEach(patch => PatchUtils.setPatchWithJson(patch));

    State.set(
      "patchesversion",
      parsedJson.version ? parseInt(parsedJson.version, 10) : 0
    );

    return true;
  } catch (e) {
    console.log("Load JSON: invalid JSON");
    return false;
  }
};

PatchUtils.pasteStoredToCurrentPatch = () => {
  const patchObject = State.get("currentpatch");
  if (patchObject) {
    PatchUtils.setCurrentPatch(patchObject);
    Alert.flash("Wrote stored patch");
    return true;
  } else {
    return false;
  }
};

PatchUtils.setBank = bank =>
  State.set(
    "bank",
    Math.min(Math.max(parseInt(bank, 10) || 0, 0), G.numberBanks - 1)
  );

PatchUtils.setCurrentPatch = patchObject => {
  const bank = PatchUtils.getBank();
  const patch = PatchUtils.getPatch();
  State.set(
    PatchUtils.idWithPatch(bank, patch),
    Object.assign({}, patchObject, { program: patch, bank: bank })
  );
};

PatchUtils.setPatch = patch =>
  State.set(
    "patch",
    Math.min(Math.max(parseInt(patch, 10) || 0, 0), G.numberPatchesPerBank - 1)
  );

PatchUtils.setPatchWithJson = patchJson => {
  const patch = parseInt(patchJson.program, 10);
  const bank = parseInt(patchJson.bank, 10);
  if (
    patchJson.patchname &&
    patchJson.patchname.length > 0 &&
    patch >= 0 &&
    patch < G.numberPatchesPerBank &&
    bank >= 0 &&
    bank < G.numberBanks
  ) {
    const patchId = PatchUtils.idWithPatch(bank, patch);
    State.set(patchId, patchJson);
  }
};

PatchUtils.storeCurrentPatch = () => {
  const patchObject = PatchUtils.getCurrentPatch();
  if (patchObject) {
    State.set("currentpatch", patchObject);
    Alert.flash("Stored current patch");
    return true;
  } else {
    return false;
  }
};

export default PatchUtils;
