const Datastore = require('nedb')
const comNedb = new Datastore({
  filename: 'comdata.db',
  autoload: true
})


export default {
  insert: (doc) => {
    return new Promise(function (resovle, reject) {
      comNedb.insert(doc, function (err, new_doc) {
        console.log(err, new_doc);
        resovle(new_doc)
      });
    })
  },
  find: (obj) => {
    return new Promise(function (resovle, reject) {
      comNedb.find(obj, function (err, new_doc) {
        console.log(err, new_doc);
        resovle(new_doc)
      });
    })
  },
  update: (obj1, obj2) => {
    return new Promise(function (resovle, reject) {
      comNedb.update(obj1, obj2, { multi: true }, function (err, new_doc) {
        console.log(err, new_doc);
        resovle(new_doc)
      });
    })
  },
  remove: (obj) => {
    return new Promise(function (resovle, reject) {
      comNedb.remove(obj, { multi: true }, function (err, new_doc) {
        console.log(err, new_doc);
        resovle(new_doc)
      });
    })
  }
}
