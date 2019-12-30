const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const getDataFromDB = require('./getDataFromDB.js');


passport.serializeUser(function (user, done) {
    done(null, user._id);
});

passport.deserializeUser(async function (id, done) {
    const admin = await getAdmin();
    const user = admin._id === id ? admin : false;
    done(null, user);
});



passport.use(new LocalStrategy(async function (username, password, done) {
    const admin = await getAdmin();
    if (username === admin.login && password === admin.password) {
        return done(null, admin);
    } else {
        return done(null, false);
    }
}));

async function getAdmin() {
    return (await getDataFromDB('src/DB/admin', {}))[0]
}


