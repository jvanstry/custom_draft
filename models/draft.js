module.exports = function(orm, db){
  db.define('draft', {
    start_time: { type: 'date', required: true, time: true },
    order: { type: 'text' },
    createdAt: { type: 'date', time: true }
  },
  {
    hooks: {
      beforeValidation: function(){
        this.createdAt = new Date();
        this.start_time = Date.parse(new Date(this.start_time));
      }, 
      beforeSave: function(){
        this.start_time = new Date(this.start_time);
      }
    },
    validations: {
      start_time: orm.enforce.ranges.number(Date.now(), undefined, 'draft must be in future')
    },
    methods: {
      calculateCurrentSelectionNumber: function(pickerId, round){
      //   var currentPick = (round - 1) * (this.order.length);
      //   if(round % 2){
      //     return 1;
      //     //odd
      //   }
      // }
        return 1;
      }
    },
    cache: true
  });
  
  db.models.draft.hasOne('league', db.models.league, {
    required: true,
    reverse: 'draft',
    autoFetch: true
  });
  db.models.draft.hasOne('active_picker', db.models.uzer, {
    autoFetch: true
  });
};
