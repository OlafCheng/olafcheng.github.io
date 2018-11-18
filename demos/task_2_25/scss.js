var sass = require("node-sass");
var result = sass.renderSync({
  file: "./scss/main.scss",
  outFile: "style/main.css",
  outputStyle: "compact"
});

console.log(result.stats);