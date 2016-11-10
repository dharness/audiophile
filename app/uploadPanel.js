const Vue = require('vue');
const fs = require('fs');
const electron = require('electron');
const electronApp = electron.remote.app;
const processAudio = require('./processAudio.js');


const uploadPanel = Vue.component('upload-panel', {
  template: `
    <div>
      <div class="kv-form" v-if="isKvForm">
        <h4 style="margin-left: 10%;">Add the file attributes</h4>


        <div class="form-group kv-form-items">

          <div class="kv-form-item">
            <label>Label</label>
            <select>
              <option> shmaw </option>
              <option> doo </option>
              <option> poo </option>
            </select>
          </div>

          <div class="kv-form-item">
            <label>Normalized</label>
            <input type="checkbox" />
          </div>

          <div class="kv-form-item">
            <label>Sample Rate</label>
          </div>

          <div class="kv-form-item">
            <label>Bits Per Sample</label>
          </div>

          <div class="kv-form-item">
            <label>Audio Channels</label>
          </div>


          <div class="kv-form-item">
            <label>Compression</label>
          </div>

          <div class="kv-form-item">
            <label>Author Name</label>
          </div>

          <div class="kv-form-item">
            <label>Gender</label>
          </div>

          <div class="kv-form-item">
            <label>Background Noise</label>
          </div>


          <div class="kv-form-item">
            <label>Equalized</label>
          </div>

        </div>
        <div class="form-actions" style="width: 80%; margin: auto;">
          <button type="submit" style="float: right" class="btn btn-form btn-primary" v-on:click=createMongoData :disabled=isUploading>Continue</button>
        </div>
      </div>
      <div v-else>
        <button class="btn btn-form btn-positive" v-on:click=uploadToMongo>Upload</button>
        <table class="table-striped">
          <thead>
            <tr>
              <th v-for="key in Object.keys(mongoData[0])">{{key}}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="data in mongoData">
              <td v-for="value in formatMongoData(data)">{{value}}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    `,

    data: () => {
      return {
        kvps: [],
        isKvForm: true,
        mongoData: [],
        isUploading: false
      }
    },
    methods: {
      formatMongoData(data) {
        let attributes = []
        Object.keys(data).forEach(key => {
          if (key === 'amplitudes') {
            attributes.push(data[key].length)
          } else {
            attributes.push(data[key]);
          }
        })
        return attributes
      },

      uploadToMongo() {
        electron.ipcRenderer.send('save-sqwaks', {data: this.mongoData});
      },

      createMongoData() {
        this.isUploading = true;
        let a = this.kvps.reduce((o, e) => {
          if (e.key && e.value) {
            o[e.key] = e.value;
            return o;
          }
        }, {});

        this.getAmplitudes().then((files) => {
          files.forEach( file => {
            let mongoData = Object.assign(file, a)
            this.mongoData.push(mongoData)
            this.isKvForm = false;
          })
        })
      },
      getAmplitudes() {
        const testFolder = './data';
        return new Promise ((resolve, reject)=> {
          fs.readdir(testFolder, (err, files) => {
            let promises = []
            files.forEach(fileName => {
              if (fileName.split('.')[1] === 'wav') {
                const filePath = `${electronApp.getAppPath()}/data/${fileName}`;
                promises.push(processAudio(filePath).then((a)=> {
                  return {amplitudes: a, fileName }
                }));
              }
            })
            Promise.all(promises).then((amplitudes) => {
              resolve(amplitudes);
            });
          })
        })
      }
    }
});

module.exports = uploadPanel;
