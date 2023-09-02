import excelToJson from "convert-excel-to-json";
import fs from "fs";
import path from "path";

const result = excelToJson({
  sourceFile: path.join("./scripts/data.xlsx"),
  header: {
    rows: 1,
  },
  sheets: [{
    name: '工作表1',
    columnToKey: {
      A: 'id',
      // B: 'name',
      C: 'visaType',
      D: 'submitDate',
      E: 'submitCity',
      F: 'submitType',
      G: 'securityDate',
      // H: 'guessReason',
      R: 'sensitivity',
      S: 'isInjunctionSuccess',
      T: 'firstInjunctionDate',
      U: 'noaDate',
      V: 'nrDate',
      W: 'oprDate',
      X: 'secondInjunctionDate',
      AD: 'submitToSecurityDays',
      AE: 'submitToOprDays',
      AF: 'securityToOprDays',
      AG: 'submitToFirstInjunctionDays',
      AH: 'securityToFirstInjunctionDays',
      AI: 'firstInjunctionToOprDays',
      AJ: 'nrToOprDays',
    }
  },
],
});

fs.writeFileSync(path.join("./public/data.json"), JSON.stringify(result, null, 2));
