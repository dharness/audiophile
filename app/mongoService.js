var MongoClient = require('mongodb').MongoClient;
const mongoUrl = "mongodb://sqwak-experiments:bluecakes@ds147377.mlab.com:47377/sqwak-experminets"

class MongoService {

  init() {
    return new Promise((resolve, reject) => {
      MongoClient.connect(mongoUrl, (err, database) => {
        if (err) {
          console.dir(err);
          reject(err);
        }
        this.db = database;
        resolve(database)

      });
    })
  }

  save (sounds) {
    return new Promise((resolve, reject) => {
      this.db.collection('sounds').insert(sounds, (err, records)=> {
        if (err) {
          console.dir(err);
          reject(err);
        }
        resolve(records);
      })
    })
  }

}




module.exports = new MongoService();
