process.env.NODE_ENV = 'test';

var chai = require('chai');
global.expect = chai.expect;
chai.should();
chai.use(require('sinon-chai'));

global.sinon = require('sinon');
global.pick = require('lodash.pick');
global.omit = require('lodash.omit');