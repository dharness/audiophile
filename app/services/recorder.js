const $ = require('jquery');
var RecordRTC = require('recordrtc');


var recordButton = document.querySelector('#recordButton');
var stopButton = document.querySelector('#stopButton');
var audioPlayerSource = document.querySelector('#audioPlayerSource');
var audioPlayer = document.querySelector('#audioPlayer');

var chunks = [];
navigator.mediaDevices.getUserMedia({audio: true})
  .then((stream) => {

    var recorder = RecordRTC(stream, {
      type: 'audio' 
    });

    recorder.setRecordingDuration(7000);
    recordButton.onmousedown = function() {
      recorder.startRecording();
      recordButton.style.color = 'red';
    };

    recordButton.onmouseup = function() {
      saveRecording();
      
      recordButton.style.background = "";
      recordButton.style.color = "";
    };

    function saveRecording() {
      recorder.stopRecording(function() {
        recorder.save('foo');
        var audioURL = recorder.toURL();
        audioPlayerSource.src = audioURL;
        audioPlayer.load();
        audioPlayer.play();
      });
    }
  })
  .catch((err) => console.log(err));


