'use strict';

const path = require('path');
process.chdir(path.dirname(module.filename));

console.warn(require.resolve.paths('ttt'));

const utils = require("uc-utils");
console.info('Initialization...');
const mm = require('uc-mm-rt');

if(! Buffer.alloc) Buffer = require('safe-buffer').Buffer;

const router = require('uc-router');
module.exports.router = router;

const server = require('uc-server').init(router);

const wscli = require('uc-wscli').init(server.ws);

const sensors = require('uc-sensors');






console.info("Started...");

