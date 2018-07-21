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

    return true;
  } catch (e) {
    console.log("Load JSON: invalid JSON");
    return false;
  }
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

export default PatchUtils;
