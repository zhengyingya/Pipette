const Datastore = require('nedb')
const nedb = new Datastore({
  filename: 'data.db',
  autoload: true
})


export default {
  insert: (doc) => {
    return new Promise(function (resovle, reject) {
      nedb.insert(doc, function (err, new_doc) {
        console.log(err, new_doc);
        resovle(new_doc)
      });
    })
  },
  find: (obj) => {
    return new Promise(function (resovle, reject) {
      nedb.find(obj, function (err, new_doc) {
        console.log(err, new_doc);
        resovle(new_doc)
      });
    })
  },
  update: (obj1, obj2) => {
    return new Promise(function (resovle, reject) {
      nedb.update(obj1, obj2, { multi: true }, function (err, new_doc) {
        console.log(err, new_doc);
        resovle(new_doc)
      });
    })
  },
  remove: (obj) => {
    return new Promise(function (resovle, reject) {
      nedb.remove(obj, { multi: true }, function (err, new_doc) {
        console.log(err, new_doc);
        resovle(new_doc)
      });
    })
  }
}
