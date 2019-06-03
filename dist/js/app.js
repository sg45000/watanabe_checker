"use strict";

var target = ["渡邉", "渡邊", "濱邊", "渡辺"];
var startTime;
var isPlaying = false;
var correctCount = 0;
var incorrectCount = 0;
var passedTime = 0;
var timeoutId;
var gameSet;
var wordDirect = [biggerWord, spinnerWord, moveWord];
var fontSize = 0;
var angle = 0;
var marginLeft = 320;
var marginRight = 0;
var marginToggle = true;
var score = 0;
$(document).on('click', "#desc_btn", function () {
  $('#desc').css('display', 'inline-block');
});
$(".fa-times").on('click', function () {
  $('#desc').css('display', 'none');
});
$("#start").on('click', function () {
  $(this).hide();
  startGame();
});

function resetGame() {
  $('#start').show();
  $('#target').text("").css('transform', 'rotate(0deg)').css('font-size', '30px').css('margin-left', '0px').css('margin-right', '0px');
  $('#correctCounter').text('0');
  $('#incorrectCounter').text('0');
  $('#timer_label').text('0.00');
  $('#score').text('0点');
  correctCount = 0;
  incorrectCount = 0;
  passedTime = 0;
  fontSize = 0;
  angle = 0;
  marginLeft = 320;
  marginRight = 0;
  marginToggle = true;
  score = 0;
}

function startGame() {
  isPlaying = true;
  startTime = Date.now();
  $("#timer_label").text('0.00');
  nextWord();
  updateTimer();
}

function updateTimer() {
  passedTime = Date.now() - startTime;
  $('#timer_label').text((passedTime / 1000).toFixed(2));
  timeoutId = setTimeout(function () {
    updateTimer();
  }, 10);
}

function scoreCalc(correct) {
  var point = 0;

  if (passedTime < 3000) {
    point = 500;
  } else if (passedTime < 10000) {
    point = 300;
  } else if (passedTime < 20000) {
    point = 200;
  } else {
    point = 100;
  }

  if (correct) {
    score += point;
  } else {
    score -= point;
  }

  if (score < 0) {
    score = 0;
  }

  $('#score').text(score + '点');
}

function result() {
  var result;

  if (score > 2000) {
    result = "キングオブワタナベ";
  } else if (score > 1500) {
    result = "ワタナベを知り尽くした男";
  } else if (score > 1000) {
    result = "普通のワタナベ";
  } else if (score > 500) {
    result = "ワタナベではない";
  } else {
    result = "人間のクズ";
  }

  return result;
}

function nextWord() {
  if (correctCount == 5) {
    clearTimeout(timeoutId);
    alert(score + '点   あなたは、 ' + result());
    resetGame();
    isPlaying = false;
    return;
  }

  var i = Math.floor(Math.random() * 4);
  $('#target').text(target[i]);
  $('.answer_btn').eq(i).addClass('truth');
  var j = Math.floor(Math.random() * 3);
  wordDirect[j].call();
  gameJudge();
}

function biggerWord() {
  $('#target').css('font-size', fontSize + 'px');
  fontSize += 0.01;
  gameSet = setTimeout(function () {
    biggerWord(), 20;
  });
}

function spinnerWord() {
  $('#target').css('transform', 'rotate(' + angle + 'deg)');
  angle += 5;
  gameSet = setTimeout(function () {
    spinnerWord();
  }, 10);
}

function moveWord() {
  $('#target').css('margin-left', marginLeft + 'px');
  $('#target').css('margin-right', marginRight + 'px');

  if (marginLeft < 0) {
    marginToggle = false;
  } else if (marginLeft > 320) {
    marginToggle = true;
  }

  if (marginToggle) {
    marginLeft -= 10;
    marginRight += 10;
  } else {
    marginLeft += 10;
    marginRight -= 10;
  }

  gameSet = setTimeout(function () {
    moveWord();
  }, 10);
}

function gameJudge() {
  $('.answer_btn').not('.truth').each(function (i, elm) {
    $(elm).on('click', function () {
      incorrectCount += 1;
      $('#incorrectCounter').text(incorrectCount);
      scoreCalc(false);
      clickAnswer('B');
    });
  });
  $('.truth').on('click', function (e) {
    correctCount += 1;
    $('#correctCounter').text(correctCount);
    scoreCalc(true);
    clickAnswer('A');
  });
}

function clickAnswer(ver) {
  $('#sound' + ver)[0].currentTime = 0;
  $('#sound' + ver)[0].play();
  clearTimeout(gameSet);
  $('#target').css('font-size', '30px');
  $('#answer').children().each(function (i, elm) {
    $(elm).off('click');
  });
  $('.truth').removeClass('truth');
  nextWord();
}