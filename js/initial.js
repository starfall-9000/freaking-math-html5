$(document).ready(function(){
  // app open
  $('#score').html('0');
  randNum();
});

$(document).on('click', 'button', function(){
	check($(this).attr('value'));
});

var operators = ['+', '-'];
var true_result = 0;
var show_result = 0;

function randNum(){
  // random math: 2 number, operator and show_result
  // true_result - 1 <= show_result <= true_result + 1
  var num1 = Math.floor(Math.random()*20 + 1);
  var num2 = Math.floor(Math.random()*20 + 1);
  switch(operators[Math.floor(Math.random() * operators.length)]) {
    case '+':
    	$('.operator').html('+');
    	true_result = num1 + num2;
  		show_result = true_result - Math.floor(Math.random() * 2);
      break;
    case '-':
    	$('.operator').html('-');
    	true_result = num1 - num2;      
  		show_result = true_result + Math.floor(Math.random() * 2);
      break;
  }
  
  // show random number to web
  $('.num1').html(num1);
  $('.num2').html(num2);
  $('.result').html(show_result);
}

function check(arg){
  // check the result
	if((arg == "true" && true_result == show_result) || (arg != "true" && true_result != show_result)){
    	var score = parseInt($('#score').text());
      $('#score').text(score + 1);			
  		$('#time').css('width', '300');
			count_down();
    	randNum();
   } else {
     disable_all();
     alert('GaMeOvEr');
   }
}


function disable_all(){
	$(document).find('button').attr('disabled', 'true');
}


function count_down(){
  // set time out for per question
	setInterval(function(){
		$('#time').css('width', parseInt($('#time').css('width')) - 30);
    if($('#time').css('width') == 0){
    	clearInterval(this);
     	disable_all();
    	alert('gAmEoVeR');
    }
	}, 100);
}

