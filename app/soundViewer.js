const Vue = require('vue');
const fs = require('fs');
const Chart = require('chart.js');
const processAudio = require('./processAudio.js');


const soundViewer = Vue.component('sound-viewer', {
  template: `
    <div>
      <div id="waveform"></div>
    </div>`,
  props: ['src'],
  mounted() {
    this.wavesurfer = WaveSurfer.create({
      container: '#waveform'
    });
  },
  watch: {
    src() {
      this.wavesurfer.load(this.src);
    }
  }
});

module.exports = soundViewer;
