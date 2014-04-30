module.exports = function(orm, db){
  var Draftee = db.define('draftee', {
    name: { type: 'text', required: true },
    overallPick: { type: 'number' },
    available: { type: 'boolean', defaultValue: true },
    score: { type: 'number', defaultValue: 0 },
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

  Draftee.hasOne('draft', db.models.draft, {
    required: true,
    autoFetch: true
  });

  Draftee.hasOne('picker', db.models.uzer, {
    autoFetch: true
  });

  // db.models.draft.hasMany('eligiblePicks', Draftee);

  // db.models.uzer.hasMany('draftPicks', Draftee);

  db.models.draft.sync();
  db.models.uzer.sync();
  Draftee.sync();
};