const Datastore = require('nedb');

function changeData(DBPath, callback, options, newData) {
    const db = new Datastore({filename: DBPath});
    db.loadDatabase();
    db.update(options, newData, {},  function (err) {
        callback(err)
    });
}

function changeDataInDB(DBPath, options, newData) {
    return new Promise((resolve, reject) => {
        changeData(DBPath, (err) => {
                if (err) {
                    reject(err)
                }
                resolve(true);
            },
            options,
            newData);
    })
}


module.exports = changeDataInDB;


