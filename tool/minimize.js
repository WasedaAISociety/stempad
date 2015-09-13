// http://tmlife.net/programming/javascript/javascript-compression-uglifyjs-usage.html
var fs      = require("fs");
var uglify  = require("uglify-js");
var outputFile = fs.createWriteStream("www/stempad.min.js");
var min = uglify.minify("./stempad.js");
// 出力
outputFile.write(min.code);