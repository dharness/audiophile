const Vue = require('vue');
const recordButton = require('./recordButton.js');
const blobUtil = require('blob-util');
const electron = require('electron');

// Set this here as a global var because we need it in
// both styles and logic. Not sure of a better way
const recordTime = 3000;

const recordPanel = Vue.component('record-panel', {
  template: `
    <div class="record-panel">
        <record-button :recording=recording :recorder=recorder :start-recording=startRecording :on-recording-stopped=onRecordingStopped></record-button>
    </div>`,
    props: ['recorder'],
    data: () => {return { count: 0, recording: false }},
    methods: {
      startRecording() {
        this.recording = true;
        this.recorder.setRecordingDuration(recordTime)
            .onRecordingStopped(this.onRecordingStopped);
        this.recorder.startRecording();
      },
      onRecordingStopped() {
        this.count++;
        let blob = this.recorder.getBlob();

        blobUtil.blobToArrayBuffer(blob).then((arrayBuffer) => {
          this.recording = false;
          let uint16Array = new Uint16Array(arrayBuffer);
          electron.ipcRenderer.send('download-btn', {url: URL.createObjectURL(blob) })
        })
      }
    }
});

module.exports = recordPanel;
