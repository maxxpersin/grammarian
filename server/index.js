const express = require('express');
const app = express();
const mongoose = require('mongoose');
const session = require('express-session');
const bcrypt = require('bcrypt');
const Font = require('./models/font');
const Default = require('./models/default');
const Game = require('./models/game');
const Level = require('./models/level');
const User = require('./models/user');
const KEY_PROTECTION = require('./secret/keyprotection');
const fs = require('fs');

let words = [];
fs.readFile('./init/words.json', (err, data) => {
    if (err) console.log('Cannot read word file');

    words = JSON.parse(data);
});

mongoose.connect('mongodb://localhost/grammarian', ({ useNewUrlParser: true, useUnifiedTopology: true }));
var db = mongoose.connection;

db.on('error', () => console.error('could not connect'));
db.once('open', () => console.log('Connection successful'));

const MongoDBStore = require('connect-mongodb-session')(session);
let mongoSessionStore = new MongoDBStore({
    uri: 'mongodb://localhost:27017/',
    collection: 'sessions'
});

app.use(session({
    secret: new KEY_PROTECTION().key,
    resave: true,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        secure: false,
        sameSite: false,
        maxAge: 1000 * 60 * 10 // cookie valid for 10 mins
    },
    name: 'session-id',
    rolling: true,
    store: mongoSessionStore
}));

const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.listen(port, () => console.log(`Grammarian is live on port ${port}`));

app.use(express.static('public'));

app.get('/login', (req, res) => {
    return res.redirect('/');
});

app.get('/game/:gid', (req, res) => {
    return res.redirect('/');
})

app.get('/api/v2/meta', async (req, res) => {
    let result = await metaQuery();
    return res.json(result);
});

app.get('/api/v2/meta/fonts', (req, res) => {
    Font.find({}, (err, fonts) => {
        if (err) res.status(500).send('Error');

        res.json(fonts);
    });
});

app.post('/api/v2/login', (req, res) => {
    req.session.regenerate((err) => {
        if (err) return res.sendStatus(500);

        let email = req.body.email || '';
        let password = req.body.password || '';

        User.findOne({ email: email }).populate({
            path: 'defaults',
            populate: [{
                path: 'font',
                model: 'Font'
            },
            {
                path: 'level',
                model: 'Level'
            }],
        }).exec(async (err, user) => {
            if (err) return res.status(500).send();
            if (!user) return res.status(404).send('User not found');

            let match = await bcrypt.compare(password, user.password);
            if (match) {
                req.session.user = user;

                let userNoPassword = {
                    email: user.email,
                    _id: user._id,
                    defaults: user.defaults
                }
                return res.json(userNoPassword);
            } else {
                return res.status(406).send();
            }
        });
    });
});

app.post('/api/v2/logout', (req, res) => {
    return destroySession(req, res, true);
});

app.get('/api/v2/:userid', (req, res) => {
    if (validSession(req.session, req.params)) {
        let userId = req.params.userid || '';

        Game.find({ userId: userId }).populate('level font').exec((err, games) => {
            if (err) return res.status(500).send('Error');

            let cleanGames = [];

            games.forEach(game => {
                cleanGame = {
                    _id: game._id,
                    userId: game.userId,
                    colors: game.colors,
                    font: game.font,
                    guesses: game.guesses,
                    level: game.level,
                    remaining: game.remaining,
                    status: game.status,
                    timeStamp: game.timeStamp,
                    view: game.view
                };

                if (game.status != 'unfinished') {
                    cleanGame.target = game.target;
                }
                if (game.timeToComplete) {
                    cleanGame.timeToComplete = game.timeToComplete;
                }

                cleanGames.push(cleanGame);
            });

            return res.json(cleanGames);
        });
    } else {
        return destroySession(req, res);
    }
});

app.post('/api/v2/:userid', async (req, res) => {
    if (validSession(req.session, req.params)) {
        try {
            let font = await Font.findOne({ rule: req.headers['x-font'] });
            let level = await Level.findOne({ name: req.query.level });
            let colorChoice = req.body || {};
            let user = req.params.userid || '';
            let target = selectTarget(level.minLength, level.maxLength);
            let view = '';
            for (let i = 0; i < target.length; i++) {
                view += '_';
            }

            let newGame = new Game({
                userId: user,
                colors: colorChoice,
                font: font._id,
                guesses: '',
                level: level._id,
                remaining: level.rounds,
                status: 'unfinished',
                target: target,
                view: view
            });

            try {
                let savedGame = await newGame.save();
                let cleanGame = {
                    userId: savedGame.userId,
                    _id: savedGame._id,
                    font: await Font.findOne({ _id: savedGame.font }),
                    guesses: savedGame.guesses,
                    level: await Level.findOne({ _id: savedGame.level }),
                    remaining: savedGame.remaining,
                    status: savedGame.status,
                    view: savedGame.view
                };

                return res.json(cleanGame);

            } catch (err) {
                return res.status(500).json('Error Saving Game')
            }
        } catch (error) {
            return res.status(404).send();
        }
    } else {
        return destroySession(req, res);
    }
});

