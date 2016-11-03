const Vue = require('vue');
const fs = require('fs');
const electron = require('electron');
const electronApp = electron.remote.app;
const processAudio = require('./processAudio.js');


const uploadPanel = Vue.component('upload-panel', {
  template: `
    <div>
      <div class="kv-form" v-if="isKvForm">
        <label>Add the file attributes</label>
        <div class="form-group" v-for="kvp in kvps">
          <input type="text" class="form-control" placeholder="Key" v-model="kvp.key" >
          <input v-if="kvp.type == 'string'" type="text" class="form-control" placeholder="Value" v-model="kvp.value">
          <input v-if="kvp.type == 'bool'" type="checkbox" class="form-control" placeholder="Value" v-model="kvp.value">
          <input v-if="kvp.type == 'number'" type="number" class="form-control" placeholder="Value" v-model="kvp.value">
          <select v-model="kvp.type">
            <option value="bool">bool</option>
            <option value="string">string</option>
            <option value="number">number</option>
          </select>
        </div>
        <button class="btn btn-form btn-positive" v-on:click=addKvPair>Add</button>
        <div class="form-actions">
          <button type="submit" class="btn btn-form btn-primary" v-on:click=createMongoData>OK</button>
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
              // <td v-for="key in data">{{key}}</td>
    data: () => {
      return {
        kvps: [],
        isKvForm: true,
        mongoData: []
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
      addKvPair() {
        this.kvps.push({type: "string"})
      },

      uploadToMongo() {
        electron.ipcRenderer.send('save-sqwaks', {data: this.mongoData});
      },
      createMongoData() {
        this.loading = true;
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
