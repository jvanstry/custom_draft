module.exports = function(orm, db){
  db.define('draftee', {
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

  db.models.draftee.hasOne('draft', db.models.draft, {
    required: true,
    autoFetch: true
  });

  db.models.draftee.hasOne('picker', db.models.uzer, 
  {
    reverse: 'draftPicks',
    autoFetch: true
  },
  {
    autoFetch: true
  });


  db.sync();
};