// Copyright (c) 2018-2020 by Sequence Mediaworks
// Licensed under GPLv3

import Alert from "./components/Alert/index";
import G from "./Globals";
import State from "./State";
import Globals from "./Globals";

let PatchUtils = {};

PatchUtils.adjustOctave = () => {
  let tuningAdjustment = -12.0;

  for (var bank=0; bank<Globals.numberBanks; bank++) {
    for (var programNumber=0; programNumber<Globals.numberProgramsPerBank; programNumber++) {
      let patchId = PatchUtils.idWithPatch(bank, programNumber);
      let patch = State.get(patchId);
      if (patch && patch.patchname
          && !patch.patchname.match(/\^/)
          && !patch.patchname.match(/\[kick\]/i)
          && !patch.patchname.match(/\[snare\]/i)
          && !patch.patchname.match(/\[hats\]/i)
          && !patch.patchname.match(/\[skins\]/i)
          && !patch.patchname.match(/\[perc\]/i)
          && !patch.patchname.match(/\[metal\]/i)
          && !patch.patchname.match(/\[fx\]/i)
          && !patch.patchname.match(/\[basic\]/i)
          ) {
        patch.patchname = patch.patchname + "^";
        console.log(`--- ${bank}.${programNumber}: ${patch.patchname}`);
        var before = [];
        var after = [];
        ['o1', 'o2', 'o3'].forEach(oscillator => { // eslint-disable-line no-loop-func
          before.push(`${oscillator}=${patch[oscillator].tu || '-'}`);
          patch[oscillator].tu = (patch[oscillator].tu || 0) + tuningAdjustment;
          after.push(`${oscillator}=${patch[oscillator].tu}`);
        });
        if (patch.fl < 0) {
          patch.fl *= 2;
          if (patch.fl > 2) {
            console.log('!!! WARNING: FL too long', patch.fl);
          }
        }
        State.set(patchId, patch);
      }
    }
  }

  if (State.onChange) {
    State.onChange(0, 0);
  }
}

PatchUtils.clearAllPatches = () => {
  for (let bank = 0; bank < G.numberBanks; bank++) {
    for (let programNumber = 0; programNumber < G.numberProgramsPerBank; programNumber++) {
      const patchId = PatchUtils.idWithPatch(bank, programNumber);
      State.set(patchId, null);
    }
  }
};

PatchUtils.didLoadPatches = () => State.get("patchesversion") > 0;

PatchUtils.exportJsonFromState = isUser => {
  let result = {
    editor: "ANILOG Editor",
    date: new Date().toString(),
    version: State.get("patchesversion"),
    patches: []
  };

  let start = isUser ? G.userBankStartIndex : 0;
  let stop = isUser ? G.numberBanks : G.userBankStartIndex;
  for (let bank = start; bank < stop; bank++) {
    for (let programNumber = 0; programNumber < G.numberProgramsPerBank; programNumber++) {
      const patchId = PatchUtils.idWithPatch(bank, programNumber);
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
    PatchUtils.idWithPatch(PatchUtils.getBank(), PatchUtils.getProgramNumber())
  );

PatchUtils.getProgramNumber = () => parseInt(State.get("programNumber"), 10) || 0;

PatchUtils.getVersion = () => State.get("patchesversion") || 0;

PatchUtils.hasCurrentPatch = () => !!State.get("currentPatch");

PatchUtils.idWithPatch = (bank, programNumber) => `b${bank}-p${programNumber}`;

PatchUtils.isValidBank = bank => bank >= 0 && bank < G.numberBanks;

PatchUtils.isValidProgramNumber = programNumber => programNumber >= 0 && programNumber < G.numberProgramsPerBank;

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
  const patchObject = State.get("currentPatch");
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
  const programNumber = PatchUtils.getProgramNumber();
  State.set(
    PatchUtils.idWithPatch(bank, programNumber),
    Object.assign({}, patchObject, { program: programNumber, bank: bank })
  );
};

PatchUtils.setProgramNumber = programNumber =>
  State.set(
    "programNumber",
    Math.min(Math.max(parseInt(programNumber, 10) || 0, 0), G.numberProgramsPerBank - 1)
  );

PatchUtils.setPatchWithJson = patchJson => {
  const programNumber = parseInt(patchJson.program, 10);
  const bank = parseInt(patchJson.bank, 10);
  if (
    patchJson.patchname &&
    patchJson.patchname.length > 0 &&
    programNumber >= 0 &&
    programNumber < G.numberProgramsPerBank &&
    bank >= 0 &&
    bank < G.numberBanks
  ) {
    const patchId = PatchUtils.idWithPatch(bank, programNumber);
    State.set(patchId, patchJson);
  }
};

PatchUtils.storeCurrentPatch = () => {
  const patchObject = PatchUtils.getCurrentPatch();
  if (patchObject) {
    State.set("currentPatch", patchObject);
    Alert.flash("Stored current patch");
    window._patchObject = patchObject;
    console.log("See window._patchObject:");
    console.log(JSON.stringify(window._patchObject));
    return true;
  } else {
    return false;
  }
};

PatchUtils.swapStoredPatch = () => {
  const currentPatch = PatchUtils.getCurrentPatch();
  const bank = currentPatch ? currentPatch['bank'] : -1;
  const programNumber = currentPatch ? currentPatch['program'] : -1;

  const copiedPatch = State.get("currentPatch");
  const copiedBank = copiedPatch ? copiedPatch['bank'] : -1;
  const copiedProgramNumber = copiedPatch ? copiedPatch['program'] : -1;

  let isValidBankAndProgramNumber =
    PatchUtils.isValidBank(copiedBank) &&
    PatchUtils.isValidProgramNumber(copiedProgramNumber) &&
    PatchUtils.isValidBank(bank) &&
    PatchUtils.isValidProgramNumber(programNumber);
  if (!isValidBankAndProgramNumber) {
    return;
  }

  let isSamePatch = bank === copiedBank && programNumber === copiedProgramNumber;
  if (isSamePatch) {
    return;
  }

  currentPatch['bank'] = copiedBank;
  currentPatch['program'] = copiedProgramNumber;
  PatchUtils.setPatchWithJson(currentPatch);

  copiedPatch['bank'] = bank;
  copiedPatch['program'] = programNumber;
  PatchUtils.setPatchWithJson(copiedPatch);

  State.set("currentPatch", currentPatch);

  Alert.flash(`Swapped patches ${copiedBank}.${copiedProgramNumber} <=> ${bank}.${programNumber}`);
};

window.PatchUtils = {
  adjustOctave: PatchUtils.adjustOctave
}

export default PatchUtils;
