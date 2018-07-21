// Copyright (c) 2018 by Sequence Mediaworks
// Licensed under GPLv3

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

PatchUtils.getBank = () => State.state.bank;

PatchUtils.getCurrentPatch = () =>
  State.get(
    PatchUtils.idWithPatch(PatchUtils.getBank(), PatchUtils.getPatch())
  );

PatchUtils.getPatch = () => State.state.patch;

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

    PatchUtils.set(
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
    console.log("RECALLING CURRENT PATCH:", patchObject);
    return true;
  } else {
    return false;
  }
};

PatchUtils.setCurrentPatch = patchObject => {
  const bank = PatchUtils.getBank();
  const patch = PatchUtils.getPatch();
  State.set(
    PatchUtils.idWithPatch(bank, patch),
    Object.assign({}, patchObject, { program: patch, bank: bank })
  );
};

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
    console.log("SETTING CURRENT PATCH:", patchObject);
    return true;
  } else {
    return false;
  }
};

export default PatchUtils;
