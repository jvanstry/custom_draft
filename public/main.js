$(document).ready(function(){
  marginFixer();
  $(window).on('resize', marginFixer);
});

function marginFixer(){
  var width = $('.body').width();
  var container = $('.body > .container');

  if(width < 960){
    container.css('margin-left', 0)
  }else{
    var marginLeft = (width - 960) / 2 ; 
    container.css('margin-left', marginLeft);
  }
}

