const Datastore = require('nedb');

function loadData(DBPath, callback, options, sort) {
    sort = sort || -1;
    const db = new Datastore({filename: DBPath});
    db.loadDatabase();
    db.find(options).sort({date: sort}).exec(function (err, data) {
        callback(err, data)
    });
}


function getDataFromDB(DBPath, options, sort) {
    return new Promise((resolve, reject) => {
        loadData(DBPath, (err, data) => {
                if (err) {
                    reject(err);
                }
                resolve(data);
            },
            options, sort);
    })
}


module.exports = getDataFromDB;


