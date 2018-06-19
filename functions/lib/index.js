"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();
const env = functions.config();
const algoliasearch = require("algoliasearch");
/*
From: https://angularfirebase.com/lessons/algolia-firestore-quickstart-with-firebase-cloud-functions/#Algolia-Firestore-Cloud-Function
 */
// Account: https://console.cloud.google.com/billing/01BC3D-12638C-CC67C2/history?consoleUI=FIREBASE&authuser=0&pli=1
// Initialize the Algolia Client
const client = algoliasearch(env.algolia.appid, env.algolia.apikey);
const indexAW = client.initIndex('ngFitnessLog_AvailableWorkouts');
const indexEX = client.initIndex('ngFitnessLog_Exercises');
exports.indexAvailableWorkout = functions.firestore
    .document('available-workouts/{id}')
    .onCreate((snap, context) => {
    const data = snap.data();
    const objectId = snap.id;
    // Add the data to the algolia index
    return indexAW.addObject(Object.assign({ objectId }, data));
});
// TODO: Delete AvailableWorkout not working
exports.unindexAvailableWorkout = functions.firestore
    .document('available-workouts/{id}')
    .onDelete((snap, context) => {
    const objectId = snap.id;
    // Delete an ID from the index
    return indexAW.deleteObject(objectId, function (err, content) {
        if (err)
            throw err;
        console.log(content);
    });
});
exports.indexExercise = functions.firestore
    .document('exercises/{id}')
    .onCreate((snap, context) => {
    const data = snap.data();
    const objectId = snap.id;
    // Add the data to the algolia index
    return indexEX.addObject(Object.assign({ objectId }, data));
});
// TODO: Delete Exercise not working
exports.unindexExercise = functions.firestore
    .document('exercises/{id}')
    .onDelete((snap, context) => {
    const objectId = snap.id;
    // Delete an ID from the index
    return indexEX.deleteObject(objectId, function (err, content) {
        if (err)
            throw err;
        console.log(content);
    });
});
//# sourceMappingURL=index.js.map