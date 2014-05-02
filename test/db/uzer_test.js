var helper = require('../test-helper');
var Uzer;
var path = require('path');

// var validProperties = { email: 'jer@example.com', 
//   password: 'notSecurezYet', password_hash: 'notSecurezYet', 
//   name: 'jerbear', poop: 'hi' };

function referenceUzer(){
  Uzer = models.uzer;
};  

describe('Uzer class', function(){
  beforeEach(helper.dbSetup);
  beforeEach(helper.modelSetup);
  beforeEach(referenceUzer);
  afterEach(helper.dbCleanup);

  describe('Saving uzer to db', function(){
    var validProperties = { email: 'jer@example.com', 
      password: 'notSecurezYet', password_hash: 'notSecurezYet', 
      name: 'jerbear'};
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
          expect(results[0].name).to.equal(validProperties.name);
          expect(results.length).to.equal(1);
          done();
        });
      }); 
    });
  });
  
  describe('#authenticate', function(){
    var validProperties = { email: 'jer@example.com', 
      password: 'notSecurezYet', password_hash: 'notSecurezYet', 
      name: 'jerbear'};
    beforeEach(function(done){
      Uzer.create(validProperties, function(err){
        done();
      });
    });

    it('should not login uzer with invalid credentials', function(done){
      Uzer.authenticate(validProperties.email, 'not the pw', function(uzer){
        expect(uzer.error).to.exist;
        done();      
      });
    });

    it('should login uzer with valid credentials', function(done){
      Uzer.authenticate(validProperties.email, 'notSecurezYet', function(uzer){
        expect(uzer.name).to.equal(validProperties.name);
        done();
      });
    });

    it('should let it be known that no user found by email', function(done){
      Uzer.authenticate('nobodies email', 'notSecurezYet', function(uzer){
        expect(uzer.error).to.equal('no uzer by that email found');
        done();
      })
    })
  });
});