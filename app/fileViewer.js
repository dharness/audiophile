const Vue = require('vue');
const fs = require('fs');
var chokidar = global['require']('chokidar');


const fileViewer = Vue.component('file-viewer', {
  template: `
    <div class="file-viewer">
      <ul class="list-group">
        <li class="list-group-header">
          <input class="form-control" type="text" placeholder="Search for someone">
        </li>
        <li v-for="file in files" v-bind:class="{true: 'list-group-item' }">
          <span class="icon icon-note-beamed"></span>
          <div class="media-body" v-on:click="fileSelected(file)">
            <button v-on:click="deleteFile(file)">x</button>
            <strong> {{file}} </strong>
          </div>
        </li>
      </ul>
    </div>`,
  data() { return { files: [] }; },
  props: ['file-selected', 'delete-file'],
  created() {
    const watcher = chokidar.watch('./data');
    watcher.on('add', (path) => this.loadFiles());
    watcher.on('unlink', (path) => this.loadFiles());
  },
  methods: {
    loadFiles() {
      const testFolder = './data';
      let tmpFiles = [];
      fs.readdir(testFolder, (err, files) => {
        files.sort((a, b) => {
          return fs.statSync(testFolder + '/' + a).mtime.getTime() -
          fs.statSync(testFolder + '/' + b).mtime.getTime();
        })
        files.forEach((f) => {
          if (f.split('.')[1] === 'wav') {
            tmpFiles.push(f);
          }
        });
        this.files = tmpFiles;
      })
    }
  }
});

module.exports = fileViewer;
