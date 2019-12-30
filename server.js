const express = require("express");
const getDataFromDB = require('./src/getDataFromDB.js');
const changeDataInDB = require('./src/changeDataInDB');
const addDataInDB = require('./src/addDataInDB');
const deleteDataFromDB = require('./src/deleteDataFromDB');
const session = require('express-session');
const passport = require('passport');
const nedbStore = require('connect-nedb-session')(session);
const multer = require("multer");
const flash = require('express-flash');
const fs = require('fs');

const app = express();

app.use(express.json({limit: '200MB'}));
app.use(express.urlencoded({
    limit: '50mb', extended: false
}));

const storageConfig = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "views/uploads/");
    },
    filename: (req, file, cb) => {
        cb(null, +new Date() + '-' + file.originalname);
    }
});

app.use(
    session({
        secret: 'veryBigSecret',
        store: new nedbStore({filename: './src/DB/session'}),
        cookie: {
            path: '/',
            httpOnly: true,
            maxAge: 60 * 60 * 1000,
        },
        resave: false,
        saveUninitialized: false,
    })
);


app.use(flash());

app.set("view engine", "hbs");

app.use(express.static("views"));

app.get("/", async function (request, response) {
    const allDisciplines = await getDataFromDB('src/DB/disciplines', {}, 1);
    response.render('index/index.hbs', {isAdmin: false, allDisciplines});
});

app.get('/:id', async function (req, res, next) {
    const discipline = (await getDataFromDB('src/DB/disciplines', {_id: req.params.id}))[0];
    switch (req.query.q) {
        case 'description':
            res.render('disciplinesDescription/index.hbs', {isAdmin: false, discipline});
            break;
        case 'lectures':
            res.render('lecturesOfDiscipline/index.hbs', {
                isAdmin: false,
                materials: discipline.lectures,
                discipline: discipline,
                type: 'lectures'
            });
            break;
        case 'teachingMaterial':
            res.render('lecturesOfDiscipline/index.hbs', {
                isAdmin: false,
                materials: discipline.teachMaterial,
                discipline: discipline,
                type: 'teachMaterial'
            });
            break;
        default:
            next();
            break;
    }
});

app.get("/video", async function (request, response) {
    let allVideos = [];
    if (request.query.q) {
        allVideos = await getDataFromDB('src/DB/videos', {section: request.query.q});
    } else {
        allVideos = await getDataFromDB('src/DB/videos', {});
    }
    const allMenuSections = await  getDataFromDB('src/DB/directory', {type: '1'});
    response.render('video/index.hbs', {allVideos, isAdmin: false, allMenuSections});
});

require('./src/config-passport');
app.use(passport.initialize());
app.use(passport.session());

app.post('/login', (req, res, next) => {
    passport.authenticate('local', function (err, user) {
        if (err) {
            return next(err);
        }
        if (!user) {
            return res.send('Укажите правильный email или пароль!');
        }
        req.logIn(user, function (err) {
            if (err) {
                return next(err);
            }
            return res.redirect('/admin');
        });
    })(req, res, next);
});


app.get('/login', (req, res, next) => {
    res.sendFile(__dirname + '/views/authorization/index.html')
});

const auth = (req, res, next) => {
    if (req.isAuthenticated()) {
        next();
    } else {
        return res.send('<p>Время тукущей сессии закончено. <a href="/login">Вход</a></p>');
    }
};

app.get('/adminVideo', auth, async function (req, res) {
    let allVideos = [];
    if (req.query.q) {
        allVideos = await getDataFromDB('src/DB/videos', {section: req.query.q});
    } else {
        allVideos = await getDataFromDB('src/DB/videos', {});
    }
    const allMenuSections = await  getDataFromDB('src/DB/directory', {type: '1'});
    res.render('video/index.hbs', {allVideos, isAdmin: true, allMenuSections});
});

