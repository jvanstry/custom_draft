module.exports = function(orm, db){
  var Draftee = db.define('draftee', {
    name: { type: 'text', required: true },
    available: { type: 'boolean', defaultValue: true },
    createdAt: { type: 'date', time: true }
  },
  {
    hooks: {
      beforeValidation: function(){
        this.createdAt = new Date();
      }
    },
    validations: {
      name: orm.enforce.ranges.length(1, 128)
    },
    methods: {

    }
  });

  Draftee.hasOne('draft', db.models.draft);
};