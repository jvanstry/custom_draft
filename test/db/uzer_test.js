var helper = require('../test-helper');
var Uzer;

var validProperties = { email: 'jer@example.com', 
  password: 'notSecurezYet', name: 'jerbear' };

var makePwHash = require('../../models/helpers/make-hash-pw');
validProperties.password_hash = makePwHash(validProperties.password);

function referenceUzer(){
  Uzer = models.uzer;
};  

describe('Uzer class', function(){
  beforeEach(helper.dbSetup);
  beforeEach(helper.modelSetup);
  beforeEach(referenceUzer);
  afterEach(helper.dbCleanup);


  describe('Saving uzer to db', function(){
    it('should should not save without a name', function(done){
      var noName = omit(validProperties, 'name');

      Uzer.create(noName, function(err){
        expect(err).to.exist;


        Uzer.find({ email: validProperties.email }, function(err, results){
          expect(results).to.be.empty;
          done();
        });
      });
    });

    it('should should not save without a email', function(done){
      var noEmail = omit(validProperties, 'email');

      Uzer.create(noEmail, function(err){
          expect(err).to.exist;

        Uzer.find({ name: validProperties.name }, function(err, results){
          expect(results).to.be.empty;
          done();
        });
      });
    });

    it('should not allow duplicate uzer emails', function(done){
      Uzer.create(validProperties, function(err, results){
        expect(err).to.not.exist;
        expect(results).to.exist;
        
        Uzer.create(validProperties, function(err, results){
          expect(err).to.exist;
          expect(results).to.not.exist;

          done();
        });
      });
    });

    it('should not save without a password', function(done){
      var noPassword = omit(validProperties, 'password_hash');

      Uzer.create(noPassword, function(err){
        expect(err).to.exist;

        Uzer.find(noPassword, function(err, results){
          expect(results).to.be.empty;
          done();
        });
      });    
    });

    it('should save with valid properties', function(done){
      Uzer.create(validProperties, function(err){
        expect(err).to.not.exist;

        Uzer.find({ email: validProperties.email }, function(err, results){
          console.log(results[0].createdAt);  
          expect(results[0].name).to.equal(validProperties.name);
          expect(results.length).to.equal(1);
          done();
        });
      }); 
    })
  });
});