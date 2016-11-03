const Vue = require('vue');
const soundViewer = require('./soundViewer.js');


const viewPanel = Vue.component('view-panel', {
  template: `
    <div>
      <sound-viewer :src=wavFile></sound-viewer>
      <audio id="audioPlayer" controls="controls" class="audio-player">
        <source :src=wavFile type="audio/mp3">
      </audio>
    </div>`,
    props: ['wav-file']
});

module.exports = viewPanel;
