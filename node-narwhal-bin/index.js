var path = require("path");

exports.path = path.join(__dirname, "narwhal-0.3.2/bin", process.platform == "win32" ? "ringo.cmd" : "ringo");
