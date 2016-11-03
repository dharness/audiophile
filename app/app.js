const Vue = require('vue');
const electron = require('electron')
// Components
const fileViewer = require('./fileViewer.js');
const soundViewer = require('./soundViewer.js');
const recordPanel = require('./recordPanel.js');
const viewPanel = require('./viewPanel.js');
const uploadPanel = require('./uploadPanel.js');

// Styles
require('./styles/main.css');
require('./styles/photon.min.css');

// Etc
var RecordRTC = require('recordrtc');
var Chart = require('chart.js');
const electronApp = require('electron').remote.app;
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
        <div class="window">
          <div class="window-content">
            <div class="pane-group">
              <div class="pane-sm sidebar">
                <file-viewer :file-selected=displayFile :delete-file=deleteFile></file-viewer>
              </div>
              <div class="pane">

                <div class="tab-group">
                  <div v-bind:class="[{ active: activeTab == 1 }, 'tab-item']" v-on:click=setActiveTab(1)>
                    <span class="icon icon-cancel icon-close-tab"></span>
                    Record
                  </div>
                  <div v-bind:class="[{ active: activeTab == 2 }, 'tab-item']" v-on:click=setActiveTab(2)>
                    <span class="icon icon-cancel icon-close-tab"></span>
                    View
                  </div>
                  <div v-bind:class="[{ active: activeTab == 3 }, 'tab-item']" v-on:click=setActiveTab(3)>
                    <span class="icon icon-cancel icon-close-tab"></span>
                    Upload
                  </div>
                </div>

                <div class="main-panel-tabs">
                  <record-panel v-if="activeTab == 1" :recorder=recorder></record-panel>
                  <view-panel v-if="activeTab == 2" :wav-file=currentFile ></view-panel>
                  <upload-panel v-if="activeTab == 3"></upload-panel>
                </div>

              </div>
            </div>
          </div>
        </div>
      `,
      data: {
        recorder,
        currentFile: '',
        activeTab: 1
      },
      created() {
        window.addEventListener("keydown", (e) => {
          if (e.code == "F12") {
            electron.ipcRenderer.send('toggle-devtools');
          }
        });
      },
      methods: {
        setActiveTab(i) {
          this.activeTab = i;
        },
        displayFile(fileName) {
          const audio = document.getElementById('audioPlayer');
          this.currentFile = `${electronApp.getAppPath()}/data/${fileName}`;
          audio && audio.load();
          audio && audio.play();
        },
        deleteFile(fileName) {
          fs.unlink('./data/' + fileName, (err) => {
            if (err) alert(err)
          });
        }
      },
    })
});
