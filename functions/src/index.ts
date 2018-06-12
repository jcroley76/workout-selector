import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
admin.initializeApp();
const env = functions.config();

import * as algoliasearch from 'algoliasearch';

/*
From: https://angularfirebase.com/lessons/algolia-firestore-quickstart-with-firebase-cloud-functions/#Algolia-Firestore-Cloud-Function
 */

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
    return indexAW.addObject({
      objectId,
      ...data
    });
  });

exports.unindexAvailableWorkout = functions.firestore
  .document('available-workouts/{id}')
  .onDelete((snap, context) => {
    const objectId = snap.id;

    // Delete an ID from the index
    return indexAW.deleteObject(objectId);
  });

exports.indexExercise = functions.firestore
  .document('exercises/{id}')
  .onCreate((snap, context) => {
    const data = snap.data();
    const objectId = snap.id;

    // Add the data to the algolia index
    return indexEX.addObject({
      objectId,
      ...data
    });
  });

exports.unindexExercise = functions.firestore
  .document('exercises/{id}')
  .onDelete((snap, context) => {
    const objectId = snap.id;

    // Delete an ID from the index
    return indexEX.deleteObject(objectId);
  });
