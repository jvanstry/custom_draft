var helper = require('./helpers/draft-round-helper');
var arrayShuffle = require('./helpers/shuffle-array');

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
      startDraft: function(membersIds, cb){
        var orderArray = arrayShuffle(membersIds);
        this.order = orderArray.join('-');

        this.save(function(err){
          if(err){
            console.error(err);
          }

          cb(null, orderArray);
        });
      }
    },
    cache: false
  });

  db.models.draft.updateActivePicker = function(id, overallPick, pickerId, draftOrder, cb){
    // should prob at least change the arity of this func to a config obj
    // todo: think about making an instance method

    var orderArr = draftOrder.split('-');
    var numOfPlayers = orderArr.length;
    var pickerSpot = orderArr.indexOf(pickerId.toString());
    var round = Math.ceil(overallPick / numOfPlayers);
    var activePickerIndex = helper.snakeOrderHandling(pickerSpot, round);
    var activePickerId = parseInt(orderArr[activePickerIndex]);

    db.models.draft.get(id, function(err, result){
      if(err){
        console.error(err);
      }

      var roundsInDraft = result.rounds;

      result.save({ active_picker_id: activePickerId }, function(err, updatedResult){
        var isLastPick = helper.isLastPickOfDraft(overallPick, roundsInDraft, numOfPlayers);
        
        cb(err, isLastPick || activePickerId);
      });
    });
  };

  db.models.draft.calculateOverallPickNumber = function(id, cb){
    db.models.draftee.find({ draft_id: id }, [ "createdAt", "Z" ], 1, 
      function(err, result){
        if(err, !result){
          var message = err || 'no result';
          cb(message);
        }

        var lastDrafteePicked = result[0];

        var overallPick = lastDrafteePicked.overallPick || 0;
        overallPick++;
        cb(overallPick);
      });
  }
  
  db.models.draft.hasOne('league', db.models.league, {
    required: true,
    reverse: 'draft',
    autoFetch: true
  });
  db.models.draft.hasOne('active_picker', db.models.uzer);
};
