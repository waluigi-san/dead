var connect = require('connect'),
    h5bp = require('h5bp');

var app = connect();

var PORT = 8080 || process.env['APP_PORT'],
    SECRET = process.env['SECRET'];

app.use(h5bp({

   })
   .use('/get_token', function(req, res, next) {
   })
   .use(connect.static('/public'))

app.listen(PORT);