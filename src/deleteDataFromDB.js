const Datastore = require('nedb');

function deleteData(DBPath, callback, options) {
    const db = new Datastore({filename: DBPath});
    db.loadDatabase();
    db.remove(options, function (err) {
        callback(err)
    });
}

function deleteDataFromDB(DBPath, options) {
    return new Promise((resolve, reject) => {
        deleteData(DBPath, (err) => {
                if (err) {
                    reject(err)
                }
                resolve(true);
            },
            options);
    })
}


module.exports = deleteDataFromDB;


