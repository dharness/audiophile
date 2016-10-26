const Vue = require('vue');
require('./styles/record-button.css');
const blobUtil = require('blob-util');
const electron = require('electron')

// Set this here as a global var because we need it in
// both styles and logic. Not sure of a better way
const recordTime = 3000;

const recordButtonComponent = Vue.component('record-button', {
  template: `
    <button :disabled=recording :style=style class="record-button" v-bind:class="{ 'loading': recording}" v-on:click=startRecording>
      <div v-if="recording">Recording...</div>
      <div v-else>Record!</div>
    </button>
  `,

  data: () => { return {
    recording: false,
    style: {
      transition: `background-position ${recordTime}ms linear`
    }
  }},

  props: ['recorder', 'on-complete'],

  methods: {
    startRecording() {
      this.recording = !this.recording;
      this.recorder.setRecordingDuration(recordTime)
          .onRecordingStopped(this.onRecordingStopped);
      this.recorder.startRecording();
    },
    onRecordingStopped() {
      let blob = this.recorder.getBlob();

      var hyperlink = document.createElement('a');
      hyperlink.href = URL.createObjectURL(blob);
      hyperlink.target = '_blank';
      hyperlink.download = 'blob.wav';

      var evt = new MouseEvent('click', {
          view: window,
          bubbles: true,
          cancelable: true
      });

      hyperlink.innerHTML = hyperlink.href;
      document.body.appendChild(hyperlink);
      blobUtil.blobToArrayBuffer(blob).then((arrayBuffer) => {
        let uint16Array = new Uint16Array(arrayBuffer);
        // this.onComplete(uint16Array);
        electron.ipcRenderer.send('download-btn', {url: hyperlink.href})
      })
      // hyperlink.dispatchEvent(evt);
    },
    saveRecording() {
      this.recorder.stopRecording(() => {
        this.recorder.save('foo');
      });
    }
  }
});

module.exports = recordButtonComponent;