app.post('/adminVideo', auth, async function (req, res) {
    if (!req.body) return res.sendStatus(400);
    if (req.body.section) {
        await addDataInDB('src/DB/directory', {
            name: req.body.section,
            type: '1',
            date: +new Date()
        });
        res.redirect('back');
        return;
    }
    if (req.body.id === 'add') {
        await addDataInDB('src/DB/videos', {
            name: req.body.name,
            src: req.body.url.replace('watch?v=', 'embed/'),
            section: req.query.q ? req.query.q : "",
            description: req.body.description,
            date: +new Date()
        });
        res.redirect('back');
        return;
    }
    await changeDataInDB('src/DB/videos', {_id: req.body.id}, {
        $set: {
            name: req.body.name,
            src: req.body.url.replace('watch?v=', 'embed/'),
            description: req.body.description
        }
    });
    res.redirect('back');
});


app.delete('/adminVideo/:id', auth, async function (req, res) {
    if (req.query.type) {
        const id = req.params.id;
        await deleteDataFromDB('src/DB/directory', {_id: id});
        return res.json({data: 'ok'});
    }
    const id = req.params.id;
    await deleteDataFromDB('src/DB/videos', {_id: id});
    return res.json({data: 'ok'})
});

app.get('/admin', auth, async function (req, res) {
    const allDisciplines = await getDataFromDB('src/DB/disciplines', {}, 1);
    res.render('index/index.hbs', {isAdmin: true, allDisciplines});
});

app.post('/admin', auth, async function (req, res) {
    if (!req.body) return res.sendStatus(400);

    if (req.body.id) {
        await changeDataInDB('src/DB/disciplines', {_id: req.body.id}, {$set: {name: req.body.discipline}});
        res.redirect('back');
        return
    }
    await addDataInDB('src/DB/disciplines', {
        name: req.body.discipline,
        description: '',
        lectures: [],
        teachMaterial: [],
        table: [],
        date: +new Date()
    });
    res.redirect('back');
});

app.delete('/admin/:id', auth, async function (req, res) {

    switch (req.query.type) {
        case 'discipline':
            const id = req.params.id;
                                        // звернення до модуля для отримання записів з БД
            const discipline = (await getDataFromDB('src/DB/disciplines', {_id: req.params.id}))[0];
                                        // звернення до модуля для видалення записів з БД
            await deleteDataFromDB('src/DB/disciplines', {_id: id});
            deleteAllMaterials(discipline);     // видалення файлів лекцій і метод. матеріалу
            return res.json({data: 'ok'});
        case 'lectures':
            await deleteMaterial(true, req.params.id, req.query.fileName);
            return res.json({data: 'ok'});
        case 'teachMaterial':
            await deleteMaterial(false, req.params.id, req.query.fileName);
            return res.json({data: 'ok'});
        case 'deleteTable':
            await changeTable(req.params.id, req.query.tableId, true);
            return res.json({data: 'ok'});
    }
});

async function deleteMaterial(isLecture, disciplineId, fileName) {
    const discipline = (await getDataFromDB('src/DB/disciplines', {_id: disciplineId}))[0];
    const materials = isLecture ? discipline.lectures : discipline.teachMaterial;
    for (let i = 0; i < materials.length; i++) {
        if (materials[i].filename === fileName) {
            materials.splice(i, 1);
            break;
        }
    }
    if (isLecture) {
        await changeDataInDB('src/DB/disciplines', {_id: disciplineId}, {$set: {lectures: materials}});
    } else {
        await changeDataInDB('src/DB/disciplines', {_id: disciplineId}, {$set: {teachMaterial: materials}});
    }
    const filePath = __dirname + '/views/uploads/' + fileName;
    try {
        fs.unlinkSync(filePath);
    } catch (e) {
        console.log('файла нет')
    }
}

function deleteAllMaterials(discipline) {
    discipline.lectures.forEach((lecture) => {
        const filePath = __dirname + '/views/uploads/' + lecture.filename;
        try {
            fs.unlinkSync(filePath);
        } catch (e) {
            console.log('файла нет')
        }
    })
    discipline.teachMaterial.forEach((lecture) => {
        const filePath = __dirname + '/views/uploads/' + lecture.filename;
        try {
            fs.unlinkSync(filePath);
        } catch (e) {
            console.log('файла нет')
        }
    })
}

