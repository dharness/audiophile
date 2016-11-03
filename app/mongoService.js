var MongoClient = require('mongodb').MongoClient;

class MongoService {

  init() {
    return new Promise((resolve, reject) => {
      MongoClient.connect("mongodb://localhost:27017/Sqwak", (err, database) => {
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
