import debug from 'debug';

import app from './app';

let logger = debug('server');

let server = app.listen(3000, function () {

  let host = server.address().address;
  let port = server.address().port;

  logger('Example app listening at http://%s:%s', host, port);

});