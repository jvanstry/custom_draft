module.exports = function(orm, db){
  db.define('draft', {
    start_time: { type: 'date', required: true, time: true },
    order: { type: 'text' },
    rounds: { type: 'number' },
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

    },
    cache: false
  });

  db.models.draft.updateActivePicker = function(id, overallPick, pickerId, draftOrder, cb){
    var orderArr = draftOrder.split('-');
    var players = orderArr.length;
    var pickerSpot = orderArr.indexOf(pickerId.toString());
    var activePickerIndex;

    var round = Math.ceil(overallPick / players);

    if(round % 2){
      activePickerIndex = pickerSpot + 1;
    }else{
      activePickerIndex = pickerSpot - 1;
    }

    var activePickerId = parseInt(orderArr[activePickerIndex]);

    db.models.draft.get(id, function(err, result){
      if(err){
        console.error(err);
      }

      result.save({ active_picker_id: activePickerId }, function(err, updatedResult){
        cb(err, activePickerId);
      });
    });
  };
  
  db.models.draft.hasOne('league', db.models.league, {
    required: true,
    reverse: 'draft',
    autoFetch: true
  });
  db.models.draft.hasOne('active_picker', db.models.uzer);
};