app.get('/admin/:id', auth, async function (req, res) {
    const discipline = (await getDataFromDB('src/DB/disciplines', {_id: req.params.id}))[0];
    switch (req.query.q) {
        case 'description':
            res.render('disciplinesDescription/index.hbs', {isAdmin: true, discipline});
            break;
        case 'lectures':
            res.render('lecturesOfDiscipline/index.hbs', {
                isAdmin: true,
                materials: discipline.lectures || [],
                discipline: discipline || [],
                type: 'lectures'
            });
            break;
        case 'teachingMaterial':
            res.render('lecturesOfDiscipline/index.hbs', {
                isAdmin: true,
                materials: discipline.teachMaterial || [],
                discipline: discipline || [],
                type: 'teachMaterial'
            });
            break;
    }
});

const upload = multer({storage: storageConfig});

app.post('/admin/:id', auth, upload.single('filedata'), async function (req, res) {
    if (!req.body) return res.sendStatus(400);
    switch (req.body.type) {
        case 'description':
            await changeDataInDB('src/DB/disciplines', {_id: req.params.id}, {$set: {description: req.body.description}});
            res.redirect('back');
            break;
        case 'lectures':
            if (!req.file) {
                res.send('<h1>Файл не был выбран</h1>');
                return
            }
            await setFileInDiscipline(true, req.params.id, req.file, req.body.name);
            res.redirect('back');
            break;
        case 'teachMaterial':
            if (!req.file) {
                res.send('<h1>Файл не был выбран</h1>');
                return
            }
            await setFileInDiscipline(false, req.params.id, req.file, req.body.name);
            res.redirect('back');
            break;
        case 'newTable':
            const discipline = (await getDataFromDB('src/DB/disciplines', {_id: req.params.id}))[0];
            const table = {
                html: req.body.table,
                id: discipline.table.length
            };
            discipline.table.push(table);
            await changeDataInDB('src/DB/disciplines', {_id: req.params.id}, {$set: {table: discipline.table}});
            res.redirect('back');
            break;
        case 'changeTable':
            await changeTable(req.params.id, req.body.id, false, req.body.modifiedTable);
            res.redirect('back');
            break;
    }
});

async function changeTable(disciplineID, tableId, isDelete, newHtml) {
    const table = (await getDataFromDB('src/DB/disciplines', {_id: disciplineID}))[0].table;

    for (let i = 0; i < table.length; i++) {
        if (+table[i].id === +tableId) {
            if (isDelete) {
                table.splice(i, 1);
                changeTableId();
                break;
            } else {
                table[i].html = newHtml;
            }
        }
    }
    await changeDataInDB('src/DB/disciplines', {_id: disciplineID}, {$set: {table: table}});

    function changeTableId() {
        for (let i = 0; i < table.length; i++) {
            table[i].id = i;
        }
    }
}

async function setFileInDiscipline(isLecture, id, file, name) {
    const discipline = (await getDataFromDB('src/DB/disciplines', {_id: id}))[0];
    const materials = isLecture ? discipline.lectures : discipline.teachMaterial;
    const fileInfo = getFileInfo(file, name);
    materials.push(fileInfo);
    if (isLecture) {
        await changeDataInDB('src/DB/disciplines', {_id: id}, {$set: {lectures: materials}});
    } else {
        await changeDataInDB('src/DB/disciplines', {_id: id}, {$set: {teachMaterial: materials}});
    }
}


function getFileInfo(file, name) {
    return {
        name: name ? name : file.originalname,
        filename: file.filename
    }
}

app.get('/download/:id', function (req, res) {
    res.download(__dirname + '/views/uploads/' + req.params.id)
});


app.get('/logout', (req, res) => {
    req.logOut();
    res.redirect('/');
});


const port = process.env.PORT || 3000;
app.listen(port, function () {
    console.log("To view your server, open this link in your browser: http://localhost:" + port);
});

//asdfasdfasdf211111111