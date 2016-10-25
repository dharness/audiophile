const $ = require('jquery');
console.log($);

var recordButton = document.querySelector('#recordButton');
var stopButton = document.querySelector('#stopButton');
var audioPlayerSource = document.querySelector('#audioPlayerSource');
var audioPlayer = document.querySelector('#audioPlayer');

var chunks = [];
navigator.mediaDevices.getUserMedia({audio: true})
  .then((stream) => {
    var mediaRecorder = new MediaRecorder(stream);

    recordButton.onclick = function() {
      mediaRecorder.start();
      recordButton.style.color = 'red';
    };

    stopButton.onclick = function() {
      mediaRecorder.stop();
      recordButton.style.background = "";
      recordButton.style.color = "";
    };

    mediaRecorder.onstop = function(e) {
      var blob = new Blob(chunks, { 'type' : 'audio/wav' });
      chunks = [];
      var audioURL = window.URL.createObjectURL(blob);
      audioPlayerSource.src = audioURL;
      audioPlayer.load();
      audioPlayer.play();
      saveToDisk(blob);
    };

    mediaRecorder.ondataavailable = function(e) {
      chunks.push(e.data);
    };
  })
  .catch((err) => console.log(err));


function saveToDisk(blob) {
  var reader = new FileReader();
  reader.onload = function(event) {
    var buffer = event.target.result;
    var view   = new Int32Array(buffer);
    console.log(view);
  }

  function save (blob, fileName) {
      var a = document.createElement("a");
      document.body.appendChild(a);
      a.style = "display: none";
      url = window.URL.createObjectURL(blob);
      a.href = url;
      a.download = fileName;
      a.click();
      window.URL.revokeObjectURL(url);
  };
  save(blob, 'foo.wav')
}
