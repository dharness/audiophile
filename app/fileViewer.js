const Vue = require('vue');
const fs = require('fs');
require('./styles/file-viewer.css');

const fileViewer = Vue.component('file-viewer', {
  template: `
    <div class="file-viewer">
      <h5> Files </h5>
      <ul class="files-list">
        <li v-for="file in files">
          <button v-on:click="fileSelected(file)"> {{ file }} </button>
        </li>
      </ul>
    </div>`,
  data() { return { files: [] }; },
  props: ['file-selected'],
  created() {
    const testFolder = './data';
    fs.readdir(testFolder, (err, files) => {
      files.forEach((f) => {
        if (f.split('.')[1] === 'wav') {
          this.files.push(f);
        }
      })
    })
  }
});

module.exports = fileViewer;
