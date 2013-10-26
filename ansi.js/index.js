var ansi = exports;

ansi.colors = ansi.color = require('./lib/color');

ansi.Terminal = require('./lib/terminal');

ansi.terminal = ansi.Terminal(process.stdout);

ansi.cursor = require('./lib/cursor');

ansi.trim = require('./lib/trim');
