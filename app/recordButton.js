const Vue = require('vue');
require('./styles/record-button.css');

// Set this here as a global var because we need it in
// both styles and logic. Not sure of a better way
const recordTime = 3000;

const recordButtonComponent = Vue.component('record-button', {
  template: `
    <button :disabled=recording :style=style class="record-button" v-bind:class="{ 'loading': recording}" v-on:click=start>
      <div v-if="recording">Recording...</div>
      <div v-else>Record!</div>
    </button>
  `,

  data: () => {
    return {
      style: {
        transition: `background-position 3000ms linear`
      }
    }
  },

  props: ['recorder', 'recording', 'on-complete', 'on-recording-stopped', 'start-recording'],
  methods: {
    start() {
      this.style.transition = `background-position ${recordTime}ms linear`
      this.startRecording();
      setTimeout(() => {
        this.style.transition = 'none';
      }, recordTime)
    }
  }
});

module.exports = recordButtonComponent;
