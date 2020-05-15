const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Font = require('./models/font');
const Default = require('./models/default');
const Game = require('./models/game');
const Level = require('./models/level');
const User = require('./models/user');

mongoose.connect('mongodb://localhost/grammarian', ({ useNewUrlParser: true, useUnifiedTopology: true }));
var db = mongoose.connection;

db.on('error', () => console.error('could not connect'));
db.once('open', () => {
    console.log('Connection successful');
    main();
});

async function main() {

    await mongoose.connection.dropDatabase();

    let savedFonts = await initFonts();
    console.log(savedFonts);
    let savedLevels = await initLevels();
    console.log(savedLevels);
    let defaults = await initDefault(savedFonts[0], savedLevels[1]);
    console.log(defaults);
    let savedUsers = await initUsers(defaults);
    console.log(savedUsers);

    process.exit();




    async function initFonts() {
        let fonts = [
            {
                category: "monospace",
                family: "",
                rule: "VT323",
                url: "https://fonts.googleapis.com/css?family=VT323&display=swap"

            },
            {
                category: "serif",
                family: "",
                rule: "Lacquer",
                url: "https://fonts.googleapis.com/css?family=Lacquer&display=swap"
            },
            {
                category: "sans-serif",
                family: "",
                rule: "Anton",
                url: "https://fonts.googleapis.com/css?family=Anton&display=swap"
            },
            {
                category: "cursive",
                family: "",
                rule: "Pacifico",
                url: "https://fonts.googleapis.com/css?family=Pacifico&display=swap"
            },
            {
                category: "cursive",
                family: "",
                rule: "Pangolin",
                url: "https://fonts.googleapis.com/css?family=Pangolin&display=swap"
            },
            {
                category: "cursive",
                family: "",
                rule: "Lobster",
                url: "https://fonts.googleapis.com/css?family=Lobster&display=swap"
            },
            {
                category: "sans-serif",
                family: "",
                rule: "Federant",
                url: "https://fonts.googleapis.com/css?family=Federant&display=swap"
            },
            {
                category: "cursive",
                family: "",
                rule: "Satisfy",
                url: "https://fonts.googleapis.com/css?family=Satisfy&display=swap"
            }
        ]

        return await Font.insertMany(fonts);
    }

    async function initLevels() {
        let levels = [
            {
                name: "easy",
                minLength: 4,
                maxLength: 5,
                rounds: 8
            },
            {
                name: "medium",
                minLength: 4,
                maxLength: 10,
                rounds: 7
            },
            {
                name: "hard",
                minLength: 9,
                maxLength: 300,
                rounds: 6
            }
        ]

        return await Level.insertMany(levels);
    }

    async function initDefault(font, level) {
        let d = new Default({
            font: font._id,
            level: level._id,
            colors: {
                guessBackground: "#381639",
                textBackground: "#ff3e3e",
                wordBackground: "#0388fc"
            }
        });

        return await d.save();
    }

    function initUsers(defaults) {
        let users = [
            { email: 'bilbo@mordor.org', password: '123123123', defaults: defaults._id },
            { email: 'frodo@mordor.org', password: '234234234', defaults: defaults._id },
            { email: 'samwise@mordor.org', password: '345345345', defaults: defaults._id }
        ]

        users.forEach(user => {
            user.password = bcrypt.hashSync(user.password, 10);
        })

        return User.insertMany(users);
    }
}