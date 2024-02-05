const fs = require("fs");
const readline = require("readline");

const arr = [
  ["SUBJECTS", "results.txt", "subject", "credit", "result"],
  ["GPV", "gpv.txt"],
];
const dynamicObjects = {};

async function processFile() {
  return new Promise((resolve, reject) => {
    for (file of arr) {
      //console.log(file);
      const filestream = fs.createReadStream(file[1]);
      const interface = readline.createInterface({
        input: filestream,
      });
      dynamicObjects[file[0]] = {};
      console.log(file);
      interface.on("line", (line) => {
        if (file.length > 2) {
          const [...para] = line.split(", ");
          //console.log(para);
          dynamicObjects[file[0]][para[0]] = createGradeObject(
            para.slice(1),
            file.slice(1)
          );
        }
      });
      interface.on("close", () => {
        resolve();
      });
    }
  });
}

function createGradeObject(values, keys) {
  const gradeObject = {};
  for (let i = 0; i < keys.length; i++) {
    gradeObject[keys[i]] = values[i];
  }
  return gradeObject;
}

async function processFiles() {
  const promises = arr.map(processFile);
  await Promise.all(promises);
}
processFiles().then(() => {
  console.log(dynamicObjects);
});

// interface.on("close", () => {
// });

// class Grade {
//   constructor(values, keys) {
//     for (let i = 0; i < keys.length; i++) {
//       this[keys[i]] = values[i];
//     }
//   }
// }
