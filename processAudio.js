var fs = require('fs');
var wav = require('wav');
var Speaker = require('speaker');
const Transform = require('stream').Transform;

const testFolder = './data';
fs.readdir(testFolder, (err, files) => {
  files.forEach((f) => {
    if (f.split('.')[1] === 'wav') {
      play(f);
    }
  })
})

function play(fileName) {
  var file = fs.createReadStream('./data/' + fileName);
  var reader = new wav.Reader();
  var log = new Logger();
  // the "format" event gets emitted at the end of the WAVE header
  reader.on('format', function (format) {

    reader
      .pipe(log)
      .pipe(new Speaker(format));
  });

  // pipe the WAVE file to the Reader instance
  file.pipe(reader);
}

class Logger extends Transform {
  constructor(options) {
    super(options);
    this.objectMode = true;
  }

  _transform(chunk, encoding, done) {
    var data = chunk.toString()
    // if (this._lastLineData)
    //   data = this._lastLineData + data 
    var lines = data.split('\n') 
    console.log(lines);

    lines.forEach(this.push.bind(this)) 
    done();
  }
}