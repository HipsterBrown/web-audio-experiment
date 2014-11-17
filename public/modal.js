// Start off by initializing a new context.
var AudioContext = window.AudioContext || window.webkitAudioContext;
//var context = new AudioContext();
//
// if (!context.createGain) {
//   context.createGain = context.createGainNode;
// }
// if (!context.createDelay) {
//   context.createDelay = context.createDelayNode;
// }
// if (!context.createScriptProcessor) {
//   context.createScriptProcessor = context.createJavaScriptNode;
// }

// shim layer with setTimeout fallback
window.requestAnimFrame = (function(){
  'use strict';

  return  window.requestAnimationFrame       ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame    ||
    window.oRequestAnimationFrame      ||
    window.msRequestAnimationFrame     ||
    function( callback ){
      window.setTimeout(callback, 1000 / 60);
    };
})();

document.addEventListener('DOMContentLoaded', function(){
  'use strict';

  var modal = document.getElementById('modal');

  var bycBuffer = null;

  var analyzer;
  var bufferLength;
  var dataArray;

  var animateVisual = null;

  var canvas = document.getElementById('soundBar');
  var drawCtx = canvas.getContext('2d');

  var WIDTH = modal.getBoundingClientRect().width;
  var HEIGHT = 100;

  canvas.width = WIDTH;
  canvas.height = HEIGHT;


  function animate() {
    animateVisual = requestAnimFrame(animate);

    analyzer.getByteTimeDomainData(dataArray);

    drawCtx.fillStyle = 'rgb(252,186,45)';
    drawCtx.fillRect(0, 0, WIDTH, 100);

    drawCtx.lineWidth = 6;
    drawCtx.strokeStyle = 'rgb(256,256,256)';

    drawCtx.beginPath();

    var sliceWidth = WIDTH * 0.5 / bufferLength;
    var x = 0;
    var y;


    for(var i = 0; i < bufferLength; i++) {

      var v = dataArray[i] / 80.0;
      y = v * HEIGHT / 3;

      if(i === 0) {
        drawCtx.moveTo(x, 53);
        x = WIDTH / 4;
      } else {
        drawCtx.lineTo(x, y);
      }

      x += sliceWidth;
    }

    drawCtx.lineTo(canvas.width, 53);
    drawCtx.stroke();
}

var fbRAF = null;

function fallBack() {
  var audioEl = document.createElement('audio');
  audioEl.src = 'BYC.mp3';

  modal.appendChild(audioEl);

  audioEl.addEventListener('canplaythrough', function(){
    audioEl.play();

    fbAnim();
  });

  audioEl.addEventListener('ended', function(){
    window.cancelAnimationFrame(fbRAF);

    drawCtx.fillStyle = 'rgb(252,186,45)';
    drawCtx.fillRect(0, 0, WIDTH, 100);

    drawCtx.lineWidth = 6;
    drawCtx.strokeStyle = 'rgb(256,256,256)';

    drawCtx.beginPath();
    drawCtx.moveTo(0, 53);
    drawCtx.lineTo(canvas.width, 53);
    drawCtx.stroke();
  });
}

function fbAnim() {
  fbRAF = requestAnimFrame(fbAnim);

  var len = 140;
  var slice = WIDTH * 0.5 / len;
  var X = 0;

  drawCtx.fillStyle = 'rgb(252,186,45)';
  drawCtx.fillRect(0, 0, WIDTH, 100);

  drawCtx.lineWidth = 6;
  drawCtx.strokeStyle = 'rgb(256,256,256)';

  drawCtx.beginPath();
  drawCtx.moveTo(0, 53);

  X = WIDTH / 4;

  drawCtx.lineTo(X, 53);

  for(var f = 0; f < len; f++) {
    var mix = Math.random() < 0.5 ? 1 : -1;
    var Y = getRandomInt(60, 30);

    console.log(mix, Y);

    drawCtx.lineTo(X, Y);

    X += slice;
  }

  drawCtx.lineTo(X, 53);
  drawCtx.lineTo(canvas.width, 53);
  drawCtx.stroke();
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}


function playSound(buffer) {
  analyzer = audio.createAnalyser();
  analyzer.smoothingTimeConstant = 0.8;
  analyzer.fftSize = 2048;

  analyzer.connect(audio.destination);

  bufferLength = analyzer.frequencyBinCount * 1.5;
  dataArray = new Uint8Array(bufferLength);


  analyzer.getByteTimeDomainData(dataArray);


  console.log(bufferLength);

  var src = audio.createBufferSource();

  src.buffer = buffer;

  src.connect(analyzer);

  src.connect(audio.destination);

  if ('ontouchstart' in window) {
      modal.addEventListener('touchstart', function(){
        src.connect(audio.destination);

        src.start(0);

      });

      animate();
  } else {
    src.start(0);

    animate();
  }
}

function loadBYCSound(url) {
  var request = new XMLHttpRequest();
  request.open('GET', url, true);
  request.responseType = 'arraybuffer';

  // Decode asynchronously
  request.onload = function() {
    audio.decodeAudioData(request.response, function(buffer) {
      bycBuffer = buffer;

      playSound(bycBuffer);
    }, function(err) {
      console.log('Error loading sound: ', err);
    });
  };
  request.send();
}

if (!!AudioContext) {
    var audio = new AudioContext();
    loadBYCSound('BYC.mp3');
} else {
  fallBack();
  return;
}



}, false);
