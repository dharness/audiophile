const Vue = require('vue');
require('./styles/record-button.css');


const recordButtonComponent = Vue.component('record-button', {
  template: `
  <button class="progress-button" data-style="rotate-angle-bottom" data-perspective data-horizontal>
    <span class="progress-wrap">
      <span class="content">Submit</span>
      <span class="progress">
        <span class="progress-inner"></span>
      </span>
    </span>
  </button>
  `,
  props: ['recorder', 'on-complete'],
  methods: {
    startRecording() {
      this.onComplete();
      // this.recorder.startRecording();
      //recordButton.style.color = 'red';
    },
    stopRecording() {
      this.saveRecording();
      
      // recordButton.style.background = "";
      // recordButton.style.color = "";
    },

    saveRecording() {
      this.recorder.stopRecording(function() {
        this.recorder.save('foo');
        var audioURL = this.recorder.toURL();
        audioPlayerSource.src = audioURL;
        audioPlayer.load();
        audioPlayer.play();
      });
    }
  }
});



module.exports = recordButtonComponent;
