import excelToJson from "convert-excel-to-json";
import fs from "fs";
import path from "path";

const result = excelToJson({
  sourceFile: path.join("./scripts/data.xlsx"),
  header: {
    rows: 1,
  },
  columnToKey: {
		A: 'id',
		// B: 'name',
    C: 'visaType',
    D: 'submitDate',
    E: 'submitCity',
    F: 'submitType',
    G: 'securityDate',
    // H: 'guessReason',
    I: 'isInjunction',
    J: 'firstInjunctionDate',
    K: 'noaDate',
    L: 'nrDate',
    M: 'oprDate',
    N: 'secondInjunctionDate',
    S: 'source',
	}
});

fs.writeFileSync(path.join("./public/data2.json"), JSON.stringify(result, null, 2));
