module.exports = function(orm, db){
  var Pick = db.define('pick', {
    id: { type: 'number', required: true },
    createdAt: { type: 'date', time: true }
  },
  {
    hooks: {
      beforeValidation: function(){
        this.createdAt = new Date();
      }
    },
    methods: {
      slot: function () {
        return this.id;
      }      
    }
  });

  Pick.hasOne('user', db.models.user, {
    required: true,
    reverse: 'draftPick',
    autoFetch: true
  });
  Pick.hasOne('draftee', db.models.draftee, {
    required: true,
    reverse: 'selection',
    autoFetch: true
  });
};