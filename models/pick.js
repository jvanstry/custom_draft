module.exports = function(orm, db){
  var Pick = db.define('pick', {
    overallPick: { type: 'number' },
    createdAt: { type: 'date', time: true }
  },
  {
    hooks: {
      beforeValidation: function(){
        this.createdAt = new Date();
      }
    },
    methods: {
    
    }
  });

  Pick.hasOne('user', db.models.users, {
    required: true,
    reverse: 'draftPicks',
    autoFetch: true
  });
  Pick.hasOne('draftee', db.models.draftee, {
    required: true,
    reverse: 'selection',
    autoFetch: true
  });
};