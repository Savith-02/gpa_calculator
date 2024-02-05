const fs = require("fs");
const readline = require("readline");

const arr = [
  ["SUBJECTS", "results.txt", "subject", "credit", "result"],
  ["GPV", "gpv.txt"],
];
const dynamicObjects = {};

async function processFile(file) {
  return new Promise((resolve, reject) => {
    const filestream = fs.createReadStream(file[1]);
    const interface = readline.createInterface({
      input: filestream,
    });

    dynamicObjects[file[0]] = {};

    interface.on("line", (line) => {
      const para = line.split(", ");
      if (file.length > 2) {
        dynamicObjects[file[0]][para[0]] = createGradeObject(
          para.slice(1),
          file.slice(3)
        );
      } else {
        dynamicObjects[file[0]][para[0]] = para[1];
      }
    });

    interface.on("close", () => {
      resolve();
    });
  });
}

async function processFiles() {
  const promises = arr.map(processFile);
  await Promise.all(promises);
}

function createGradeObject(values, keys) {
  const gradeObject = {};
  for (let i = 0; i < keys.length; i++) {
    gradeObject[keys[i]] = isNaN(values[i]) ? values[i] : Number(values[i]);
  }
  return gradeObject;
}

processFiles().then(() => {
  //console.log(dynamicObjects.SUBJECTS);
  let result = 0;
  let totalCredit = 0;
  for (const key in dynamicObjects.SUBJECTS) {
    if (dynamicObjects.SUBJECTS.hasOwnProperty(key)) {
      const value = dynamicObjects.SUBJECTS[key];
      console.log(
        `\t${key}: { credit: \x1b[33m${value.credit}\x1b[0m, result: \x1b[32m${
          value.result
        }\x1b[0m, gpv: ${dynamicObjects.GPV[value.result]}}`
      );
      totalCredit += value.credit;
      result += value.credit * dynamicObjects.GPV[value.result];
    }
  }
  console.log(`\nTotal Credits : ${totalCredit}`);

  console.log(`GPA : \x1b[33m${result / totalCredit}\x1b[0m`);
});
