const Datastore = require('nedb');

function addData(DBPath, callback, options) {
    const db = new Datastore({filename: DBPath});
    db.loadDatabase();
    db.insert(options, function (err, data) {
        callback(err)
    });
}

function addDataInDB(DBPath, options) {
    return new Promise((resolve, reject) => {
        addData(DBPath, (err) => {
                if (err) {
                    reject(err)
                }
                resolve(true);
            },
            options);
    })
}


module.exports = addDataInDB;


