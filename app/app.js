const Vue = require('vue');
// Components
const recordButton = require('./recordButton.js');
const fileViewer = require('./fileViewer.js');
const soundViewer = require('./soundViewer.js');
// Styles
require('./styles/override.css');
require('./styles/colors.css');
require('./styles/layout.css');
// Etc
var RecordRTC = require('recordrtc');
var Chart = require('chart.js');
const electronApp = require('electron').remote.app;
const processAudio = require('./processAudio.js');
const fs = require('fs');


navigator.mediaDevices.getUserMedia({audio: true})
  .then((stream) => {

    var recorder = RecordRTC(stream, {
      type: 'audio',
      disableLogs: true,
      autoWriteToDisk: true
    });

    var app = new Vue({
      el: '#Recorder-App',
      template: `
        <div class="app-layout">
          <file-viewer :file-selected=displayFile></file-viewer>
          <div class="main-panel">
            <h1 class="title"> Sqwak Labs </h1>
            <sound-viewer :src=currentFile></sound-viewer>
            <audio id="audioPlayer" controls="controls" class="audio-player">
              <source :src=currentFile type="audio/mp3">
            </audio>
            <record-button :recorder=recorder :on-complete=onComplete></record-button>
            <button v-on:click="upload"> Upload </button>
          </div>
        </div>
      `,
      data: {
        recorder,
        currentFile: ''
      },
      methods: {
        onComplete(data) {
          console.log('New Recording!!');
        },
        displayFile(fileName) {
          const audio = document.getElementById('audioPlayer');
          this.currentFile = `${electronApp.getAppPath()}/data/${fileName}`;
          audio.load();
          audio.play();
        },
        upload() {
          const testFolder = './data';
          fs.readdir(testFolder, (err, files) => {
            files.forEach(fileName => {
              if (fileName.split('.')[1] === 'wav') {
                const filePath = `${electronApp.getAppPath()}/data/${fileName}`;
                processAudio(filePath).then(amplitudes => {
                  console.log(amplitudes.length);
                })
              }
            })
          })
        }
      },
    })
});
