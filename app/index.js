// New Relic Server monitoring support
if ( process.env.NEW_RELIC_ENABLED ) {
  require( "newrelic" );
}

const restify = require('restify');
const applyRoutes = require('./routes');
const logger = require('./lib/logger')
const middleware = require('./lib/middleware')
const package = require('../package')

const server = restify.createServer({
  name: package.name,
  version: package.version,
  log: logger,
});

server.pre(restify.pre.sanitizePath());
server.use(restify.acceptParser(server.acceptable));
server.use(restify.queryParser({mapParams: false}));
server.use(restify.bodyParser({mapParams: false, rejectUnknown: true}));
server.use(middleware.verifyRequest())
server.use(middleware.attachResolvePath())
server.use(middleware.attachErrorLogger())

applyRoutes(server);

module.exports = server;

process.env.APIPORT = 8181

if (!module.parent) {
  server.listen(process.env.APIPORT || 8080, function () {
    console.log('%s listening at %s', server.name, server.url);
  });
}
