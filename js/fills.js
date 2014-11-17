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
