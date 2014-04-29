var helper = require('../test-helper');


describe('Uzer class', function(){
  before(helper.dbSetup);
  before(helper.modelSetup);
  after(helper.dbCleanup)


  describe('creating a uzer', function(){
    it('should work', function(){
      // this.timeout(0);
      expect(1).to.equal(1);     
    });
    it('should poop', function(){
      // this.timeout(0);
      expect('poop').to.equal('poop');     
    });
  });
});