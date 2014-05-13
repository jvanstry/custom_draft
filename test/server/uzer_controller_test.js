var helper = require('../test-helper.js');
var app = require('../../app.js').start();
var request = require('super-request');

describe('Uzer Controller', function(){
  before(helper.dbSetup);
  before(helper.modelSetup);
  before(helper.seed);
  after(helper.dbCleanup);

  describe('#new', function(){
    var newUzerRoute = '/signup';

    it('Should be accessible by anyone', function(done){
      request(app)
        .get(newUzerRoute)
        .expect(200).end(done);
    });
  });

  describe('#create', function(){
    var createUzerRoute = '/signup';
    var validArgs = { name: 'jerry', email: 'jer@fun.com', 
      password_hash: '14monkeys' };

    beforeEach(function(){
      uzerCreateStub = sinon.stub(models.uzer, 'create')
        .callsArgWith(1, null, validArgs);
    });

    afterEach(function(){
      models.uzer.create.restore();
    });


    it('Should be accessible by anyone', function(done){
      request(app)
        .post(createUzerRoute)
        .form(validArgs)
        .expect(200).end(done);
    });
  });

  describe('#get', function(){
    var uzerId = 1;
    var getUzerRoute = '/user/' + uzerId;

    it('Should be accessible by anyone', function(done){
      request(app)
        .get(getUzerRoute)
        .expect(200).end(done);
    });

  });
});