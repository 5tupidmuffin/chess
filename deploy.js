const ghPages = require("gh-pages");
const path = require("path");
const fs = require("fs-extra");

const srcDir = path.resolve(__dirname, "public");
const destDir = path.resolve(__dirname, "build");

fs.copySync(srcDir, destDir, { overwrite: true }, (err) => {
  if (err) {
    console.log(err);
  }
});
console.log("copied ./public to ./build");

ghPages.publish("build", (err) => {
  if (err) {
    throw err;
  }
});
console.log("deployed oh github pages");
