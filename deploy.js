const ghPages = require("gh-pages");
const path = require("path");
const fs = require("fs-extra");

const srcDir = path.resolve(__dirname, "public");
const destDir = path.resolve(__dirname, "build");

fs.copySync(srcDir, destDir, { overwrite: true }, (err) => {
  if (err) {
    console.log(err);
  } else {
    console.log("copied ./public to ./build");
  }
});

ghPages.publish("build", (err) => console.log);
console.log("deployed oh github pages");
