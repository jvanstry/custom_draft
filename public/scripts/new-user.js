$(document).ready(function(){
  var isPwMismatchUp;

  var form = $('#newUser');
  form.on('submit', function(e){
    var pw = $('form .form-pw').val();
    var confirm = $('form .form-confirm').val();

    if(pw !== confirm){
      e.preventDefault();

      notifyPwMismatch();
    }
  });

  function notifyPwMismatch(){
    if(!isPwMismatchUp){
      form.append("<h2 class='alert pw-mismatch'>Passwords Must Match</h2>");
      isPwMismatchUp = true;
    }else{
      $('.pw-mismatch').remove();
      setTimeout(function(){
        form.append("<h2 class='alert pw-mismatch'>Passwords Must Match</h2>");  
      }, 75);
    }
  }
});