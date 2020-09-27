const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');


const chemin = require('path');
const app = express();

const sauceRoute = require('./routes/sauce');
const userRoute = require('./routes/routeUser');

require('dotenv').config()
console.log(process.env.DB_NAME)
mongoose.connect('mongodb+srv://' + process.env.DB_NAME + ":" + process.env.DB_PASS  + '@cluster0.tkyck.mongodb.net/<dbname>?retryWrites=true&w=majority',
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => console.log('Connexion a MongoDB réussi'))
    .catch(() => console.log('Connexion a MongoDB échouée'));



/*Ecoute des reponse du serveur avec l'entete*/
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin,X-Requested-With,Content,Accept,Content-Type,Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,PATCH,OPTIONS');
    next();
});

app.use(bodyParser.json());

app.use('/images', express.static(chemin.join(__dirname, 'images')));
app.use('/api/sauces', sauceRoute);
app.use('/api/auth', userRoute);


module.exports = app;