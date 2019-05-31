let target = ["渡邉","渡邊","濱邊","渡辺"];
let startTime;
let isPlaying = false;
let correctCount = 0;
let incorrectCount =0;
let passedTime =0;
let timeoutId ;
let gameSet;
let wordDirect = [biggerWord,spinnerWord,moveWord];
let fontSize=0;
let angle =0;
let marginLeft=600;
let marginRight=0;
let marginToggle= true;

$("#start").on('click',function(){
  $(this).hide();
  startGame();
})

function resetGame(){
  $('#start').show();
  $('#target').text("")
    .css('transform','rotate(0deg)')
    .css('font-size','30px')
    .css('margin-left','0px')
    .css('margin-right','0px');
  $('#correctCounter').text('0');
  $('#incorrectCounter').text('0');
  $('#timer_label').text('0.00');
  correctCount=0;
  incorrectCount=0;
  passedTime=0;
  fontSize=0;
  angle =0;
  marginLeft=600;
  marginRight=0;
  marginToggle= true;
}


function startGame(){
  isPlaying=true;
  startTime=Date.now();
  $("#timer_label").text('0.00');
  nextWord();
  updateTimer();
  
}

function updateTimer(){
  passedTime = Date.now()-startTime;
  $('#timer_label').text((passedTime/1000).toFixed(2));
   timeoutId = setTimeout(function(){updateTimer()
  },10)
}

function nextWord(){
  if(correctCount==5){
    clearTimeout(timeoutId);
    let result;
    if(passedTime<7000){
      result = "キングオブワタナベ";
    }else if(passedTime<10000){
      result="ワタナベを知り尽くした男"
    }else if(passedTime<15000){
      result="普通のワタナベ"
    }else{
      result="ワタナベではない"
    }
    alert('あなたは、 '+result);
    resetGame();
    isPlaying=false;
    return;
  }
  let i = Math.floor(Math.random()*4);
  $('#target').text(target[i]);
  $('.answer_btn').eq(i).addClass('truth');
  let j = Math.floor(Math.random()*3);
  wordDirect[j].call(); 
  gameJudge();
}

function biggerWord(){
  $('#target').css('font-size',fontSize+'px');
  fontSize+=0.01;
  gameSet = setTimeout(function(){biggerWord(),20});
}

function spinnerWord(){
  $('#target').css('transform','rotate('+angle+'deg)');
  angle += 5;
  gameSet = setTimeout(function(){spinnerWord()},10);
}

function moveWord(){
  $('#target').css('margin-left',marginLeft+'px');
  $('#target').css('margin-right',marginRight+'px');

  if(marginLeft<0){
    marginToggle=false;
  }else if(marginLeft>600){
    marginToggle=true;
  }

  if(marginToggle){
    marginLeft -=10;
    marginRight +=10;
  }else{
    marginLeft +=10;
    marginRight -=10;
  }

  gameSet = setTimeout(function(){
    moveWord();
  },10)
}

function gameJudge(){
  $('.answer_btn').not('.truth').each(function(i,elm){
    $(elm).on('click',function(){
      incorrectCount +=1;
      $('#incorrectCounter').text(incorrectCount);
      clickAnswer('B');
    })
  })
    
  

  $('.truth').on('click',function(e){
    correctCount +=1;
    $('#correctCounter').text(correctCount);
    clickAnswer('A');
  });
}

function clickAnswer(ver){
      $('#sound'+ver)[0].currentTime=0;
      $('#sound'+ver)[0].play();
      clearTimeout(gameSet);
      $('#target').css('font-size','30px');
      $('#answer').children().each(function(i,elm){
        $(elm).off('click');
      });
      $('.truth').removeClass('truth');
      nextWord();
}