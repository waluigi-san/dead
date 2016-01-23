var path = require("path");

exports.path = path.join(__dirname, "ringojs-0.9/bin", process.platform == "win32" ? "ringo.cmd" : "ringo");
