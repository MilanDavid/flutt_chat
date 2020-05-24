const functions = require('firebase-functions');
const admin = require('firebase-admin');
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const Client = require("@googlemaps/google-maps-services-js").Client;
admin.initializeApp(functions.config().firebase);

const app = express();
const client = new Client({});

app.use(cors({ origin: true }));

app.post('/', functions.https.onRequest((req, res) => {
    console.log('[BODY]: ', req.body);
    admin.database().ref(`/sensorData/${req.body['dev_id']}`).push(req.body);
    res.send('Done');
}));

app.get('/getDirection', functions.https.onRequest((req, res) => {
    // console.log(req.query.origin);
    // console.log(req.query.destination);
    client.directions({
        params: {
            origin: req.query.origin,
            destination: req.query.destination,
            mode: "driving",
            key: 'AIzaSyCifPElAhRRo-pdqDYgTa0HGQu61ysYBEA'
        }
    })
    .then(r => {
        return res.send(r.data);
    })
    .catch(e => {
        return res.send(e);
    });
}));

exports.ttndata = functions.https.onRequest(app);

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
exports.myFunction = functions.firestore
    .document('chat/{message}')
    .onCreate((snap, context) => {
        console.log(snap.data());

        return;
    });
