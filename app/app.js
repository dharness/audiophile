const Vue = require('vue');
const recordButton = require('./recordButton.js');
var RecordRTC = require('recordrtc');
require('./styles/override.css');
var Chart = require('chart.js')


navigator.mediaDevices.getUserMedia({audio: true})
  .then((stream) => {

    var recorder = RecordRTC(stream, {
      type: 'audio',
      disableLogs: true,
      autoWriteToDisk: true
    });

    var app = new Vue({
      el: '#Recorder-App',
      data: { recorder },
      template: `
        <div>
          <canvas id="myChart" width="400" height="400"></canvas>
          <h1> Sqwak Recorder </h1>
          <audio id="audioPlayer" controls="controls" style="display: none">
            <source id="audioPlayerSource" src="http://www.w3schools.com/tags/horse.ogg" type="audio/mp3">
          </audio>
          <record-button :recorder=recorder :on-complete=onComplete></record-button>
        </div>  
      `,
      methods: {
        onComplete(data) {
          let mappable = [];
          let labels = [];
          data.forEach((e, i) => {
            mappable.push(+e);
            labels.push(i + " Label");
          });
          var ctx = document.getElementById("myChart");
          var myChart = new Chart(ctx, {
            type: 'bar',
            data: {
              labels: labels,
              datasets: [{
                  data: mappable,
              }]
            }
          });
        }
      },
      mounted() {
      }
    })
});