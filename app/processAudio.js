var fs = require('fs');
var wav = require('wav');
const Transform = require('stream').Transform;
const Writable = require('stream').Writable;

const MAX_AMPLITUES = 540672;

// This is here because I wasn't sure how to make a transform stream
// that doesn't eventually write
class Noop extends Writable {
  constructor(options) { super(options); }
  write(chunk, encoding, callback) {}
}


class Logger extends Transform {
  constructor(options) {
    super(options);
    this.objectMode = true;
    this._amplitudes = [];
    this._count = 0;
  }

  _transform(chunk, encoding, done) {
    this._amplitudes = [...this._amplitudes, ...chunk.toJSON().data];
    this.push(chunk);
    done();
  }

  get amplitudes() {
    return this._amplitudes;
  }
}


function getAmplitudes(filePath) {
  return new Promise((resolve, reject) => {
    const file = fs.createReadStream(filePath);
    const reader = new wav.Reader();
    var log = new Logger();

    // the "format" event gets emitted at the end of the WAVE header
    reader.on('format', function (format) {
      const logStream = reader.pipe(log);

      logStream.on('end', () => {
        let amplitudes = log.amplitudes;
        if (amplitudes.length != MAX_AMPLITUES) {
          amplitudes = pad(amplitudes);
        }
        resolve(amplitudes);
      });
      logStream.pipe(new Noop(format));
    });

    // pipe the WAVE file to the Reader instance
    file.pipe(reader);
  });
}

function pad(array) {
  var padding = [];
  for (var i = 0; i < (MAX_AMPLITUES - array.length); i++) padding[i] = 0;

  return [...array, ...padding]
}

module.exports = getAmplitudes;