app.get('/api/v2/:userid/:gid', async (req, res) => {
    if (validSession(req.session, req.params)) {
        try {
            let game = await Game.findById(req.params.gid);

            let cleanedGame = await clean(game);
            return res.json(cleanedGame);
        } catch (error) {
            return res.status(404).send();
        }
    } else {
        return destroySession(req, res);
    }
});

app.post('/api/v2/:userid/:gid/guesses', async (req, res) => {
    if (validSession(req.session, req.params)) {
        try {
            let guessEval = await evaluateGuess(req.params.gid, req.query.guess);
            if (guessEval) {
                return res.json(guessEval);
            } else {
                return res.status(400).json('Letter already guessed');
            }
        } catch (error) {
            console.log(error);
            return res.status(500).json(error);
        }
    } else {
        return destroySession(req, res);
    }
});

app.put('/api/v2/:userid/defaults', async (req, res) => {
    if (validSession(req.session, req.params)) {
        try {
            let d = new Default({
                colors: req.body.colors,
                font: req.body.font,
                level: req.body.level
            });
            let savedDefault = await d.save();
            let updatedUser = await User.findByIdAndUpdate(req.params.userid, { defaults: savedDefault._id }, { new: true });

            return res.json(await Default.findById(updatedUser.defaults));
        } catch (error) {
            return res.status(500).send();
        }
    } else {
        return destroySession(req, res);
    }
});

async function metaQuery() {
    let defaultQuery = Default.findOne({}).populate('font level');

    return {
        fonts: await Font.find({}),
        levels: await Level.find({}),
        default: await defaultQuery.exec()
    };
}

function selectTarget(min, max) {
    let result;
    while (!result) {
        let rand = getRandomInt(0, words.length);
        if (words[rand].length >= min && words[rand].length <= max) {
            result = words[rand];
        }
    }
    return result;
}

function getRandomInt(min, max) { // Used for selecting words
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function validSession(session, params) {
    return (session.user && session.user._id == params.userid && session.cookie.expires.getTime() >= Date.now());
}

function destroySession(req, res, logout) {
    return req.session.destroy((err) => {
        if (err) return res.status(500).json('Error');

        if (logout) return res.json({ msg: 'success' });

        return res.status(403).json('Forbidden');
    });
}

async function clean(game, showTarget) {
    let cleanedGame = {
        userId: game.userId,
        _id: game._id,
        font: await Font.findById(game.font),
        guesses: game.guesses,
        level: await Level.findById(game.level),
        remaining: game.remaining,
        status: game.status,
        view: game.view,
        colors: game.colors
    };

    if (showTarget) cleanedGame.target = game.target;

    return cleanedGame;
}

async function evaluateGuess(gid, guess) {
    let gameToUpdate = await Game.findById(gid);
    let allowTarget;

    if (!gameToUpdate.guesses.includes(guess)) {
        gameToUpdate.guesses += guess;

        if (gameToUpdate.status == 'unfinished' && !gameToUpdate.target.includes(guess)) {
            gameToUpdate.remaining--;
        }

        if (gameToUpdate.remaining == 0) {
            gameToUpdate.status = 'loss';
            allowTarget = true;
            gameToUpdate.timeToComplete = Date.now() - gameToUpdate.timeStamp;
        } else {
            let passed = true;
            for (let i = 0; i < gameToUpdate.target.length; i++) {
                if (!gameToUpdate.guesses.includes(gameToUpdate.target[i])) {
                    passed = false;
                    break;
                }
            }
            if (passed) {
                gameToUpdate.status = 'victory';
                allowTarget = true;
                gameToUpdate.timeToComplete = Date.now() - gameToUpdate.timeStamp;
            }
        }

        let view = '';
        for (let i = 0; i < gameToUpdate.target.length; i++) {
            if (gameToUpdate.guesses.includes(gameToUpdate.target[i])) {
                view += gameToUpdate.target[i];
            } else {
                view += '_';
            }
        }
        gameToUpdate.view = view;

        let savedGame = await Game.findByIdAndUpdate(gameToUpdate._id, gameToUpdate, { new: true });
        let cleanedGame = await clean(savedGame, allowTarget || false);

        return cleanedGame;
    } else {
        return null;
    }
}