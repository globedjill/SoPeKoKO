const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const sauceRoute = require('./routes/sauce');
const userRoute = require('./routes/routeUser');

const app = express();

mongoose.connect('mongodb+srv://globedjill24:Evan25082010@cluster0.tkyck.mongodb.net/<dbname>?retryWrites=true&w=majority',
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => console.log('Connexion a MongoDB réussi'))
    .catch(() => console.log('Connexion a MongoDB échouée'));


//Ecoute des reponse du serveur avec l'entete
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin,X-Requested-With,Content,Accept,Content-Type,Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,PATCH,OPTIONS');
    next();
});

app.use(bodyParser.json());

app.use('./api/sauces', sauceRoute);
app.use('./api/auth', userRoute);


module.exports = app;