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

    it('Should render the new user form view', function(done){
      request(app)
        .get(newUzerRoute)
        .expect(200).end(function(err, res){
          if(err){
            return done(err);
          }

          expect(res.body).to.contain('form');
          done();
        });
    });
  });

  describe('#create', function(){
    var createUzerRoute = '/signup';
    var validArgs = { name: 'jerry', email: 'jer@fun.com', 
      password_hash: '14monkeys' };
    var uzerCreateStub;
    var newlyCreatedUzerId = 3;

    beforeEach(function(){
      uzerCreateStub = sinon.stub(models.uzer, 'create')
        .callsArgWith(1, null, { id: newlyCreatedUzerId });
    });

    afterEach(function(){
      models.uzer.create.restore();
    });


    it('Should be accessible by anyone', function(done){
      request(app)
        .post(createUzerRoute)
        .form(validArgs)
        .expect(302).end(done);
    });

    it('should call create uzer method', function(done){
      request(app)
        .post(createUzerRoute)
        .form(validArgs)
        .expect(302).end(function(err, res){
          if(err){
            return done(err);
          }

          expect(uzerCreateStub.calledWith(validArgs)).to.equal(true);
          done();
        });
    });

    it('should render the newly created draft view', function(done){
      request(app)
        .post(createUzerRoute)
        .form(validArgs)
        .expect(302).end(function(err, res){
          if(err){
            return done(err);
          }

          expect(res.headers.location).to.contain('user/' + newlyCreatedUzerId);
          done();
        });
    });
  });

  describe('#get', function(){
    var getUzerRoute = '/user/' + 1;
    var uzerName = 'jerbear';

    it('Should be accessible by anyone', function(done){
      request(app)
        .get(getUzerRoute)
        .expect(200).end(done);
    });

    it('Should render the uzer homepage', function(done){
      request(app)
        .get(getUzerRoute)
        .expect(200).end(function(err, res){
          expect(res.body).to.contain(uzerName + ' home');
          done();
        });
    });
  });
});