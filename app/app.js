const Vue = require('vue');
const recordButton = require('./recordButton.js');
var RecordRTC = require('recordrtc');


navigator.mediaDevices.getUserMedia({audio: true})
  .then((stream) => {

  var recorder = RecordRTC(stream, {
    type: 'audio' 
  });

  var app = new Vue({
    el: '#Recorder-App',
    data: { recorder },
    template: `
      <div>
        <h1> Sqwak Recorder </h1>
        <audio id="audioPlayer" controls="controls" style="display: none">
          <source id="audioPlayerSource" src="http://www.w3schools.com/tags/horse.ogg" type="audio/mp3">
        </audio>
        <record-button :recorder=recorder :on-complete=onComplete></record-button>
      </div>  
    `,
    methods: {
      onComplete() {
        console.log('DOne');
      }
    }
  })
});
